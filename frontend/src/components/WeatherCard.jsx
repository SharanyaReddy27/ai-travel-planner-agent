import {
  CloudSun,
  ThermometerSun,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Shirt,
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

  const bestTime = data.best_time || data.bestTime || "Looks like a good time to visit";

  return (
    <section className="rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
            <CloudSun size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C]">
              Weather & Packing
            </h2>
            <p className="text-xs text-[#6B756E]">What to expect and what to bring</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8EFEA] text-[#285943] border border-[#8FAF9A]/40">
          Trip Forecast
        </span>
      </div>

      {/* Best time / Travel recommendation headline */}
      <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] text-[#285943] flex items-center justify-center shrink-0">
          <CloudSun size={19} />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C9785B]">
            Travel Recommendation
          </span>
          <p className="text-[#26332C] text-sm font-medium mt-0.5">{bestTime}</p>
        </div>
      </div>

      {/* Temperature & Condition metrics */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#E8E2D8] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-medium text-[#6B756E]">Temperature</span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#26332C] mt-1">
              {data.temperature || "28°C"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FDF5E6] border border-[#E8D8BC] flex items-center justify-center text-[#C9785B]">
            <ThermometerSun size={26} />
          </div>
        </div>

        <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#E8E2D8] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-medium text-[#6B756E]">Condition</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#285943] mt-1 capitalize">
              {data.condition || "Pleasant & Clear"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
            <Wind size={26} />
          </div>
        </div>
      </div>

      {/* Packing Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#26332C] flex items-center gap-2">
            <Shirt size={17} className="text-[#285943]" />
            <span>Recommended Packing Essentials</span>
          </h3>
          <span className="text-xs text-[#6B756E]">{pack.length} Items</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {pack.length > 0 ? (
            pack.map((item, index) => (
              <div
                key={index}
                className="bg-[#FAF8F5] hover:bg-[#F2ECE1] rounded-xl p-3 border border-[#E8E2D8] flex items-center gap-2.5 transition text-sm text-[#26332C]"
              >
                <CheckCircle2 size={16} className="text-[#285943] shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))
          ) : (
            <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E8E2D8] flex items-center gap-2.5 text-sm text-[#26332C]">
              <CheckCircle2 size={16} className="text-[#285943] shrink-0" />
              <span>Comfortable cotton clothes & footwear</span>
            </div>
          )}
        </div>
      </div>

      {/* Helpful Travel Tips / Precautions */}
      <div className="space-y-3 pt-2 border-t border-[#E8E2D8]">
        <h3 className="text-sm font-bold text-[#26332C] flex items-center gap-2">
          <AlertTriangle size={16} className="text-[#C9785B]" />
          <span>Helpful Travel Notes</span>
        </h3>

        <div className="space-y-2.5">
          {precautions.length > 0 ? (
            precautions.map((item, index) => (
              <div
                key={index}
                className="bg-[#FAF8F5] border-l-3 border-[#C9785B] rounded-r-xl p-3 text-sm text-[#26332C] leading-relaxed flex items-start gap-2.5"
              >
                <span className="font-bold text-[#C9785B] mt-0.5">•</span>
                <span>{item}</span>
              </div>
            ))
          ) : (
            <div className="bg-[#FAF8F5] border-l-3 border-[#C9785B] rounded-r-xl p-3 text-sm text-[#26332C]">
              Stay hydrated throughout afternoon excursions and keep digital backups of your travel IDs.
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
    temperature: text.match(/Temperature:\s*([^\n]+)/)?.[1] || "28°C",
    condition: text.match(/Condition:\s*([^\n]+)/)?.[1] || "Pleasant",
    best_time: "Looks like a good time to visit",
    pack:
      text.match(/Pack:\s*([\s\S]*?)Precautions:/)?.[1]
        ?.split("\n")
        .map((i) => i.replace("•", "").trim())
        .filter(Boolean) || [
        "Cotton clothes",
        "Sunscreen",
        "Sunglasses",
        "Light jacket",
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