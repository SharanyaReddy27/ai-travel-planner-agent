import {
  Sunrise,
  Utensils,
  Mountain,
  Sunset,
  Moon,
  Wallet,
} from "lucide-react";

export default function ItineraryCard({ itinerary }) {
  const days =
    typeof itinerary === "string"
      ? parseItinerary(itinerary)
      : Array.isArray(itinerary)
      ? itinerary
      : [];

  if (days.length === 0) {
    return (
      <div className="rounded-3xl bg-slate-900 border border-slate-700 p-8 text-center text-slate-400">
        No itinerary available.
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-700 p-8">
      <h2 className="text-3xl font-bold text-purple-300 mb-8">
        🗓 Day-wise Itinerary
      </h2>

      <div className="space-y-8">
        {days.map((day) => (
          <div
            key={day.day}
            className="bg-slate-800/70 rounded-2xl border border-slate-700 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-purple-300">
                  Day {day.day}
                </h3>
                <p className="text-slate-400">{day.title}</p>
              </div>

              <div className="bg-green-500/20 px-3 py-2 rounded-xl text-green-300 font-semibold flex items-center gap-2">
                <Wallet size={16} />
                {day.cost}
              </div>
            </div>

            <Timeline icon={<Sunrise size={18} />} label="Morning" text={day.morning} />
            <Timeline icon={<Utensils size={18} />} label="Lunch" text={day.lunch} />
            <Timeline icon={<Mountain size={18} />} label="Afternoon" text={day.afternoon} />
            <Timeline icon={<Sunset size={18} />} label="Evening" text={day.evening} />
            <Timeline icon={<Moon size={18} />} label="Night" text={day.night} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline({ icon, label, text }) {
  if (!text) return null;

  return (
    <div className="flex gap-4 py-4 border-b border-slate-700 last:border-none">
      <div className="text-purple-400 mt-1">{icon}</div>

      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="text-slate-300 leading-7">{text}</p>
      </div>
    </div>
  );
}

function parseItinerary(text = "") {
  // Split using "Day 1", "### Day 1", "**Day 1**", etc.
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
      section.split("\n")[0].replace(/\*/g, "").trim() || "Travel Day";

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