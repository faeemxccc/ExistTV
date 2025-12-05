'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Player } from '@/components/player';
import { Channel } from '@/utils/m3u-parser';
import { cn } from '@/lib/utils';

interface DashboardProps {
    initialChannels: Channel[];
}

export function Dashboard({ initialChannels }: DashboardProps) {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Load favorites from local storage on mount
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

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-[#0F0E17] text-[#EAEAEA] overflow-hidden">

            {/* Main Content - Mobile: Order 1 (Top), Desktop: Order 2 (Right) */}
            <main className="flex-1 flex flex-col h-full relative transition-all duration-300 order-1 md:order-2 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 flex-shrink-0 flex items-center px-4 justify-between border-b border-[#A29BFE]/20 bg-[#0F0E17]/80 backdrop-blur-md z-30">
                    <div className="flex items-center gap-2 md:hidden">
                        <img src="/logo.svg" className="h-6 w-6" alt="ExistTV" />
                        <span className="font-bold bg-gradient-to-r from-[#F72585] to-[#A29BFE] bg-clip-text text-transparent">ExistTV</span>
                    </div>

                    <div className="flex-1 text-center font-medium truncate px-4 text-[#A29BFE]">
                        {selectedChannel ? selectedChannel.name : 'Select a channel'}
                    </div>

                    <div className="w-10"></div> {/* Spacer for balance */}
                </header>

                {/* Player Area - Reduced padding for mobile */}
                <div className="flex-1 flex items-center justify-center bg-black/40 overflow-y-auto p-0 md:p-6">
                    {selectedChannel ? (
                        <div className="w-full max-w-5xl aspect-video md:rounded-xl shadow-[0_0_50px_rgba(58,12,163,0.3)] shadow-[#3A0CA3]/30">
                            <Player key={selectedChannel.id} url={selectedChannel.url} />
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 animate-pulse p-4">
                            <p className="text-xl">Waiting for signal...</p>
                            <p className="text-sm mt-2">Choose a channel from the list</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Sidebar - Mobile: Order 2 (Bottom), Desktop: Order 1 (Left) */}
            <Sidebar
                channels={initialChannels}
                selectedChannel={selectedChannel}
                onSelectChannel={(c) => {
                    setSelectedChannel(c);
                }}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                className="order-2 md:order-1 md:border-r border-[#A29BFE]/20"
            />
        </div>
    );
}
