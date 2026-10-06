import { useState, useEffect } from "react";
import { Compass } from "lucide-react";

const steps = [
  "Planning your getaway...",
  "Finding the right places...",
  "Balancing your budget...",
  "Putting your days together...",
  "Almost ready...",
];

export default function LoadingScreen({ destination = "" }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 bg-[#F7F4ED]/85 backdrop-blur-md flex flex-col justify-center items-center z-50 p-6"
    >
      <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-xl shadow-stone-200/50 space-y-6">
        {/* Animated icon container */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#8FAF9A]/30 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-2xl bg-[#E8EFEA] border border-[#8FAF9A]/40 flex items-center justify-center text-[#285943]">
            <Compass className="animate-spin" style={{ animationDuration: "7s" }} size={32} />
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#C9785B]">
            ROAMLY
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C] mt-1">
            {destination ? `Crafting your ${destination} journey` : "Thoughtfully planning your trip"}
          </h2>
          <p className="text-[#285943] font-medium text-sm sm:text-base mt-2 h-6 transition-all duration-300">
            {steps[currentStepIndex]}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? "w-8 bg-[#285943]"
                  : idx < currentStepIndex
                  ? "w-2 bg-[#8FAF9A]"
                  : "w-2 bg-[#E8E2D8]"
              }`}
            />
          ))}
        </div>

        <p className="text-[#6B756E] text-xs leading-relaxed border-t border-[#E8E2D8] pt-4">
          Gathering daily sights, weather advice, recommended stays, and budget estimates.
        </p>
      </div>
    </div>
  );
}