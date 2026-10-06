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
      <section className="rounded-3xl bg-white border border-[#E8E2D8] p-8 text-center text-[#6B756E]">
        No daily itinerary available.
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
            <Route size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C]">
              Your Itinerary
            </h2>
            <p className="text-xs text-[#6B756E]">A day-by-day plan crafted for your pace</p>
          </div>
        </div>

        {destination && (
          <button
            type="button"
            onClick={() => openGoogleMaps(destination)}
            aria-label={`Explore all of ${destination} on Google Maps`}
            className="self-start sm:self-auto bg-white hover:bg-[#285943] border border-[#285943] text-[#285943] hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition duration-150 shadow-2xs cursor-pointer"
          >
            <MapPin size={14} />
            <span>Explore {destination} on Maps</span>
            <ExternalLink size={12} />
          </button>
        )}
      </div>

      {/* Days Stack */}
      <div className="space-y-8">
        {days.map((day) => {
          const mapQuery = day.title ? day.title.replace(/^Day\s+\d+:\s*/i, "") : `Day ${day.day}`;
          const formattedDayNumber = String(day.day).padStart(2, "0");

          return (
            <div
              key={day.day}
              className="bg-[#FAF8F5] rounded-3xl border border-[#E8E2D8] p-5 sm:p-7 space-y-6"
            >
              {/* Day Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="px-3.5 py-2 rounded-2xl bg-[#285943] text-white font-serif font-bold flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[10px] uppercase tracking-widest text-[#E8D8BC]">DAY</span>
                    <span className="text-lg leading-none mt-0.5">{formattedDayNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#26332C] leading-snug">
                      {day.title || `Day ${day.day} Highlights`}
                    </h3>
                    <p className="text-xs text-[#6B756E]">Curated sights, walks & local dining</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {day.cost && (
                    <div className="bg-white border border-[#E8E2D8] px-3 py-1.5 rounded-xl text-[#285943] font-medium flex items-center gap-1.5 text-xs shadow-2xs">
                      <Wallet size={14} className="text-[#C9785B]" />
                      <span>{day.cost}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => openGoogleMaps(mapQuery, destination)}
                    aria-label={`View Day ${day.day} sights on Google Maps`}
                    className="bg-white hover:bg-[#285943] border border-[#E8E2D8] hover:border-[#285943] text-[#26332C] hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <MapPin size={13} className="text-[#285943] group-hover:text-white" />
                    <span>View Day's Places</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>

              {/* Day Timeline Spine */}
              <div className="relative border-l-2 border-[#8FAF9A]/30 ml-3 sm:ml-5 pl-5 sm:pl-7 space-y-4">
                <TimelineNode
                  icon={<Sunrise size={16} />}
                  label="Morning"
                  time="08:30 AM – 12:00 PM"
                  colorClass="text-[#C9785B] bg-[#FAF3F0] border-[#F3DFD8]"
                  text={day.morning}
                />
                <TimelineNode
                  icon={<Utensils size={16} />}
                  label="Lunch"
                  time="12:30 PM – 02:00 PM"
                  colorClass="text-[#285943] bg-[#E8EFEA] border-[#8FAF9A]/40"
                  text={day.lunch}
                />
                <TimelineNode
                  icon={<Sun size={16} />}
                  label="Afternoon"
                  time="02:30 PM – 05:30 PM"
                  colorClass="text-[#B57C2A] bg-[#FDF8EE] border-[#E8D8BC]"
                  text={day.afternoon}
                />
                <TimelineNode
                  icon={<Sunset size={16} />}
                  label="Evening"
                  time="06:00 PM – 08:30 PM"
                  colorClass="text-[#C9785B] bg-[#FAF3F0] border-[#F3DFD8]"
                  text={day.evening}
                />
                <TimelineNode
                  icon={<Moon size={16} />}
                  label="Night"
                  time="09:00 PM Onwards"
                  colorClass="text-[#4F5D54] bg-[#EEF2F0] border-[#D4DCD7]"
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
    <div className="relative">
      {/* Node Dot on spine */}
      <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#285943] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#285943]" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#E8E2D8] hover:border-[#8FAF9A] transition shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${colorClass}`}>
              {icon}
              <span>{label}</span>
            </span>
          </div>
          <span className="text-[11px] text-[#6B756E] font-medium">
            {time}
          </span>
        </div>

        <p className="text-[#26332C] text-xs sm:text-sm leading-relaxed">
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