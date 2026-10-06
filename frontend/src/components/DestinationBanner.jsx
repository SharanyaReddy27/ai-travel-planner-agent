import { Calendar, DollarSign, Sparkles, MapPin } from "lucide-react";

const images = {
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
  switzerland: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",
  manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80",
  jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c994?w=1600&q=80",
  hyderabad: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1600&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
};

export default function DestinationBanner({
  destination = "Travel",
  days,
  budget,
  interests,
  summary,
}) {
  const cityKey = destination ? destination.toLowerCase().trim() : "travel";
  const matchedKey = Object.keys(images).find((k) => cityKey.includes(k));

  const img =
    (matchedKey && images[matchedKey]) ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80";

  const formattedBudget = budget
    ? `₹${Number(budget).toLocaleString("en-IN")}`
    : null;

  return (
    <div className="relative min-h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-end p-6 sm:p-10">
      {/* Background Image */}
      <img
        src={img}
        alt={destination || "Travel Destination"}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Readability Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />

      {/* Content */}
      <div className="relative z-10 space-y-4 max-w-4xl">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <MapPin size={13} className="text-cyan-400" />
            <span>AI Verified Plan</span>
          </span>

          {days && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-purple-300 text-xs font-semibold backdrop-blur-md">
              <Calendar size={13} className="text-purple-400" />
              <span>{days} Days</span>
            </span>
          )}

          {formattedBudget && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <DollarSign size={13} className="text-emerald-400" />
              <span>{formattedBudget} Budget</span>
            </span>
          )}

          {interests && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-amber-300 text-xs font-medium backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" />
              <span>{interests}</span>
            </span>
          )}
        </div>

        {/* Destination Title */}
        <div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase drop-shadow-md">
            {destination || "Your Journey"}
          </h1>
        </div>

        {/* AI Summary */}
        {summary && (
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl bg-slate-950/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
            {summary}
          </p>
        )}
      </div>
    </div>
  );
}