import Link from "next/link";
import { Sparkles, Camera, Image as ImageIcon, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center overflow-x-hidden">
      {/* Background */}
      <div className="aurora-bg" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex justify-end max-w-7xl mx-auto">
        <div className="text-white/50 text-sm font-medium tracking-wide">
          v1.0 Beta
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 grow shrink-0 flex flex-col items-center px-4 sm:px-6 text-center max-w-5xl mx-auto w-full pt-12 md:pt-24 pb-20">

        {/* Logo Centered */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <img
            src="/dokumen/logo-nexgen.png"
            alt="NextGen Logo"
            className="w-24 h-24 object-contain rounded-2xl bg-white p-2 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          />
          <span className="font-display font-black gradient-text text-4xl tracking-tight">NextGen</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-white mb-8 leading-snug">
          Photobooth<br />
          <span className="gradient-text drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]">Digital Anda</span>
        </h1>

        <p className="text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
          Buat strip foto dan kolase memukau dengan filter estetik real-time, tata letak yang dapat disesuaikan, dan ekspor kualitas tinggi instan.
        </p>

        {/* CTA Button */}
        <div className="relative inline-flex group mt-8 shrink-0">
          <div className="absolute inset-0 rounded-full breathing-glow opacity-80 transition-all duration-300 group-hover:scale-105" />
          <Link
            href="/booth"
            className="relative flex items-center gap-4 px-14 py-6 rounded-full text-white font-bold text-2xl transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
            }}
          >
            <Camera size={32} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Masuk Studio</span>
          </Link>
        </div>

        {/* Spacer to prevent overlap on short screens */}
        <div className="h-24 md:h-32 shrink-0 w-full" aria-hidden="true" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center shrink-0 z-10">
          <FeatureCard
            icon={<Zap size={24} className="text-cyan-400" />}
            title="Filter Real-Time"
            desc="Terapkan pewarnaan sinematik dan vintage premium secara langsung melalui webcam Anda."
          />
          <FeatureCard
            icon={<ImageIcon size={24} className="text-blue-400" />}
            title="Tata Letak Estetik"
            desc="Pilih dari strip klasik hingga kisi modern, terbingkai sempurna untuk dibagikan."
          />
          <FeatureCard
            icon={<Sparkles size={24} className="text-indigo-400" />}
            title="Ekspor Instan"
            desc="Unduh kolase resolusi tinggi secara instan tanpa watermark apa pun."
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-white/5 shrink-0 mt-12">
        <p className="text-xs text-white/30 tracking-widest uppercase">
          Dikembangkan oleh <strong className="text-white/60">Deyafa Arsetya</strong>
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass glass-hover rounded-3xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-2">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
