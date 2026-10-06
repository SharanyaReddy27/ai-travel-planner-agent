import { Hotel, MapPin, Star, ExternalLink, Info } from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function HotelCard({ hotels, destination = "" }) {
  const hotelList = parseHotels(hotels);

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Hotel size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Recommended Accommodations</h2>
            <p className="text-xs text-slate-400">Handpicked stays based on budget & location</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Info size={14} className="shrink-0 text-amber-400" />
          <span>Rates are seasonal estimates • No live availability implied</span>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelList.map((hotel, index) => {
          const mapQuery = `${hotel.name}, ${hotel.location || destination}`;

          return (
            <div
              key={index}
              className="bg-slate-950/60 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-orange-500/50 transition-all duration-200 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-xs font-bold text-amber-400 shadow-md">
                    <Star size={13} fill="currentColor" />
                    <span>{hotel.rating}</span>
                  </div>

                  {/* Estimated Price Badge */}
                  {hotel.price && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/80 text-xs font-semibold text-emerald-300 shadow-md">
                      <span>Est. {hotel.price}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin size={14} className="text-orange-400 shrink-0" />
                    <span className="truncate">{hotel.location || destination}</span>
                  </div>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {hotel.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => openGoogleMaps(mapQuery, destination)}
                  aria-label={`View ${hotel.name} on Google Maps`}
                  className="w-full bg-slate-900 hover:bg-orange-600 text-slate-200 hover:text-white border border-slate-700 hover:border-orange-500 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition duration-150 active:scale-98 shadow-sm cursor-pointer"
                >
                  <MapPin size={15} className="text-orange-400 group-hover:text-white" />
                  <span>Locate on Google Maps</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function parseHotels(hotelsInput) {
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
  ];

  if (Array.isArray(hotelsInput) && hotelsInput.length > 0) {
    return hotelsInput.map((hotel, index) => {
      let price = hotel.price || "";
      if (typeof price === "number") price = `₹${price.toLocaleString("en-IN")}/night`;
      else if (typeof price === "string" && price && !price.toLowerCase().includes("night") && !price.startsWith("₹")) {
        price = `₹${price}/night`;
      }

      return {
        name: hotel.name || "Recommended Hotel",
        location: hotel.location || "Central Area",
        rating: hotel.rating || (4.5 + (index * 0.1)).toFixed(1),
        price: price || "₹3,500/night",
        description: hotel.description || "Top recommended stay for your itinerary.",
        image: hotel.image || images[index % images.length],
      };
    });
  }

  const text = typeof hotelsInput === "string" ? hotelsInput : "";
  const names = [...text.matchAll(/\*\*(.*?)\*\*/g)]
    .map((m) => m[1])
    .filter((n) => !n.toLowerCase().includes("why"));

  if (names.length === 0) {
    return [
      {
        name: "Luxury Resort & Spa",
        location: "City Center",
        rating: "4.8",
        price: "₹3,500/night",
        description: "Premium stay with scenic views, breakfast included, and modern amenities.",
        image: images[0],
      },
      {
        name: "Grand Heritage Hotel",
        location: "Old Town",
        rating: "4.7",
        price: "₹2,800/night",
        description: "Comfortable stay near major attractions, heritage markets, and local transit.",
        image: images[1],
      },
      {
        name: "Boutique Lake View Hotel",
        location: "Lakeside",
        rating: "4.9",
        price: "₹4,200/night",
        description: "Charming boutique hotel with panoramic views, tranquil surroundings, and fine dining.",
        image: images[2],
      },
    ];
  }

  return names.slice(0, 3).map((name, index) => ({
    name,
    location: "Prime Tourist Area",
    rating: (4.7 + index * 0.1).toFixed(1),
    price: "₹3,200/night",
    description: "Highly rated hotel recommended for your travel dates and preferences.",
    image: images[index % images.length],
  }));
}