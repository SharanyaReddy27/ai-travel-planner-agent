import Hero from "../components/Hero";
import PlannerForm from "../components/PlannerForm";
import { Compass, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Branding Bar */}
      <header className="border-b border-slate-850 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass size={20} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Wanderlust <span className="text-cyan-400 font-extrabold">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <Sparkles size={13} className="text-amber-400" />
            <span>AI Travel Planner v4</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        <Hero />

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <PlannerForm />
        </div>
      </main>

      {/* Clean, Subtle Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950/60 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AI Travel Planner. Personalized Travel Recommendations.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Weather Intelligence</span>
            <span>•</span>
            <span>Budget Optimization</span>
            <span>•</span>
            <span>PDF Export</span>
          </div>
        </div>
      </footer>
    </div>
  );
}