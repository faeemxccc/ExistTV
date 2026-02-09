import Link from 'next/link';
import { ArrowLeft, ArrowRight, Play, Search, Tv, Wifi, Heart, Settings, Globe, Zap, Shield, Check } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-bg text-fg">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-bg/80 backdrop-blur-sm border-b border-border">
                <Link href="/" className="flex items-center gap-2 text-muted hover:text-fg transition-fast">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">Back</span>
                </Link>
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.svg" className="h-6 w-6" alt="" />
                    <span className="font-semibold">ExistTV</span>
                </Link>
                <Link
                    href="/watch"
                    className="px-4 py-2 bg-fg text-bg text-sm font-medium rounded-full hover:opacity-90 transition-fast"
                >
                    Watch Now
                </Link>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 text-center">
                <h1 className="text-4xl sm:text-5xl font-black mb-4 animate-up">
                    How ExistTV Works
                </h1>
                <p className="text-lg text-muted max-w-xl mx-auto animate-up delay-1">
                    Stream 10,000+ live channels from around the world — completely free.
                </p>
            </section>

            {/* Architecture Diagram */}
            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">System Architecture</h2>

                    <div className="relative">
                        {/* Flow Diagram */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            {/* IPTV-org */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border text-center min-w-[160px] animate-up">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                                    <Globe className="h-6 w-6 text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-sm">IPTV-org</h3>
                                <p className="text-xs text-muted mt-1">Channel Database</p>
                            </div>

                            <ArrowRight className="h-6 w-6 text-muted rotate-90 md:rotate-0" />

                            {/* ExistTV Server */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border text-center min-w-[160px] animate-up delay-1">
                                <div className="w-12 h-12 rounded-xl bg-fg/10 flex items-center justify-center mb-3">
                                    <Tv className="h-6 w-6 text-fg" />
                                </div>
                                <h3 className="font-semibold text-sm">ExistTV</h3>
                                <p className="text-xs text-muted mt-1">Web Application</p>
                            </div>

                            <ArrowRight className="h-6 w-6 text-muted rotate-90 md:rotate-0" />

                            {/* HLS Player */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border text-center min-w-[160px] animate-up delay-2">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
                                    <Play className="h-6 w-6 text-green-400" />
                                </div>
                                <h3 className="font-semibold text-sm">HLS.js Player</h3>
                                <p className="text-xs text-muted mt-1">Video Streaming</p>
                            </div>

                            <ArrowRight className="h-6 w-6 text-muted rotate-90 md:rotate-0" />

                            {/* User */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-surface border border-border text-center min-w-[160px] animate-up delay-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                                    <Wifi className="h-6 w-6 text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-sm">Your Browser</h3>
                                <p className="text-xs text-muted mt-1">Any Device</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Flow */}
            <section className="py-16 px-6 border-t border-border bg-surface/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Data Flow</h2>

                    <div className="space-y-8">
                        {[
                            {
                                step: "1",
                                title: "Fetch Playlist",
                                desc: "ExistTV fetches the latest M3U playlist from IPTV-org's open database containing 10,000+ channels.",
                                icon: Globe,
                                color: "blue"
                            },
                            {
                                step: "2",
                                title: "Parse Channels",
                                desc: "Our parser extracts channel metadata: name, logo, category, country, and stream URL.",
                                icon: Settings,
                                color: "yellow"
                            },
                            {
                                step: "3",
                                title: "Display & Filter",
                                desc: "Channels are shown in the sidebar. You can search, filter by category, or browse by country.",
                                icon: Search,
                                color: "green"
                            },
                            {
                                step: "4",
                                title: "Stream Video",
                                desc: "When you click a channel, HLS.js loads the stream and plays it directly in your browser.",
                                icon: Play,
                                color: "purple"
                            }
                        ].map((item, i) => (
                            <div
                                key={item.step}
                                className="flex items-start gap-6 animate-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center`}>
                                    <item.icon className={`h-6 w-6 text-${item.color}-400`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-muted">STEP {item.step}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                                    <p className="text-muted text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: Globe, title: "100+ Countries", desc: "Global channel coverage" },
                            { icon: Zap, title: "Instant Play", desc: "No buffering delays" },
                            { icon: Heart, title: "Favorites", desc: "Save preferred channels" },
                            { icon: Settings, title: "Quality Control", desc: "Auto or manual quality" },
                            { icon: Shield, title: "No Sign-up", desc: "Zero personal data" },
                            { icon: Tv, title: "10,000+ Channels", desc: "News, sports, movies..." }
                        ].map((feature, i) => (
                            <div
                                key={feature.title}
                                className="p-5 rounded-xl bg-surface border border-border animate-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <feature.icon className="h-5 w-5 text-fg/70 mb-3" />
                                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 px-6 border-t border-border bg-surface/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Technology Stack</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-3 px-4 text-sm font-semibold">Technology</th>
                                    <th className="py-3 px-4 text-sm font-semibold">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { tech: "Next.js 16", purpose: "React framework with App Router" },
                                    { tech: "Tailwind CSS", purpose: "Utility-first styling" },
                                    { tech: "HLS.js", purpose: "HTTP Live Streaming playback" },
                                    { tech: "Lucide Icons", purpose: "Clean, consistent icons" },
                                    { tech: "IPTV-org", purpose: "Open-source channel database" }
                                ].map((row) => (
                                    <tr key={row.tech} className="border-b border-border/50">
                                        <td className="py-3 px-4 font-medium">{row.tech}</td>
                                        <td className="py-3 px-4 text-muted">{row.purpose}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 border-t border-border text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Watch?</h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                    Start streaming 10,000+ channels right now — no sign-up required.
                </p>
                <Link
                    href="/watch"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-fg text-bg text-lg font-semibold rounded-full hover:opacity-90 transition-fast hover-lift"
                >
                    Start Watching
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-border">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
                    <div className="flex items-center gap-2">
                        <img src="/logo.svg" className="h-5 w-5" alt="" />
                        <span>ExistTV</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:text-fg transition-fast">Home</Link>
                        <a href="https://github.com/iptv-org/iptv" target="_blank" rel="noreferrer" className="hover:text-fg transition-fast">IPTV-org</a>
                        <a href="https://github.com/faeemxccc/ExistTV" target="_blank" rel="noreferrer" className="hover:text-fg transition-fast">GitHub</a>
                    </div>
                    <span className="opacity-50">© 2025</span>
                </div>
            </footer>
        </div>
    );
}
