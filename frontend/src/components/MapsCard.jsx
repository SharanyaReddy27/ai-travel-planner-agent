import { MapPin, ExternalLink, Compass, Navigation } from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function MapsCard({ destination = "Travel", itinerary = [], hotels = [] }) {
  const destName = destination || "Travel";

  return (
    <section className="rounded-3xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-cyan-950/60 border border-blue-800/80 p-8 space-y-8 shadow-2xl">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 text-cyan-400">
            <Compass size={32} />
            <h2 className="text-3xl font-bold text-white">Google Maps Explorer</h2>
          </div>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Quickly locate attractions, hotels, and daily itinerary stops in{" "}
            <span className="text-cyan-300 font-semibold">{destName}</span> on Google Maps.
          </p>
        </div>

        <button
          onClick={() => openGoogleMaps(destName)}
          className="bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition duration-200 shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Navigation size={18} />
          <span>Open {destName} on Maps</span>
          <ExternalLink size={16} />
        </button>
      </div>

      {/* Itinerary Locations */}
      {Array.isArray(itinerary) && itinerary.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-cyan-400" size={20} />
            Itinerary Day Highlights
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {itinerary.map((day) => {
              const query = day.title ? day.title.replace(/^Day\s+\d+:\s*/i, "") : `Day ${day.day}`;

              return (
                <div
                  key={day.day}
                  className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-5 flex flex-col justify-between gap-4 transition duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800">
                        Day {day.day}
                      </span>
                      {day.cost && (
                        <span className="text-xs text-emerald-400 font-medium bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                          {day.cost}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-white mt-2.5 leading-snug">
                      {day.title || `Day ${day.day} Sightseeing`}
                    </h4>
                    {day.morning && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {day.morning}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => openGoogleMaps(query, destName)}
                    className="w-full bg-slate-700/70 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200"
                  >
                    <span>View Day {day.day} on Maps</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hotel Locations */}
      {Array.isArray(hotels) && hotels.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-orange-400" size={20} />
            Hotel & Stay Locations
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {hotels.map((h, i) => (
              <div
                key={i}
                className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <h4 className="font-semibold text-white text-base">{h.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin size={13} className="text-orange-400 shrink-0" />
                    <span>{h.location || destName}</span>
                  </p>
                  {h.price && (
                    <p className="text-xs text-orange-300 font-medium mt-2">
                      {h.price}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => openGoogleMaps(`${h.name}, ${h.location || destName}`, destName)}
                  className="w-full bg-slate-700/70 hover:bg-orange-600 text-slate-200 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200"
                >
                  <span>Locate Hotel on Maps</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
