import { useState, useEffect } from "react";
import { Compass } from "lucide-react";

const steps = [
  "Planning your itinerary...",
  "Checking travel conditions...",
  "Balancing your budget...",
  "Personalizing recommendations...",
];

export default function LoadingScreen({ destination = "" }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col justify-center items-center z-50 p-6"
    >
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl space-y-6">
        {/* Animated icon container */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="animate-spin" style={{ animationDuration: "6s" }} size={32} />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {destination ? `Crafting ${destination} Trip` : "Building Your Trip"}
          </h2>
          <p className="text-cyan-400 font-medium text-sm sm:text-base mt-2 h-6 transition-all duration-300">
            {steps[currentStepIndex]}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? "w-8 bg-cyan-400"
                  : idx < currentStepIndex
                  ? "w-2 bg-cyan-600/60"
                  : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800/80 pt-4">
          Synthesizing itinerary, local weather, cost estimates, and hotel options. This typically takes 8–15 seconds.
        </p>
      </div>
    </div>
  );
}