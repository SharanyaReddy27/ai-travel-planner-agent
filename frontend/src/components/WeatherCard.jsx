import {
  CloudSun,
  ThermometerSun,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Wind,
} from "lucide-react";

export default function WeatherCard({ weather }) {
  // Support both old backend response and formatted response
  const data =
    typeof weather === "string"
      ? parseWeather(weather)
      : weather || {};

  const pack = Array.isArray(data.pack)
    ? data.pack
    : Array.isArray(data.packing)
    ? data.packing
    : [];

  const precautions = Array.isArray(data.precautions)
    ? data.precautions
    : [];

  const bestTime = data.best_time || data.bestTime || "Favorable conditions for travel.";

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CloudSun size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Weather & Packing</h2>
            <p className="text-xs text-slate-400">Forecast and preparation essentials</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300">
          Live Climate
        </span>
      </div>

      {/* Temperature & Condition metrics */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400">Temperature</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {data.temperature || "26°C"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ThermometerSun size={26} />
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-semibold text-slate-400">Condition</span>
            <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-1 capitalize">
              {data.condition || "Pleasant & Clear"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wind size={26} />
          </div>
        </div>
      </div>

      {/* Best time to travel callout */}
      <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CalendarCheck size={18} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Seasonal Advice</span>
          <p className="text-emerald-200 text-sm font-medium mt-0.5">{bestTime}</p>
        </div>
      </div>

      {/* Packing Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>🎒 Packing Checklist</span>
          </h3>
          <span className="text-xs text-slate-400">{pack.length} Recommended items</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {pack.length > 0 ? (
            pack.map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/50 hover:bg-slate-800/60 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5 transition text-sm text-slate-200"
              >
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))
          ) : (
            <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 flex items-center gap-2.5 text-sm text-slate-300">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>Comfortable cotton clothing</span>
            </div>
          )}
        </div>
      </div>

      {/* Travel Precautions (Distinct from packing) */}
      <div className="space-y-3 pt-2 border-t border-slate-800/70">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          <span>Travel Precautions & Safety</span>
        </h3>

        <div className="space-y-2.5">
          {precautions.length > 0 ? (
            precautions.map((item, index) => (
              <div
                key={index}
                className="bg-amber-950/20 border-l-4 border-amber-500 border-y border-r border-amber-900/40 rounded-r-xl p-3 text-sm text-amber-200/90 leading-relaxed flex items-start gap-2.5"
              >
                <span className="font-semibold text-amber-400 mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))
          ) : (
            <div className="bg-amber-950/20 border-l-4 border-amber-500 border-y border-r border-amber-900/40 rounded-r-xl p-3 text-sm text-amber-200/90">
              Stay hydrated throughout sightseeing and keep digital copies of travel IDs.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Converts string response into structured data */
function parseWeather(text = "") {
  return {
    temperature: text.match(/Temperature:\s*([^\n]+)/)?.[1] || "26°C",
    condition: text.match(/Condition:\s*([^\n]+)/)?.[1] || "Pleasant",
    best_time: text.includes("Good time")
      ? "Good time to travel."
      : "Suitable for sightseeing.",
    pack:
      text.match(/Pack:\s*([\s\S]*?)Precautions:/)?.[1]
        ?.split("\n")
        .map((i) => i.replace("•", "").trim())
        .filter(Boolean) || [
        "Cotton clothes",
        "Sunglasses",
        "Sunscreen",
        "Light Jacket",
      ],
    precautions:
      text.match(/Precautions:\s*([\s\S]*)/)?.[1]
        ?.split("\n")
        .map((i) => i.replace("•", "").trim())
        .filter(Boolean) || [
        "Carry water throughout the day.",
        "Use sunscreen during afternoon sightseeing.",
        "Keep emergency contacts handy.",
      ],
  };
}