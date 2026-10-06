import { MapPin, Calendar, IndianRupee, Sparkles } from "lucide-react";

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
    <div className="relative min-h-[340px] sm:min-h-[380px] rounded-3xl overflow-hidden shadow-lg border border-[#E8E2D8] flex flex-col justify-end p-6 sm:p-10">
      {/* Background Image */}
      <img
        src={img}
        alt={destination || "Travel Destination"}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Warm natural readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#26332C]/90 via-[#26332C]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#26332C]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 space-y-4 max-w-4xl text-white">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
            <MapPin size={13} className="text-[#8FAF9A]" />
            <span>Personalized Travel Guide</span>
          </span>

          {days && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
              <Calendar size={13} className="text-[#E8D8BC]" />
              <span>{days} Days</span>
            </span>
          )}

          {formattedBudget && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
              <IndianRupee size={13} className="text-[#8FAF9A]" />
              <span>{formattedBudget} Total</span>
            </span>
          )}

          {interests && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
              <Sparkles size={13} className="text-[#E8D8BC]" />
              <span>{interests}</span>
            </span>
          )}
        </div>

        {/* Destination Editorial Title */}
        <div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight drop-shadow-sm capitalize">
            Your {destination || "Dream"} Getaway
          </h1>
          <p className="text-stone-200 text-sm sm:text-base font-light mt-1">
            {days ? `${days} days` : "Curated trip"}
            {formattedBudget ? ` · ${formattedBudget}` : ""}
            {interests ? ` · ${interests}` : ""}
          </p>
        </div>

        {/* Summary note */}
        {summary && (
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed max-w-3xl bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            {summary}
          </p>
        )}
      </div>
    </div>
  );
}