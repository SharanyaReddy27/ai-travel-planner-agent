import { Hotel, MapPin, Star } from "lucide-react";

export default function HotelCard({ hotels }) {
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

              <button className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function parseHotels(text = "") {
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
  ];

  // Extract hotel names from AI response (**Hotel Name**)
  const names = [...text.matchAll(/\*\*(.*?)\*\*/g)]
    .map((m) => m[1])
    .filter((n) => !n.toLowerCase().includes("why"));

  if (names.length === 0) {
    return [
      {
        name: "Luxury Mountain Resort",
        location: "City Center",
        rating: "4.8",
        description: "Premium stay with scenic views and breakfast included.",
        image: images[0],
      },
      {
        name: "Grand Heritage Hotel",
        location: "Old Town",
        rating: "4.7",
        description: "Comfortable stay near major attractions and restaurants.",
        image: images[1],
      },
      {
        name: "Boutique Lake View Hotel",
        location: "Lakeside",
        rating: "4.9",
        description: "Beautiful boutique hotel with lake and mountain views.",
        image: images[2],
      },
    ];
  }

  return names.slice(0, 3).map((name, index) => ({
    name,
    location: "Prime Tourist Area",
    rating: (4.8 + index * 0.1).toFixed(1),
    description: "Highly rated hotel recommended for your budget and itinerary.",
    image: images[index % images.length],
  }));
}