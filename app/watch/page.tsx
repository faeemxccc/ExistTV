
import { Dashboard } from '@/components/dashboard';
import { parseM3U } from '@/utils/m3u-parser';

export const revalidate = 3600; // Cache for 1 hour

async function getChannels() {
    try {
        const res = await fetch('https://iptv-org.github.io/iptv/index.m3u');
        if (!res.ok) throw new Error('Failed to fetch playlist');
        const text = await res.text();
        const channels = parseM3U(text);
        // Return first 500 channels to avoid payload too large issues for this demo
        // In a real app, we would implement server-side pagination or search.
        return channels.slice(0, 500);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function WatchPage() {
    const channels = await getChannels();

    return (
        <Dashboard initialChannels={channels} />
    );
}
