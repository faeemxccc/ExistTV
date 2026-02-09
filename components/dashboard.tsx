'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Menu, X } from 'lucide-react';
import { Player } from '@/components/player';
import { Sidebar } from '@/components/sidebar';
import { Channel } from '@/utils/m3u-parser';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardProps {
    initialChannels: Channel[];
}

export function Dashboard({ initialChannels }: DashboardProps) {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('existtv_favorites');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setFavoriteIds(new Set(parsed));
                }
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    const toggleFavorite = (channel: Channel) => {
        const newFavs = new Set(favoriteIds);
        if (newFavs.has(channel.id)) {
            newFavs.delete(channel.id);
        } else {
            newFavs.add(channel.id);
        }
        setFavoriteIds(newFavs);
        localStorage.setItem('existtv_favorites', JSON.stringify(Array.from(newFavs)));
    };

    const handleSelectChannel = (channel: Channel) => {
        setSelectedChannel(channel);
        // On mobile, close sidebar when selecting
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-bg text-fg flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                channels={initialChannels}
                selectedChannel={selectedChannel}
                onSelectChannel={handleSelectChannel}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="flex-shrink-0 h-14 px-4 flex items-center gap-4 border-b border-border bg-bg/80 backdrop-blur-sm z-30 animate-in">
                    {/* Menu Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 -ml-2 text-muted hover:text-fg transition-fast rounded-lg hover:bg-surface"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Back */}
                    <Link
                        href="/"
                        className="hidden sm:flex items-center gap-2 text-muted hover:text-fg transition-fast"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm">Home</span>
                    </Link>

                    {/* Channel Name */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-medium truncate">
                            {selectedChannel?.name || 'Select a channel'}
                        </h1>
                        {selectedChannel?.category && (
                            <p className="text-xs text-muted truncate">{selectedChannel.category}</p>
                        )}
                    </div>

                    {/* Favorite */}
                    {selectedChannel && (
                        <button
                            onClick={() => toggleFavorite(selectedChannel)}
                            className={cn(
                                "p-2 rounded-lg transition-fast",
                                favoriteIds.has(selectedChannel.id)
                                    ? "text-fg bg-surface"
                                    : "text-muted hover:text-fg hover:bg-surface"
                            )}
                        >
                            <Star
                                className="h-5 w-5"
                                fill={favoriteIds.has(selectedChannel.id) ? "currentColor" : "none"}
                            />
                        </button>
                    )}
                </header>

                {/* Player Area */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-black/20">
                    <div className="w-full max-w-6xl animate-scale">
                        {selectedChannel ? (
                            <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
                                <Player key={selectedChannel.id} url={selectedChannel.url} />
                            </div>
                        ) : (
                            <div className="aspect-video rounded-xl bg-surface border border-border flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mx-auto">
                                        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-fg font-medium">No channel selected</p>
                                        <p className="text-sm text-muted mt-1">Choose a channel from the sidebar</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
