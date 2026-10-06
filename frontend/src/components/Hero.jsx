import { Sparkles, Calendar, DollarSign, CloudSun, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <header className="pt-16 pb-10 text-center px-6 max-w-4xl mx-auto">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
        <Sparkles size={14} className="text-cyan-400" />
        <span>Personalized AI Travel Architect</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
        Plan Your Perfect Trip <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
          in Seconds with AI
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
        Personalized multi-day travel itineraries with live weather advice,
        smart budget breakdowns, verified hotel picks, and ready-to-export PDF guides.
      </p>

      {/* Key Features Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 text-xs font-medium text-slate-300">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <Calendar size={14} className="text-purple-400" /> Day-by-Day Timeline
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <DollarSign size={14} className="text-emerald-400" /> Smart Budget Split
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <CloudSun size={14} className="text-amber-400" /> Weather & Packing
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <MapPin size={14} className="text-rose-400" /> Google Maps & PDF
        </span>
      </div>
    </header>
  );
}