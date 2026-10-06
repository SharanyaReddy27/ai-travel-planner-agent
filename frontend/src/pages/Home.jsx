import Hero from "../components/Hero";
import PlannerForm from "../components/PlannerForm";
import { Compass } from "lucide-react";

export default function Home() {
  const scrollToForm = () => {
    const el = document.getElementById("planner-card");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#26332C] flex flex-col justify-between selection:bg-[#8FAF9A]/30 selection:text-[#285943]">
      {/* Editorial Navigation */}
      <nav className="border-b border-[#E8E2D8] bg-[#F7F4ED]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#285943] text-white flex items-center justify-center shadow-sm">
              <Compass size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#26332C]">
                ROAMLY
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#6B756E] -mt-1 hidden sm:inline">
                Thoughtful Travel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-[#26332C]">
            <button
              type="button"
              onClick={scrollToForm}
              className="text-[#6B756E] hover:text-[#285943] transition hidden md:inline"
            >
              Plan a Trip
            </button>
            <button
              type="button"
              onClick={scrollToForm}
              className="bg-[#285943] hover:bg-[#1F4735] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition active:scale-98 cursor-pointer"
            >
              Plan My Trip
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Hero />

        {/* Scenic Photography Feature Strip */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-sm border border-[#E8E2D8]">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
              alt="Coastal sunset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white max-w-md">
              <p className="text-xs uppercase tracking-widest text-[#E8D8BC] font-semibold">
                Designed for Discovery
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium mt-1 leading-snug">
                Every journey has a rhythm. We help you find yours.
              </h2>
            </div>
          </div>
        </div>

        {/* Planner Card Container */}
        <div id="planner-card" className="max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
          <PlannerForm />
        </div>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-[#E8E2D8] py-10 bg-[#FAF8F5] text-center text-xs text-[#6B756E]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif text-base text-[#26332C]">
            <span>ROAMLY</span>
            <span className="text-xs font-sans text-[#6B756E]">• Your trip, thoughtfully planned.</span>
          </div>
          <div className="flex items-center gap-6 text-[#6B756E]">
            <span>Day-by-Day Timeline</span>
            <span>•</span>
            <span>Local Stays</span>
            <span>•</span>
            <span>Custom Guides</span>
          </div>
        </div>
      </footer>
    </div>
  );
}