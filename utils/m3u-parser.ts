
import { getName } from 'country-list';

export interface Channel {
    id: string; // generated uuid or derived from index/name
    name: string;
    logo: string;
    category: string;
    country: string;
    url: string;
}

export function parseM3U(content: string, grouping: 'category' | 'country' = 'category'): Channel[] {
    const lines = content.split('\n');
    const channels: Channel[] = [];
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith('#EXTINF:')) {
            // Parse metadata
            const logoMatch = line.match(/tvg-logo="([^"]*)"/);
            const groupMatch = line.match(/group-title="([^"]*)"/);
            const countryMatch = line.match(/tvg-country="([^"]*)"/);
            const idMatch = line.match(/tvg-id="([^"]*)"/);
            const nameMatch = line.match(/,(.+)$/);

            const groupValue = groupMatch ? groupMatch[1] : undefined;

            // Map group-title based on grouping mode
            let category = 'Uncategorized';
            let country = countryMatch ? countryMatch[1] : 'Unknown';

            // Fallback: Try to extract country from tvg-id (e.g. "Channel.us" -> "US")
            if (country === 'Unknown' && idMatch) {
                const id = idMatch[1];
                const codeMatch = id.match(/\.([a-z]{2})(?:@|$)/i);
                if (codeMatch) {
                    const code = codeMatch[1].toUpperCase();
                    const name = getName(code);
                    if (name) country = name;
                }
            }

            if (grouping === 'country') {
                if (groupValue) country = groupValue;
                // Category remains Uncategorized
            } else {
                if (groupValue) category = groupValue;
                // Country remains from tvg-country or derived from ID
            }

            currentChannel = {
                logo: logoMatch ? logoMatch[1] : '',
                category: category,
                country: country,
                name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
            };
        } else if (!line.startsWith('#')) {
            // It's a URL
            if (currentChannel.name && line.startsWith('http')) {
                channels.push({
                    id: (typeof Buffer !== 'undefined' ? Buffer.from(line).toString('base64') : (typeof btoa !== 'undefined' ? btoa(encodeURIComponent(line).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))) : line)) + `-${i}`,
                    name: currentChannel.name,
                    logo: currentChannel.logo || '',
                    category: currentChannel.category || 'Uncategorized',
                    country: currentChannel.country || 'Unknown',
                    url: line,
                });
                currentChannel = {}; // Reset
            }
        }
    }

    return channels;
}
