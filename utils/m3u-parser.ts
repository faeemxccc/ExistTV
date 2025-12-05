
export interface Channel {
    id: string; // generated uuid or derived from index/name
    name: string;
    logo: string;
    category: string;
    url: string;
}

export function parseM3U(content: string): Channel[] {
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
            const nameMatch = line.match(/,(.+)$/);

            currentChannel = {
                logo: logoMatch ? logoMatch[1] : '',
                category: groupMatch ? groupMatch[1] : 'Uncategorized',
                name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
            };
        } else if (!line.startsWith('#')) {
            // It's a URL
            if (currentChannel.name && line.startsWith('http')) {
                channels.push({
                    id: typeof Buffer !== 'undefined' ? Buffer.from(line).toString('base64') : (typeof btoa !== 'undefined' ? btoa(encodeURIComponent(line).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))) : line),
                    name: currentChannel.name,
                    logo: currentChannel.logo || '',
                    category: currentChannel.category || 'Uncategorized',
                    url: line,
                });
                currentChannel = {}; // Reset
            }
        }
    }

    return channels;
}
