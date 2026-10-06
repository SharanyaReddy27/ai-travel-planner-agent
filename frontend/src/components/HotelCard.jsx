import { Hotel, MapPin, Star, ExternalLink, Info } from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function HotelCard({ hotels, destination = "" }) {
  const hotelList = parseHotels(hotels);

  return (
    <section className="rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
            <Hotel size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C]">
              Places to Stay
            </h2>
            <p className="text-xs text-[#6B756E]">Thoughtfully selected stays for your trip</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#6B756E] bg-[#FAF8F5] border border-[#E8E2D8] px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Info size={14} className="shrink-0 text-[#C9785B]" />
          <span>Estimated nightly rate • Not a live booking price</span>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotelList.map((hotel, index) => {
          const mapQuery = `${hotel.name}, ${hotel.location || destination}`;

          return (
            <div
              key={index}
              className="bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E8E2D8] hover:border-[#8FAF9A] hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#E8E2D8] flex items-center gap-1.5 text-xs font-bold text-[#26332C] shadow-2xs">
                    <Star size={13} className="text-[#C9785B]" fill="currentColor" />
                    <span>{hotel.rating}</span>
                  </div>

                  {/* Estimated Price Badge */}
                  {hotel.price && (
                    <div className="absolute bottom-3 left-3 bg-[#26332C]/85 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white shadow-2xs">
                      <span>Est. {hotel.price}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#26332C] group-hover:text-[#285943] transition-colors line-clamp-1">
                    {hotel.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#6B756E]">
                    <MapPin size={14} className="text-[#285943] shrink-0" />
                    <span className="truncate">{hotel.location || destination}</span>
                  </div>

                  <p className="text-[#6B756E] text-xs sm:text-sm leading-relaxed line-clamp-3">
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
                  className="w-full bg-white hover:bg-[#285943] text-[#285943] hover:text-white border border-[#285943] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition duration-150 active:scale-98 shadow-2xs cursor-pointer"
                >
                  <MapPin size={15} />
                  <span>View on Google Maps</span>
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
        description: hotel.description || "Thoughtfully curated stay for your travel style.",
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
        name: "Heritage Villa & Gardens",
        location: "Historic Quarter",
        rating: "4.8",
        price: "₹3,500/night",
        description: "Comfortable stay with serene surroundings, warm hospitality, and easy walking access.",
        image: images[0],
      },
      {
        name: "Coastal Breeze Retreat",
        location: "Waterfront Area",
        rating: "4.7",
        price: "₹2,800/night",
        description: "Charming rooms close to local markets, dining spots, and scenic viewpoints.",
        image: images[1],
      },
      {
        name: "Pine View Boutique Stay",
        location: "Scenic Ridge",
        rating: "4.9",
        price: "₹4,200/night",
        description: "Peaceful boutique setting offering panoramic natural views and curated dining.",
        image: images[2],
      },
    ];
  }

  return names.slice(0, 3).map((name, index) => ({
    name,
    location: "Central Location",
    rating: (4.7 + index * 0.1).toFixed(1),
    price: "₹3,200/night",
    description: "Carefully chosen stay that aligns with your preferred pace and travel budget.",
    image: images[index % images.length],
  }));
}