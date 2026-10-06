import { MapPin, ExternalLink, Compass, Navigation, Hotel, Calendar } from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function MapsCard({ destination = "Travel", itinerary = [], hotels = [] }) {
  const destName = destination || "Travel";

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Google Maps Explorer</h2>
              <p className="text-xs text-slate-400">Explore this trip on Google Maps</p>
            </div>
          </div>
          <p className="text-slate-300 mt-3 text-xs sm:text-sm max-w-xl leading-relaxed">
            Locate attractions, hotels, and planned itinerary stops in{" "}
            <span className="text-cyan-400 font-semibold">{destName}</span> with direct interactive Google Maps links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openGoogleMaps(destName)}
          aria-label={`Open ${destName} on Google Maps`}
          className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition duration-150 shadow-lg shadow-cyan-500/25 shrink-0 text-sm cursor-pointer"
        >
          <Navigation size={18} />
          <span>Open Entire {destName} Map</span>
          <ExternalLink size={15} />
        </button>
      </div>

      {/* Itinerary Locations Section */}
      {Array.isArray(itinerary) && itinerary.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="text-indigo-400" size={18} />
              <span>Daily Itinerary Locations</span>
            </h3>
            <span className="text-xs text-slate-400">{itinerary.length} Days Mapped</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {itinerary.map((day) => {
              const query = day.title ? day.title.replace(/^Day\s+\d+:\s*/i, "") : `Day ${day.day}`;

              return (
                <div
                  key={day.day}
                  className="bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition duration-200 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/70 px-2.5 py-1 rounded-lg border border-cyan-800/70">
                        Day {day.day}
                      </span>
                      {day.cost && (
                        <span className="text-xs text-emerald-300 font-medium bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
                          {day.cost}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {day.title || `Day ${day.day} Exploration`}
                    </h4>
                    {day.morning && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {day.morning}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => openGoogleMaps(query, destName)}
                    aria-label={`View Day ${day.day} places on Google Maps`}
                    className="w-full bg-slate-900 hover:bg-cyan-600 text-slate-200 hover:text-white border border-slate-700/80 hover:border-cyan-500 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 active:scale-98 shadow-sm cursor-pointer"
                  >
                    <MapPin size={14} className="text-cyan-400" />
                    <span>View Day {day.day} on Maps</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hotel Locations Section */}
      {Array.isArray(hotels) && hotels.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Hotel className="text-orange-400" size={18} />
              <span>Recommended Hotel Coordinates</span>
            </h3>
            <span className="text-xs text-slate-400">{hotels.length} Stays</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {hotels.map((h, i) => (
              <div
                key={i}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-orange-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition duration-200 shadow-md"
              >
                <div>
                  <h4 className="font-bold text-white text-base leading-snug">{h.name}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-orange-400 shrink-0" />
                    <span className="truncate">{h.location || destName}</span>
                  </p>
                  {h.price && (
                    <p className="text-xs text-emerald-400 font-semibold mt-2">
                      {typeof h.price === "number" ? `₹${h.price.toLocaleString("en-IN")}/night` : h.price}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openGoogleMaps(`${h.name}, ${h.location || destName}`, destName)}
                  aria-label={`Locate ${h.name} on Google Maps`}
                  className="w-full bg-slate-900 hover:bg-orange-600 text-slate-200 hover:text-white border border-slate-700/80 hover:border-orange-500 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 active:scale-98 shadow-sm cursor-pointer"
                >
                  <MapPin size={14} className="text-orange-400" />
                  <span>Locate Hotel on Maps</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
