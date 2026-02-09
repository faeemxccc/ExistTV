'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerProps {
    url: string;
}

export function Player({ url }: PlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [levels, setLevels] = useState<{ height: number; bitrate: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(-1);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    let controlsTimeout: NodeJS.Timeout;

    // Initialize HLS
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setLoading(true);
        setError(null);
        setIsPlaying(false);
        setLevels([]);
        setCurrentLevel(-1);

        if (Hls.isSupported()) {
            if (hlsRef.current) hlsRef.current.destroy();

            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
            });
            hlsRef.current = hls;

            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                setLoading(false);
                setLevels(data.levels.map(l => ({ height: l.height, bitrate: l.bitrate })));
                video.play().catch(() => setIsPlaying(false));
                setIsPlaying(true);
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        setError('Playback error');
                        hls.destroy();
                    }
                }
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                setLoading(false);
                video.play().catch(() => { });
                setIsPlaying(true);
            });
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [url]);

    // Fullscreen listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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
        if (!containerRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            containerRef.current.requestFullscreen();
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        if (!isHovering) {
            controlsTimeout = setTimeout(() => setShowControls(false), 2500);
        }
    };

    const changeQuality = (levelIndex: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentLevel(levelIndex);
            setShowQualityMenu(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setShowControls(false); setShowQualityMenu(false); }}
        >
            {/* Video */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                playsInline
            />

            {/* Loading */}
            {loading && !error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 text-white/40 animate-spin" />
                        <div className="absolute inset-0 h-12 w-12 rounded-full bg-white/5 animate-ping" />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
                    <p className="text-white/70 text-sm mb-3">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-fast"
                    >
                        Reload
                    </button>
                </div>
            )}

            {/* Click to Play Overlay */}
            {!isPlaying && !loading && !error && (
                <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="group w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20">
                        <Play className="h-8 w-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                </div>
            )}

            {/* Controls */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-all duration-500 ease-out",
                    showControls || !isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Progress */}
                <div className="group w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden cursor-pointer hover:h-1.5 transition-all duration-200">
                    <div className="h-full bg-gradient-to-r from-white/60 to-white/80 w-full transition-all duration-200" />
                </div>

                <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className="p-2.5 text-white hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5 fill-current transition-transform duration-200" />
                        ) : (
                            <Play className="h-5 w-5 fill-current ml-0.5 transition-transform duration-200" />
                        )}
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-1">
                        <button onClick={toggleMute} className="p-2 text-white/70 hover:text-white transition-fast">
                            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer hidden sm:block"
                            style={{ accentColor: '#fff' }}
                        />
                    </div>

                    <div className="flex-1" />

                    {/* Live Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                    </div>

                    {/* Quality */}
                    {levels.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowQualityMenu(!showQualityMenu)}
                                className="p-2 text-white/70 hover:text-white transition-fast"
                            >
                                <Settings className="h-4 w-4" />
                            </button>

                            {showQualityMenu && (
                                <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden min-w-[100px] shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button
                                        onClick={() => changeQuality(-1)}
                                        className={cn(
                                            "w-full px-4 py-2.5 text-left text-xs font-medium transition-all duration-150",
                                            currentLevel === -1 ? "text-white bg-white/15" : "text-white/60 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        Auto
                                    </button>
                                    {levels.map((level, i) => (
                                        <button
                                            key={i}
                                            onClick={() => changeQuality(i)}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-left text-xs font-medium transition-all duration-150",
                                                currentLevel === i ? "text-white bg-white/15" : "text-white/60 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            {level.height}p
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reload */}
                    <button
                        onClick={() => hlsRef.current?.recoverMediaError()}
                        className="p-2 text-white/70 hover:text-white hover:rotate-[-360deg] transition-all duration-500"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 text-white/70 hover:text-white hover:scale-110 transition-all duration-200"
                    >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
