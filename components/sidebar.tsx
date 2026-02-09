'use client';

import { useState, useMemo } from 'react';
import { Search, Star, Tv, ChevronDown, X } from 'lucide-react';
import { Channel } from '@/utils/m3u-parser';
import { cn } from '@/lib/utils';
import { getCode } from 'country-list';

interface SidebarProps {
    channels: Channel[];
    selectedChannel: Channel | null;
    onSelectChannel: (channel: Channel) => void;
    favoriteIds?: Set<string>;
    onToggleFavorite?: (channel: Channel) => void;
    isOpen: boolean;
    onClose: () => void;
}

function getFlagUrl(countryCode: string) {
    if (!countryCode) return '';
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export function Sidebar({
    channels,
    selectedChannel,
    onSelectChannel,
    favoriteIds = new Set(),
    onToggleFavorite,
    isOpen,
    onClose
}: SidebarProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedCountry, setSelectedCountry] = useState<string>('All');
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [limit, setLimit] = useState(50);

    // Categories
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

    // Countries
    const countries = useMemo(() => {
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
            ...unique.map(name => ({
                name,
                count: counts[name],
                code: getCode(name) || ''
            }))
        ];
    }, [channels, selectedCategory]);

    // Filtered channels
    const matchedChannels = useMemo(() => {
        return channels.filter((c) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
            const matchesCountry = selectedCountry === 'All' || c.country === selectedCountry;
            const matchesFavorite = !showFavorites || favoriteIds.has(c.id);
            return matchesSearch && matchesCategory && matchesCountry && matchesFavorite;
        });
    }, [channels, search, selectedCategory, selectedCountry, showFavorites, favoriteIds]);

    const visibleChannels = matchedChannels.slice(0, limit);
    const selectedCountryCode = selectedCountry !== 'All' ? getCode(selectedCountry) : null;

    return (
        <aside className={cn(
            "fixed md:relative h-full bg-bg border-r border-border flex flex-col z-40 transition-transform duration-300",
            "w-80",
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:border-0 md:overflow-hidden"
        )}>
            {/* Header */}
            <div className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" className="h-6 w-6" alt="" />
                    <span className="font-semibold text-fg">ExistTV</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-muted hover:text-fg transition-fast md:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Search */}
            <div className="flex-shrink-0 p-3 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search channels..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setLimit(50); }}
                        className="w-full h-10 rounded-lg bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-muted border border-border focus:border-fg/30 outline-none transition-fast"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex-shrink-0 p-3 space-y-2 border-b border-border">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                    {categories.slice(0, 6).map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => { setSelectedCategory(cat.name); setSelectedCountry('All'); setLimit(50); }}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-fast",
                                selectedCategory === cat.name
                                    ? "bg-fg text-bg"
                                    : "bg-surface text-muted hover:text-fg border border-border"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Second Row: Favorites + Country */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-fast flex items-center justify-center gap-1.5",
                            showFavorites
                                ? "bg-fg text-bg"
                                : "bg-surface text-muted hover:text-fg border border-border"
                        )}
                    >
                        <Star className="h-3.5 w-3.5" fill={showFavorites ? "currentColor" : "none"} />
                        Favorites
                    </button>

                    {/* Country Dropdown */}
                    <div className="relative flex-1">
                        <button
                            onClick={() => setIsCountryOpen(!isCountryOpen)}
                            className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-surface text-muted hover:text-fg border border-border transition-fast flex items-center justify-between gap-2"
                        >
                            <span className="flex items-center gap-1.5 truncate">
                                {selectedCountryCode ? (
                                    <img src={getFlagUrl(selectedCountryCode)} alt="" className="w-4 h-3 object-contain" />
                                ) : (
                                    <span>🌍</span>
                                )}
                                <span className="truncate">{selectedCountry === 'All' ? 'Country' : selectedCountry}</span>
                            </span>
                            <ChevronDown className={cn("h-3.5 w-3.5 flex-shrink-0 transition-fast", isCountryOpen && "rotate-180")} />
                        </button>

                        {isCountryOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsCountryOpen(false)} />
                                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg bg-surface border border-border shadow-xl z-20 animate-scale">
                                    {countries.map((country) => (
                                        <button
                                            key={country.name}
                                            onClick={() => { setSelectedCountry(country.name); setIsCountryOpen(false); setLimit(50); }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-fast",
                                                selectedCountry === country.name
                                                    ? "bg-fg/10 text-fg"
                                                    : "text-muted hover:bg-fg/5 hover:text-fg"
                                            )}
                                        >
                                            <span className="w-4 flex-shrink-0">
                                                {country.code ? (
                                                    <img src={getFlagUrl(country.code)} alt="" className="w-4 h-3 object-contain" />
                                                ) : (
                                                    <span>🌍</span>
                                                )}
                                            </span>
                                            <span className="flex-1 truncate">{country.name === 'All' ? 'All Countries' : country.name}</span>
                                            <span className="text-muted">{country.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Channel List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-0.5">
                    {visibleChannels.map((channel, idx) => (
                        <div
                            key={channel.id}
                            onClick={() => onSelectChannel(channel)}
                            style={{ animationDelay: `${Math.min(idx * 15, 200)}ms` }}
                            className={cn(
                                "group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-fast animate-up",
                                selectedChannel?.id === channel.id
                                    ? "bg-fg/10"
                                    : "hover:bg-surface"
                            )}
                        >
                            {/* Logo */}
                            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden">
                                {channel.logo ? (
                                    <img
                                        src={channel.logo}
                                        alt=""
                                        className="w-full h-full object-contain p-1"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <Tv className="h-4 w-4 text-muted" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-fg truncate">{channel.name}</p>
                                <p className="text-xs text-muted truncate">{channel.category}</p>
                            </div>

                            {/* Favorite */}
                            {onToggleFavorite && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(channel);
                                    }}
                                    className={cn(
                                        "p-1.5 rounded-full transition-fast",
                                        favoriteIds.has(channel.id)
                                            ? "text-fg"
                                            : "text-muted opacity-0 group-hover:opacity-100 hover:text-fg"
                                    )}
                                >
                                    <Star className="h-4 w-4" fill={favoriteIds.has(channel.id) ? "currentColor" : "none"} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {visibleChannels.length < matchedChannels.length && (
                    <div className="p-3">
                        <button
                            onClick={() => setLimit(l => l + 50)}
                            className="w-full py-2.5 rounded-lg bg-surface border border-border text-muted hover:text-fg transition-fast text-xs font-medium"
                        >
                            Load more ({matchedChannels.length - visibleChannels.length} more)
                        </button>
                    </div>
                )}

                {visibleChannels.length === 0 && (
                    <div className="p-8 text-center">
                        <p className="text-muted text-sm">No channels found</p>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="flex-shrink-0 p-3 border-t border-border text-center">
                <p className="text-xs text-muted">
                    {matchedChannels.length} channels
                </p>
            </div>
        </aside>
    );
}
