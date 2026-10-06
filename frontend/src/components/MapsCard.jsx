import { MapPin, ExternalLink, Compass, Navigation, Hotel, Calendar } from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function MapsCard({ destination = "Travel", itinerary = [], hotels = [] }) {
  const destName = destination || "Travel";

  return (
    <section className="rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C]">
                Explore on Maps
              </h2>
              <p className="text-xs text-[#6B756E]">Instant interactive coordinates for every stop</p>
            </div>
          </div>
          <p className="text-[#6B756E] mt-3 text-xs sm:text-sm max-w-xl leading-relaxed">
            Locate sights, neighborhoods, and recommended stays across{" "}
            <span className="text-[#285943] font-semibold">{destName}</span> with direct Google Maps access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openGoogleMaps(destName)}
          aria-label={`Open ${destName} on Google Maps`}
          className="bg-[#285943] hover:bg-[#1F4735] active:scale-95 text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition duration-150 shadow-sm shrink-0 text-sm cursor-pointer"
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
            <h3 className="text-base font-serif font-bold text-[#26332C] flex items-center gap-2">
              <Calendar className="text-[#285943]" size={18} />
              <span>Daily Itinerary Locations</span>
            </h3>
            <span className="text-xs text-[#6B756E]">{itinerary.length} Days Mapped</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {itinerary.map((day) => {
              const query = day.title ? day.title.replace(/^Day\s+\d+:\s*/i, "") : `Day ${day.day}`;

              return (
                <div
                  key={day.day}
                  className="bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E8E2D8] hover:border-[#8FAF9A] rounded-2xl p-5 flex flex-col justify-between gap-4 transition duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#285943] bg-[#E8EFEA] px-2.5 py-1 rounded-lg border border-[#8FAF9A]/40">
                        Day {day.day}
                      </span>
                      {day.cost && (
                        <span className="text-xs text-[#6B756E] font-medium bg-white border border-[#E8E2D8] px-2.5 py-1 rounded-lg">
                          {day.cost}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-serif font-bold text-[#26332C] leading-snug">
                      {day.title || `Day ${day.day} Exploration`}
                    </h4>
                    {day.morning && (
                      <p className="text-xs text-[#6B756E] mt-2 line-clamp-2 leading-relaxed">
                        {day.morning}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => openGoogleMaps(query, destName)}
                    aria-label={`View Day ${day.day} places on Google Maps`}
                    className="w-full bg-white hover:bg-[#285943] text-[#285943] hover:text-white border border-[#285943] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 active:scale-98 shadow-2xs cursor-pointer"
                  >
                    <MapPin size={14} />
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
        <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-[#26332C] flex items-center gap-2">
              <Hotel className="text-[#C9785B]" size={18} />
              <span>Places to Stay on Maps</span>
            </h3>
            <span className="text-xs text-[#6B756E]">{hotels.length} Stays</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {hotels.map((h, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#8FAF9A] rounded-2xl p-5 flex flex-col justify-between gap-4 transition duration-200"
              >
                <div>
                  <h4 className="font-serif font-bold text-[#26332C] text-base leading-snug">{h.name}</h4>
                  <p className="text-xs text-[#6B756E] mt-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#C9785B] shrink-0" />
                    <span className="truncate">{h.location || destName}</span>
                  </p>
                  {h.price && (
                    <p className="text-xs text-[#285943] font-semibold mt-2">
                      {typeof h.price === "number" ? `₹${h.price.toLocaleString("en-IN")}/night` : h.price}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openGoogleMaps(`${h.name}, ${h.location || destName}`, destName)}
                  aria-label={`Locate ${h.name} on Google Maps`}
                  className="w-full bg-white hover:bg-[#285943] text-[#285943] hover:text-white border border-[#285943] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-150 active:scale-98 shadow-2xs cursor-pointer"
                >
                  <MapPin size={14} />
                  <span>Locate Stay on Maps</span>
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
