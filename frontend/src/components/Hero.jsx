import { Compass, ArrowDown, MapPin, Calendar, Wallet } from "lucide-react";

export default function Hero() {
  const scrollToForm = () => {
    const el = document.getElementById("planner-card");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative pt-12 pb-14 text-center px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Brand Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFEA] border border-[#8FAF9A]/40 text-[#285943] text-xs font-semibold tracking-wider uppercase mb-6">
        <Compass size={14} className="text-[#285943]" />
        <span>Intelligent Travel Design</span>
      </div>

      {/* Main Editorial Title */}
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#26332C] tracking-tight leading-[1.15]">
        Your trip, <br />
        <span className="italic font-normal text-[#285943]">thoughtfully planned.</span>
      </h1>

      {/* Warm human subtitle */}
      <p className="text-[#6B756E] text-base sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
        Tell us where you're going, what you love, and how you want to travel.
        We'll help shape the rest—from morning coffee to evening stays.
      </p>

      {/* Call to action */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={scrollToForm}
          className="bg-[#285943] hover:bg-[#1F4735] text-white px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 active:scale-98 cursor-pointer"
        >
          <span>Plan My Trip</span>
          <ArrowDown size={16} />
        </button>
      </div>

      {/* Editorial Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 text-xs sm:text-sm text-[#6B756E] border-t border-[#E8E2D8] pt-8">
        <span className="flex items-center gap-2">
          <Calendar size={15} className="text-[#8FAF9A]" /> Daily travel rhythm
        </span>
        <span className="flex items-center gap-2">
          <Wallet size={15} className="text-[#C9785B]" /> Sensible budget splits
        </span>
        <span className="flex items-center gap-2">
          <MapPin size={15} className="text-[#285943]" /> Handpicked local stays
        </span>
      </div>
    </header>
  );
}