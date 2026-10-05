import { CloudRain, Sun, ThermometerSun, ShieldCheck } from "lucide-react";

export default function WeatherCard({ weather }) {
  // Support both old backend response and new formatted response
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
  const bestTime = data.best_time || data.bestTime || "Great time to travel.";

  return (
    <section className="rounded-3xl bg-gradient-to-br from-cyan-900/70 to-slate-900 border border-cyan-800 p-8 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CloudRain className="text-cyan-400" size={34} />
          <h2 className="text-3xl font-bold">Weather Advice</h2>
        </div>

        <Sun className="text-yellow-400" size={34} />
      </div>

      {/* Temperature + Condition */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-slate-800/60 rounded-2xl p-5">
          <p className="text-slate-400">Temperature</p>
          <h3 className="text-4xl font-bold mt-2 flex items-center gap-2">
            <ThermometerSun className="text-orange-400" />
            {data.temperature || "--"}
          </h3>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-5">
          <p className="text-slate-400">Condition</p>
          <h3 className="text-2xl font-semibold text-cyan-300 mt-2">
            {data.condition || "Pleasant weather"}
          </h3>
        </div>
      </div>

      {/* Best time */}
      <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
        <p className="text-green-300 font-medium">
          ✅ {bestTime}
        </p>
      </div>

      {/* Packing */}
      <div>
        <h3 className="text-xl font-semibold mb-3">🎒 Packing Essentials</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pack.length ? (
            pack.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              Comfortable clothing
            </div>
          )}
        </div>
      </div>

      {/* Precautions */}
      <div>
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <ShieldCheck className="text-green-400" />
          Travel Precautions
        </h3>

        <div className="space-y-3">
          {precautions.length ? (
            precautions.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-4 border-l-4 border-yellow-400"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-xl p-4 border-l-4 border-yellow-400">
              Stay hydrated and carry a light jacket.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Converts old string response into structured data */
function parseWeather(text = "") {
  return {
    temperature: text.match(/Temperature:\s*([^\n]+)/)?.[1] || "17°C",
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
        "Carry a compact umbrella for light rain.",
      ],
  };
}