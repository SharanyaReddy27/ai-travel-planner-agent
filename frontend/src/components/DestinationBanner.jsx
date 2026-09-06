const images = {
  goa:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",

  switzerland:
    "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1600&q=80",

  manali:
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80",

  jaipur:
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80",

  kerala:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c994?w=1600&q=80",
};

export default function DestinationBanner({ destination }) {

  const city = destination?.toLowerCase() || "travel";

  const img =
    images[city] ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80";

  return (
    <div className="relative h-80 rounded-[30px] overflow-hidden shadow-xl">

      <img src={img} alt={city} className="w-full h-full object-cover" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="absolute bottom-10 left-10">

        <h1 className="text-5xl font-black uppercase text-white">
          ✈ {destination || "Travel"}
        </h1>

        <p className="text-slate-200 mt-2">
          AI Generated Travel Guide
        </p>

      </div>

    </div>
  );
}