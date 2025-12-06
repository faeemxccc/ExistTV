
import Link from 'next/link';
import { Tv, Shield, Globe, Zap, Info, ChevronRight, Terminal, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0E17] text-[#EAEAEA] font-sans selection:bg-[#F72585] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F0E17]/80 backdrop-blur-md border-b border-[#A29BFE]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" className="h-8 w-8 text-[#F72585]" alt="ExistTV" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#F72585] to-[#A29BFE] bg-clip-text text-transparent">
              ExistTV
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/faeemxccc/ExistTV"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-[#EAEAEA]/80 hover:text-[#F72585] transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-6 w-6" />
            </a>
            <Link
              href="/watch"
              className="group px-6 py-2 bg-[#3A0CA3] hover:bg-[#480fb8] text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(58,12,163,0.5)] hover:shadow-[0_0_20px_rgba(58,12,163,0.7)] flex items-center gap-2"
            >
              Launch App <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#3A0CA3] rounded-full blur-[100px] opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#F72585] rounded-full blur-[120px] opacity-20" />

        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A0CA3]/20 border border-[#3A0CA3]/50 text-[#A29BFE] text-xs font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F72585] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F72585]"></span>
            </span>
            v2.0 Now Available with Cyber Theme
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Stream the World <br />
            <span className="bg-gradient-to-r from-[#A29BFE] via-[#F72585] to-[#3A0CA3] bg-clip-text text-transparent">
              Without Limits 🌍
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#EAEAEA]/70 max-w-2xl mx-auto">
            Access 10,000+ live channels instantly. No subscription fees. Just pure, unadulterated entertainment. 🍿🚀
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/watch"
              className="px-8 py-4 bg-gradient-to-r from-[#F72585] to-[#B5179E] text-white text-lg font-bold rounded-xl hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(247,37,133,0.3)] hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] w-full sm:w-auto"
            >
              Start Watching Now 📺
            </Link>
            <Link
              href="#docs"
              className="px-8 py-4 bg-white/5 border border-white/5 backdrop-blur-md text-[#EAEAEA] text-lg font-medium rounded-xl hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              Read Docs 📖
            </Link>
          </div>
        </div>
      </section >

      {/* VPN Alert Banner */}
      < div className="max-w-4xl mx-auto px-6 mb-24" >
        <div className="bg-[#3A0CA3]/10 border border-[#3A0CA3] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3A0CA3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="p-3 bg-[#3A0CA3]/20 rounded-xl">
            <Shield className="h-8 w-8 text-[#A29BFE]" />
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="text-lg font-bold text-[#EAEAEA] mb-1">🛡️ Privacy First Recommendation</h3>
            <p className="text-[#EAEAEA]/70 text-sm">
              For the best streaming experience and privacy, we recommend using a <strong>VPN</strong>.
              While not mandatory, it helps bypass geo-restrictions and keeps your activity secure. 🕵️‍♂️
            </p>
          </div>
        </div>
      </div >

      {/* How It Works Section */}
      < section className="py-20 px-6" >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">
              How Does <span className="text-[#F72585]">ExistTV</span> Work? 🤔
            </h2>
            <p className="text-xl text-[#EAEAEA]/70 max-w-2xl mx-auto">
              It's magic... effectively. But here's what's actually happening behind the scenes! 🎩✨
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#3A0CA3] flex items-center justify-center text-xl font-bold shadow-[0_0_15px_#3A0CA3]">1</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#A29BFE]">The Source 📡</h3>
                  <p className="text-[#EAEAEA]/70 leading-relaxed">
                    TV stations broadcast their content over the internet using protocols like HLS (HTTP Live Streaming). These are public links!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#F72585] flex items-center justify-center text-xl font-bold shadow-[0_0_15px_#F72585]">2</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#F72585]">The Aggregation 📝</h3>
                  <p className="text-[#EAEAEA]/70 leading-relaxed">
                    Communities (like IPTV-org) collect these links into massive lists called M3U playlists. We fetch these lists in real-time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#A29BFE] flex items-center justify-center text-xl font-bold shadow-[0_0_15px_#A29BFE] text-[#0F0E17]">3</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#EAEAEA]">The Experience 📺</h3>
                  <p className="text-[#EAEAEA]/70 leading-relaxed">
                    <strong>ExistTV</strong> takes that messy list and turns it into a beautiful, searchable, Next.js-powered app you can use anywhere.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[#F72585] to-[#3A0CA3]">
              <div className="bg-[#0F0E17] rounded-xl p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#ffffff]/10 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-[#EAEAEA]/40 font-mono">browser.exe</div>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex gap-2">
                    <span className="text-[#F72585]">GET</span>
                    <span className="text-[#A29BFE]">/stream.m3u8</span>
                  </div>
                  <div className="text-[#EAEAEA]/60">Downloading segments...</div>
                  <div className="w-full bg-[#ffffff]/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-[#F72585] to-[#3A0CA3]" />
                  </div>
                  <div className="text-green-400">✓ Buffer complete</div>
                  <div className="text-blue-400">▶ Playing content</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Features Grid */}
      < section className="py-20 px-6 bg-[#0F0E17]/50" >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose <span className="text-[#F72585]">ExistTV</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-[#F72585]" />}
              title="Global Access 🌐"
              desc="Channels from every corner of the globe. News, Sports, Movies - you name it."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-[#FCD34D]" />}
              title="Blazing Fast ⚡"
              desc="Built with Next.js & HLS.js for butter-smooth playback and instant loading times."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-[#A29BFE]" />}
              title="Secure & Private 🔒"
              desc="No tracking, no ads from us. Your viewing habits belong to you and only you."
            />
          </div>
        </div>
      </section >

      {/* Documentation Section */}
      < section id="docs" className="py-24 px-6 max-w-5xl mx-auto" >
        <div className="bg-[#16161a] border border-[#A29BFE]/10 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="h-8 w-8 text-[#A29BFE]" />
            <h2 className="text-3xl font-bold">Documentation & Info 📚</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#F72585]">Getting Started</h3>
              <p className="text-[#EAEAEA]/80 leading-relaxed">
                ExistTV is a web-based IPTV player. You don't need to install anything!
                Simply click "Launch App", select a category from the sidebar (or search for your favorite channel), and start watching.
              </p>
            </div>

            <div className="w-full h-px bg-[#3A0CA3]/20" />

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#A29BFE]">Troubleshooting 🛠️</h3>
              <ul className="space-y-3 text-[#EAEAEA]/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#F72585] mt-1">•</span>
                  <span><strong>Stream Won't Load?</strong> Some channels use streams that are geo-blocked or HTTP (not HTTPS). Try a different channel or enable your VPN.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F72585] mt-1">•</span>
                  <span><strong>No Audio?</strong> Check if the player is muted. Some browsers auto-mute autoplay videos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F72585] mt-1">•</span>
                  <span><strong>Favorites Not Saving?</strong> Favorites are saved to your browser cookies/storage 🍪. Avoid clearing your cache if you want to keep them.</span>
                </li>
              </ul>
            </div>

            <div className="w-full h-px bg-[#3A0CA3]/20" />

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#A29BFE]">Legal Disclaimer ⚖️</h3>
              <p className="text-[#EAEAEA]/60 text-sm leading-relaxed">
                ExistTV does not host any content. All streams are provided by the publicly available <a href="https://github.com/iptv-org/iptv" target="_blank" className="text-[#F72585] hover:underline" rel="noreferrer">IPTV-org</a> project.
                We act solely as a user-interface provider. Please respect copyright laws in your jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="py-12 text-center text-[#EAEAEA]/40 border-t border-[#A29BFE]/10" >
        <p>© 2025 ExistTV. Built with ❤️ and ☕.</p>
      </footer >
    </div >
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-[#ffffff]/5 border border-[#ffffff]/5 hover:border-[#F72585]/30 hover:bg-[#ffffff]/10 transition-all duration-300 group">
      <div className="mb-4 p-3 bg-black/30 w-fit rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#EAEAEA]">{title}</h3>
      <p className="text-[#EAEAEA]/60 leading-relaxed">{desc}</p>
    </div>
  );
}
