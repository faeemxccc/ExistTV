'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerProps {
    url: string;
}

export function Player({ url }: PlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // New State
    const [levels, setLevels] = useState<{ height: number; bitrate: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = Auto
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [isHoveringControls, setIsHoveringControls] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    let controlsTimeout: NodeJS.Timeout;

    // Buffering Logic with Delay
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (loading) {
            timeout = setTimeout(() => setShowSpinner(true), 4000);
        } else {
            setShowSpinner(false);
        }
        return () => clearTimeout(timeout);
    }, [loading]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setLoading(true);
        setError(null);
        setIsPlaying(false);
        setLevels([]);
        setCurrentLevel(-1);

        if (Hls.isSupported()) {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            });
            hlsRef.current = hls;

            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                setLoading(false);
                // Populate levels
                const availableLevels = data.levels.map(l => ({ height: l.height, bitrate: l.bitrate }));
                setLevels(availableLevels);

                video.play().catch(() => {
                    setIsPlaying(false);
                });
                setIsPlaying(true);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.warn('HLS Error:', data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            setError('Network error. Trying to recover...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            setError('Media error. Trying to recover...');
                            hls.recoverMediaError();
                            break;
                        default:
                            setError(`Fatal playback error: ${data.details}`);
                            hls.destroy();
                            break;
                    }
                }
            });

            // Buffer state
            hls.on(Hls.Events.BUFFER_APPENDING, () => {
                setLoading(true);
            });
            hls.on(Hls.Events.FRAG_BUFFERED, () => {
                setLoading(false);
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                setLoading(false);
                video.play().catch(() => { });
                setIsPlaying(true);
            });
            video.addEventListener('error', (e) => {
                // setError('Native playback error'); // removed to be less intrusive
                console.error(e);
            });
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
            }
        };
    }, [url]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (videoRef.current) {
            videoRef.current.volume = v;
            videoRef.current.muted = v === 0;
            setIsMuted(v === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.parentElement?.requestFullscreen();
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        if (!isHoveringControls) {
            controlsTimeout = setTimeout(() => setShowControls(false), 3000);
        }
    };

    // Reset timeout when leaving controls
    useEffect(() => {
        if (!isHoveringControls && showControls) {
            controlsTimeout = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(controlsTimeout);
    }, [isHoveringControls, showControls]);

    const changeQuality = (levelIndex: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentLevel(levelIndex);
            setShowQualityMenu(false);
        }
    };

    return (
        <div
            className="relative w-full h-full bg-black rounded-xl overflow-hidden group shadow-[0_0_50px_rgba(58,12,163,0.3)] border border-[#3A0CA3]/30 select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onClick={togglePlay}
                playsInline
            />

            {/* Loading Spinner - Conditional with Delay & No Blur */}
            {showSpinner && !error && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#F72585] blur-xl opacity-20 animate-pulse" />
                        <Loader2 className="h-12 w-12 text-[#F72585] animate-spin relative z-10" />
                    </div>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-md">
                    <AlertTriangle className="h-16 w-16 text-[#F72585] mb-4" />
                    <p className="text-[#EAEAEA] text-lg font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-[#F72585] text-white rounded-full hover:scale-105 transition-transform font-bold shadow-[0_0_20px_#F72585aa]"
                    >
                        Reload Stream
                    </button>
                </div>
            )}

            {/* Modern Glass Controls */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 p-3 md:p-6 transition-all duration-500 bg-gradient-to-t from-black/90 via-black/50 to-transparent",
                    showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                onMouseEnter={() => setIsHoveringControls(true)}
                onMouseLeave={() => setIsHoveringControls(false)}
            >
                <div className="flex flex-col gap-4">
                    {/* Progress Bar (Visual Only for Livestreams usually) */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#F72585] to-[#A29BFE] w-full animate-[shimmer_2s_infinite]" />
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <button
                            onClick={togglePlay}
                            className="h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#F72585] hover:text-white hover:scale-110 transition-all border border-white/10 backdrop-blur-md group/play"
                        >
                            {isPlaying ? (
                                <Pause className="h-5 w-5 fill-current" />
                            ) : (
                                <Play className="h-5 w-5 fill-current ml-0.5" />
                            )}
                        </button>

                        <div className="flex items-center gap-3 group/vol bg-white/5 px-2 md:px-4 py-2 rounded-full border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors">
                            <button onClick={toggleMute} className="text-[#A29BFE] hover:scale-110 transition-transform">
                                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </button>
                            <input
                                type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                                className="w-20 md:w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#F72585] hover:accent-[#A29BFE] hidden sm:block"
                            />
                        </div>

                        <div className="flex-1" />

                        <div className="flex items-center gap-2">
                            <div className="flex items-center px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-500 text-xs font-bold animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                LIVE
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative">
                            {/* Quality Selector */}
                            {levels.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                                        className="p-2 text-[#A29BFE] hover:bg-white/10 rounded-full transition-colors"
                                        title="Quality"
                                    >
                                        <Settings className="h-5 w-5" />
                                    </button>

                                    {showQualityMenu && (
                                        <div className="absolute bottom-full mb-2 right-0 bg-black/90 border border-white/10 rounded-lg overflow-hidden min-w-[120px] backdrop-blur-md shadow-xl">
                                            <button
                                                onClick={() => changeQuality(-1)}
                                                className={cn(
                                                    "w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors",
                                                    currentLevel === -1 ? "text-[#F72585] font-bold" : "text-white"
                                                )}
                                            >
                                                Auto
                                            </button>
                                            {levels.map((level, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => changeQuality(index)}
                                                    className={cn(
                                                        "w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors",
                                                        currentLevel === index ? "text-[#F72585] font-bold" : "text-white"
                                                    )}
                                                >
                                                    {level.height}p
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button onClick={() => hlsRef.current?.recoverMediaError()} className="p-2 text-[#A29BFE] hover:bg-white/10 rounded-full transition-colors" title="Reload Stream">
                                <RotateCcw className="h-5 w-5" />
                            </button>

                            <button onClick={toggleFullscreen} className="p-2 text-white hover:text-[#F72585] hover:bg-white/10 rounded-full transition-colors">
                                <Maximize className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
