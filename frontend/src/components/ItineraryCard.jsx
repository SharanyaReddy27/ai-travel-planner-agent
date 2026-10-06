import {
  Sunrise,
  Utensils,
  Sun,
  Sunset,
  Moon,
  Wallet,
  MapPin,
  ExternalLink,
  Route,
} from "lucide-react";
import { openGoogleMaps } from "../services/maps";

export default function ItineraryCard({ itinerary, destination = "" }) {
  const days =
    typeof itinerary === "string"
      ? parseItinerary(itinerary)
      : Array.isArray(itinerary)
      ? itinerary
      : [];

  if (days.length === 0) {
    return (
      <section className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400">
        No day-by-day itinerary available.
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Route size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Daily Itinerary Timeline</h2>
            <p className="text-xs text-slate-400">Structured morning-to-night schedule</p>
          </div>
        </div>

        {destination && (
          <button
            type="button"
            onClick={() => openGoogleMaps(destination)}
            aria-label={`Explore all of ${destination} on Google Maps`}
            className="self-start sm:self-auto bg-slate-950/80 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition duration-150 shadow-sm"
          >
            <MapPin size={14} className="text-indigo-400 hover:text-white" />
            <span>Explore {destination} Area</span>
            <ExternalLink size={12} />
          </button>
        )}
      </div>

      {/* Days Stack */}
      <div className="space-y-8">
        {days.map((day) => {
          const mapQuery = day.title ? day.title.replace(/^Day\s+\d+:\s*/i, "") : `Day ${day.day}`;

          return (
            <div
              key={day.day}
              className="bg-slate-950/60 rounded-3xl border border-slate-800/80 p-5 sm:p-7 space-y-6 shadow-lg"
            >
              {/* Day Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold flex flex-col items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                    <span className="text-[10px] uppercase font-bold tracking-wider leading-none text-indigo-200">Day</span>
                    <span className="text-lg leading-none mt-0.5">{day.day}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {day.title || `Day ${day.day} Sightseeing`}
                    </h3>
                    <p className="text-xs text-slate-400">Curated activities & dining</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {day.cost && (
                    <div className="bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl text-emerald-300 font-semibold flex items-center gap-1.5 text-xs">
                      <Wallet size={14} className="text-emerald-400" />
                      <span>{day.cost}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => openGoogleMaps(mapQuery, destination)}
                    aria-label={`View Day ${day.day} sights on Google Maps`}
                    className="bg-slate-900 hover:bg-indigo-600 border border-slate-700/80 hover:border-indigo-500 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <MapPin size={13} className="text-indigo-400" />
                    <span>View Sights on Map</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>

              {/* Day Timeline Spine */}
              <div className="relative border-l-2 border-indigo-500/20 ml-3 sm:ml-5 pl-5 sm:pl-7 space-y-5">
                <TimelineNode
                  icon={<Sunrise size={16} />}
                  label="Morning"
                  time="08:00 AM – 12:00 PM"
                  colorClass="text-amber-400 bg-amber-500/10 border-amber-500/30"
                  text={day.morning}
                />
                <TimelineNode
                  icon={<Utensils size={16} />}
                  label="Lunch"
                  time="12:30 PM – 02:00 PM"
                  colorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  text={day.lunch}
                />
                <TimelineNode
                  icon={<Sun size={16} />}
                  label="Afternoon"
                  time="02:30 PM – 05:30 PM"
                  colorClass="text-sky-400 bg-sky-500/10 border-sky-500/30"
                  text={day.afternoon}
                />
                <TimelineNode
                  icon={<Sunset size={16} />}
                  label="Evening"
                  time="06:00 PM – 08:30 PM"
                  colorClass="text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
                  text={day.evening}
                />
                <TimelineNode
                  icon={<Moon size={16} />}
                  label="Night"
                  time="09:00 PM Onwards"
                  colorClass="text-violet-400 bg-violet-500/10 border-violet-500/30"
                  text={day.night}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TimelineNode({ icon, label, time, colorClass, text }) {
  if (!text) return null;

  return (
    <div className="relative group">
      {/* Node Dot on spine */}
      <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-400">
        <div className="w-2 h-2 rounded-full bg-indigo-400" />
      </div>

      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 hover:border-slate-700 transition">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${colorClass}`}>
              {icon}
              <span>{label}</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {time}
          </span>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function parseItinerary(text = "") {
  const sections = text
    .split(/(?:###\s*)?\*{0,2}Day\s+\d+\*{0,2}/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return sections.map((section, index) => {
    const get = (label) => {
      const regex = new RegExp(
        `\\*\\*${label}:\\*\\*([\\s\\S]*?)(?=\\*\\*(Morning|Lunch|Afternoon|Evening|Night|Estimated Expense)|$)`,
        "i"
      );

      return section.match(regex)?.[1]?.trim() || "";
    };

    const title =
      section.split("\n")[0].replace(/\*/g, "").trim() || "Travel Exploration";

    const cost =
      section.match(/₹[\d,]+/)?.[0] || "Included in budget";

    return {
      day: index + 1,
      title,
      morning: get("Morning"),
      lunch: get("Lunch"),
      afternoon: get("Afternoon"),
      evening: get("Evening"),
      night: get("Night"),
      cost,
    };
  });
}