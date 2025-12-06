'use client';

import { useState, useMemo } from 'react';
import { Search, Star, Tv, Filter, ChevronDown, Check } from 'lucide-react';
import { Channel } from '@/utils/m3u-parser';
import { cn } from '@/lib/utils';
import { getCode } from 'country-list';

interface SidebarProps {
    channels: Channel[];
    selectedChannel: Channel | null;
    onSelectChannel: (channel: Channel) => void;
    favoriteIds?: Set<string>;
    onToggleFavorite?: (channel: Channel) => void;
    className?: string;
}

// Helper to get flag image URL
function getFlagUrl(countryCode: string) {
    if (!countryCode) return '';
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export function Sidebar({ channels, selectedChannel, onSelectChannel, favoriteIds = new Set(), onToggleFavorite, className }: SidebarProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedCountry, setSelectedCountry] = useState<string>('All');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [limit, setLimit] = useState(50);

    const [showFavorites, setShowFavorites] = useState(false);

    const categories = useMemo(() => {
        const counts = channels.reduce((acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const unique = Object.keys(counts).sort();
        return [
            { name: 'All', count: channels.length },
            ...unique.map(cat => ({ name: cat, count: counts[cat] }))
        ];
    }, [channels]);

    const countries = useMemo(() => {
        // Filter countries based on selected category first (dependent dropdown)
        const relevantChannels = selectedCategory === 'All'
            ? channels
            : channels.filter(c => c.category === selectedCategory);

        const counts = relevantChannels.reduce((acc, c) => {
            if (c.country && c.country !== 'Unknown') {
                acc[c.country] = (acc[c.country] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const unique = Object.keys(counts).sort();
        return [
            { name: 'All', count: relevantChannels.length, code: '' },
            ...unique.map(name => {
                const code = getCode(name) || '';
                return { name: name, count: counts[name], code: code };
            })
        ];
    }, [channels, selectedCategory]);

    const matchedChannels = useMemo(() => {
        return channels.filter((c) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
            const matchesCountry = selectedCountry === 'All' || c.country === selectedCountry;
            const matchesFavorite = !showFavorites || favoriteIds.has(c.id);
            return matchesSearch && matchesCategory && matchesCountry && matchesFavorite;
        });
    }, [channels, search, selectedCategory, selectedCountry, showFavorites, favoriteIds]);

    const visibleChannels = useMemo(() => {
        return matchedChannels.slice(0, limit);
    }, [matchedChannels, limit]);

    // Only show categories if there are more than just "All" and "Uncategorized" (or 1 real category)
    // Actually, if we use country list, categories usually become just "Uncategorized"
    // So if categories.length <= 2, we might want to hide it
    // But let's check if the 'Uncategorized' count is basically everything.
    const showCategoryFilter = categories.length > 2;

    const selectedCountryCode = selectedCountry !== 'All' ? getCode(selectedCountry) : null;
    // Default globe for All

    return (
        <aside
            className={cn(
                'flex flex-col bg-[#0F0E17] transition-all duration-300 ease-in-out',
                'w-full md:w-72',
                'h-full', // Take available height from parent (which calculates flex)
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
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setLimit(50);
                        }}
                    />
                </div>

                {/* Category Filter - Conditionally Rendered */}
                {showCategoryFilter && (
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-[#A29BFE] z-10" />
                        <button
                            onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsCountryOpen(false); }}
                            className="w-full h-10 rounded-lg bg-[#ffffff]/5 pl-9 pr-4 text-sm text-[#EAEAEA] text-left outline-none focus:ring-1 focus:ring-[#3A0CA3] border border-transparent flex items-center justify-between group"
                        >
                            <span className="truncate mr-2">{selectedCategory}</span>
                            <ChevronDown className={cn("h-4 w-4 text-[#A29BFE] transition-transform flex-shrink-0", isCategoryOpen && "rotate-180")} />
                        </button>

                        {isCategoryOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                                <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg bg-[#0F0E17] border border-[#3A0CA3]/50 shadow-xl z-20 scrollbar-thin scrollbar-thumb-[#F72585]">
                                    {categories.map((category) => (
                                        <button
                                            key={category.name}
                                            onClick={() => {
                                                setSelectedCategory(category.name);
                                                setSelectedCountry('All'); // Reset country when category changes
                                                setIsCategoryOpen(false);
                                                setLimit(50);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between",
                                                selectedCategory === category.name
                                                    ? "bg-[#3A0CA3] text-white"
                                                    : "text-[#EAEAEA] hover:bg-[#A29BFE]/10"
                                            )}
                                        >
                                            <span className="truncate mr-2">{category.name}</span>
                                            <span className={cn(
                                                "text-xs flex-shrink-0",
                                                selectedCategory === category.name ? "text-white/70" : "text-[#A29BFE]"
                                            )}>
                                                {category.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Country Filter */}
                <div className="relative">
                    <div className="absolute left-3 top-2.5 flex items-center justify-center w-5 h-5 pointer-events-none z-10">
                        {selectedCountryCode ? (
                            <img src={getFlagUrl(selectedCountryCode)} alt={selectedCountry} className="w-5 h-3.5 object-contain shadow-sm" />
                        ) : (
                            <span className="text-lg leading-none">🌍</span>
                        )}
                    </div>
                    <button
                        onClick={() => { setIsCountryOpen(!isCountryOpen); setIsCategoryOpen(false); }}
                        className="w-full h-10 rounded-lg bg-[#ffffff]/5 pl-10 pr-3 text-sm text-[#EAEAEA] text-left outline-none focus:ring-1 focus:ring-[#3A0CA3] border border-transparent flex items-center justify-between group overflow-hidden"
                    >
                        {/* Added min-w-0 to allow truncation within flex child */}
                        <span className="truncate min-w-0 flex-1 mr-2">{selectedCountry === 'All' ? 'All Countries' : selectedCountry}</span>
                        <ChevronDown className={cn("h-4 w-4 text-[#A29BFE] transition-transform flex-shrink-0", isCountryOpen && "rotate-180")} />
                    </button>

                    {isCountryOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsCountryOpen(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-lg bg-[#0F0E17] border border-[#3A0CA3]/50 shadow-xl z-20 scrollbar-thin scrollbar-thumb-[#F72585]">
                                {countries.map((country) => (
                                    <button
                                        key={country.name}
                                        onClick={() => {
                                            setSelectedCountry(country.name);
                                            setIsCountryOpen(false);
                                            setLimit(50);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2",
                                            selectedCountry === country.name
                                                ? "bg-[#3A0CA3] text-white"
                                                : "text-[#EAEAEA] hover:bg-[#A29BFE]/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="flex-shrink-0 flex items-center justify-center w-5 text-center">
                                                {country.code ? (
                                                    <img src={getFlagUrl(country.code)} alt={country.name} className="w-5 h-3.5 object-contain shadow-sm" />
                                                ) : (
                                                    <span className="text-base">🌍</span>
                                                )}
                                            </span>
                                            <span className="truncate">{country.name === 'All' ? 'All Countries' : country.name}</span>
                                        </div>
                                        <span className={cn(
                                            "text-xs flex-shrink-0",
                                            selectedCountry === country.name ? "text-white/70" : "text-[#A29BFE]"
                                        )}>
                                            {country.count}
                                        </span>
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
                            className="w-full py-2.5 rounded-lg border border-[#A29BFE]/20 hover:border-[#F72585]/50 bg-transparent hover:bg-[#F72585]/5 text-[#A29BFE] hover:text-white transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 group"
                        >
                            <span>Load More Channels</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
