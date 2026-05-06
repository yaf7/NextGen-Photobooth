import Link from "next/link";
import { Sparkles, Camera, Image as ImageIcon, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-x-hidden">
      {/* Background */}
      <div className="aurora-bg" aria-hidden="true" />
      
      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src="/dokumen/logo-nexgen.png" 
            alt="NextGen Logo" 
            className="w-10 h-10 object-contain rounded-xl bg-white p-1 shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
          />
          <span className="font-display font-bold gradient-text text-2xl tracking-tight">NextGen</span>
        </div>
        <div className="text-white/50 text-sm font-medium tracking-wide">
          v2.0 Beta
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 sm:px-6 text-center max-w-5xl mx-auto w-full pt-12 md:pt-24 pb-20">
        
        {/* Badge */}
        <div className="glass rounded-full px-4 py-1.5 mb-8 flex items-center gap-2 text-sm text-cyan-300 font-medium border border-cyan-500/30 bg-cyan-500/10">
          <Sparkles size={14} />
          <span>AI-Powered Studio Experience</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-white mb-6 leading-tight">
          Your Digital<br />
          <span className="gradient-text drop-shadow-[0_0_40px_rgba(34,211,238,0.4)]">Photobooth</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Create stunning photo strips and collages with real-time aesthetic filters, customizable layouts, and instant high-quality exports. 
        </p>

        {/* CTA Button */}
        <div className="relative inline-flex group mt-4">
          <div className="absolute inset-0 rounded-full breathing-glow opacity-80 transition-all duration-300 group-hover:scale-105" />
          <Link 
            href="/booth"
            className="relative flex items-center gap-3 px-10 py-5 rounded-full text-white font-bold text-lg transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
            }}
          >
            <Camera size={22} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Enter Studio</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 md:mt-32 w-full text-center">
          <FeatureCard 
            icon={<Zap size={24} className="text-cyan-400" />}
            title="Real-Time Filters"
            desc="Apply premium cinematic and vintage color grading live through your webcam."
          />
          <FeatureCard 
            icon={<ImageIcon size={24} className="text-blue-400" />}
            title="Aesthetic Layouts"
            desc="Choose from classic strips to modern grids, perfectly framed for sharing."
          />
          <FeatureCard 
            icon={<Sparkles size={24} className="text-indigo-400" />}
            title="Instant Export"
            desc="Download high-resolution collages instantly without any watermarks."
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-white/5">
        <p className="text-xs text-white/30 tracking-widest uppercase">
          Developed by <strong className="text-white/60">Deyafa Arsetya</strong>
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
