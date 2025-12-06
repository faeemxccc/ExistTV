
import { Dashboard } from '@/components/dashboard';
import { parseM3U } from '@/utils/m3u-parser';

export const revalidate = 86400; // Cache for 24 hours
export const dynamic = 'force-static';

async function getChannels() {
    try {
        const res = await fetch('https://iptv-org.github.io/iptv/index.category.m3u', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch playlist');
        const text = await res.text();
        const channels = parseM3U(text, 'category'); // Default implicit, but nice to be explicit
        // Return significantly more channels to avoid truncating countries (A-F issue)
        // Ideally we should paginate properly, but for now this fixes the "Missing Countries" bug.
        return channels.slice(0, 15000);
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
