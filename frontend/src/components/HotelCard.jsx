import { Hotel, MapPin, Star, ExternalLink } from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function HotelCard({ hotels, destination = "" }) {
  const hotelList = parseHotels(hotels);

  return (
    <section className="rounded-3xl bg-gradient-to-br from-orange-900/40 to-slate-900 border border-orange-700 p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Hotel className="text-orange-400" size={34} />
        <h2 className="text-3xl font-bold text-white">Recommended Hotels</h2>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hotelList.map((hotel, index) => (
          <div
            key={index}
            className="bg-slate-800/70 rounded-2xl overflow-hidden border border-slate-700 hover:border-orange-500 transition"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-5 space-y-3">
              <h3 className="text-xl font-bold text-white">{hotel.name}</h3>

              <div className="flex items-center gap-2 text-yellow-400">
                <Star fill="currentColor" size={16} />
                <span>{hotel.rating}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin size={16} />
                <span>{hotel.location}</span>
              </div>

              <p className="text-slate-400 text-sm">{hotel.description}</p>

              <button
                onClick={() => openGoogleMaps(`${hotel.name}, ${hotel.location || destination}`, destination)}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white transition duration-200"
              >
                <MapPin size={16} />
                <span>View on Google Maps</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
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
    return hotelsInput.map((hotel, index) => ({
      name: hotel.name || "Recommended Hotel",
      location: hotel.location || "Central Area",
      rating: hotel.rating || (4.5 + (index * 0.1)).toFixed(1),
      price: hotel.price || "",
      description: hotel.description || "Top recommended stay for your itinerary.",
      image: hotel.image || images[index % images.length],
    }));
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
        description: "Premium stay with scenic views and breakfast included.",
        image: images[0],
      },
      {
        name: "Grand Heritage Hotel",
        location: "Old Town",
        rating: "4.7",
        price: "₹2,800/night",
        description: "Comfortable stay near major attractions and restaurants.",
        image: images[1],
      },
      {
        name: "Boutique Lake View Hotel",
        location: "Lakeside",
        rating: "4.9",
        price: "₹4,200/night",
        description: "Beautiful boutique hotel with lake and mountain views.",
        image: images[2],
      },
    ];
  }

  return names.slice(0, 3).map((name, index) => ({
    name,
    location: "Prime Tourist Area",
    rating: (4.8 + index * 0.1).toFixed(1),
    price: "₹3,200/night",
    description: "Highly rated hotel recommended for your budget and itinerary.",
    image: images[index % images.length],
  }));
}