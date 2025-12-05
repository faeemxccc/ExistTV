'use client';

import { useState, useMemo } from 'react';
import { Search, Star, Tv, Filter, ChevronDown } from 'lucide-react';
import { Channel } from '@/utils/m3u-parser';
import { cn } from '@/lib/utils';


interface SidebarProps {
    channels: Channel[];
    selectedChannel: Channel | null;
    onSelectChannel: (channel: Channel) => void;
    favoriteIds?: Set<string>;
    onToggleFavorite?: (channel: Channel) => void;
    className?: string;
}

export function Sidebar({ channels, selectedChannel, onSelectChannel, favoriteIds = new Set(), onToggleFavorite, className }: SidebarProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [limit, setLimit] = useState(50);

    const [showFavorites, setShowFavorites] = useState(false);

    const categories = useMemo(() => {
        const unique = new Set(channels.map(c => c.category));
        return ['All', ...Array.from(unique).sort()];
    }, [channels]);

    const matchedChannels = useMemo(() => {
        return channels.filter((c) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
            const matchesFavorite = !showFavorites || favoriteIds.has(c.id);
            return matchesSearch && matchesCategory && matchesFavorite;
        });
    }, [channels, search, selectedCategory, showFavorites, favoriteIds]);

    const visibleChannels = useMemo(() => {
        return matchedChannels.slice(0, limit);
    }, [matchedChannels, limit]);


    return (
        <aside
            className={cn(
                'flex flex-col bg-[#0F0E17] transition-all duration-300 ease-in-out',
                'w-full md:w-72',
                'h-[500px] md:h-full', // Fixed height for mobile list or full height for desktop
                'order-2 md:order-1',   // Mobile: Bottom, Desktop: Left
                'border-t md:border-t-0 border-[#A29BFE]/20 md:border-r', // Mobile: Top border, Desktop: Right border
                className
            )}
        >
            <div className="hidden md:flex h-16 items-center justify-between px-4 border-b border-[#A29BFE]/20">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#F72585] to-[#A29BFE] bg-clip-text text-transparent flex items-center gap-2">
                    <img src="/logo.svg" className="h-6 w-6" alt="ExistTV" />
                    ExistTV
                </h1>
            </div>

            <div className="p-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A29BFE]" />
                    <input
                        type="text"
                        placeholder="Search channels..."
                        className="w-full h-10 rounded-lg bg-[#ffffff]/5 pl-9 pr-4 text-sm text-[#EAEAEA] outline-none focus:ring-1 focus:ring-[#F72585] border border-transparent placeholder:text-gray-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-2.5 h-4 w-4 text-[#A29BFE] z-10" />
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full h-10 rounded-lg bg-[#ffffff]/5 pl-9 pr-4 text-sm text-[#EAEAEA] text-left outline-none focus:ring-1 focus:ring-[#3A0CA3] border border-transparent flex items-center justify-between"
                    >
                        <span className="truncate">{selectedCategory}</span>
                        <ChevronDown className={cn("h-4 w-4 text-[#A29BFE] transition-transform", isCategoryOpen && "rotate-180")} />
                    </button>

                    {isCategoryOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg bg-[#0F0E17] border border-[#3A0CA3]/50 shadow-xl z-20 scrollbar-thin scrollbar-thumb-[#F72585]">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setIsCategoryOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm transition-colors",
                                            selectedCategory === category
                                                ? "bg-[#3A0CA3] text-white"
                                                : "text-[#EAEAEA] hover:bg-[#A29BFE]/10"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Favorites Toggle */}
                <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={cn(
                        "w-full h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all border",
                        showFavorites
                            ? "bg-[#F72585] text-white border-[#F72585] shadow-[0_0_10px_#F72585aa]"
                            : "bg-[#ffffff]/5 text-[#EAEAEA] border-transparent hover:bg-[#ffffff]/10"
                    )}
                >
                    <Star className={cn("h-4 w-4", showFavorites ? "fill-white" : "")} />
                    {showFavorites ? "Showing Favorites" : "Show Favorites Only"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-[#F72585]/50 scrollbar-track-transparent">
                {visibleChannels.map((channel) => (
                    <div
                        key={channel.id}
                        onClick={() => onSelectChannel(channel)}
                        className={cn(
                            'group relative w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all cursor-pointer',
                            selectedChannel?.id === channel.id
                                ? 'bg-[#3A0CA3] text-white shadow-[0_0_10px_#3A0CA3aa]'
                                : 'text-[#EAEAEA] hover:bg-[#A29BFE]/10 hover:text-[#A29BFE]'
                        )}
                    >
                        <div className="h-8 w-8 flex-shrink-0 bg-black/20 rounded flex items-center justify-center overflow-hidden">
                            {channel.logo ? (
                                <img src={channel.logo} alt={channel.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                            ) : (
                                <Tv className="h-4 w-4 opacity-50" />
                            )}
                        </div>
                        <span className="truncate flex-1">{channel.name}</span>
                        {onToggleFavorite && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onToggleFavorite(channel);
                                }}
                                className={cn(
                                    "p-1 rounded-full hover:bg-white/10 transition-colors",
                                    favoriteIds.has(channel.id) ? "text-[#F72585] fill-[#F72585]" : "text-gray-500 opacity-0 group-hover:opacity-100"
                                )}
                            >
                                <Star className="h-4 w-4" fill={favoriteIds.has(channel.id) ? "currentColor" : "none"} />
                            </button>
                        )}
                    </div>
                ))}
                {visibleChannels.length < matchedChannels.length && (
                    <div className="pt-2 pb-6 px-2">
                        <button
                            onClick={() => setLimit((l) => l + 50)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3A0CA3] to-[#F72585] text-white font-bold text-sm shadow-[0_0_15px_#3A0CA3aa] hover:shadow-[0_0_25px_#F72585aa] hover:scale-[1.02] transition-all duration-300"
                        >
                            Load More Channels
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
