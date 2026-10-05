import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { planTrip } from "../services/api";

export default function PlannerForm() {
  const navigate = useNavigate();
  const { setTrip } = useTrip();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    destination: "",
    days: "",
    budget: "",
    interests: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await planTrip({
  destination: form.destination,
  days: Number(form.days),
  budget: Number(form.budget),
  interests: form.interests,
});

console.log("FULL API RESPONSE");
console.log(JSON.stringify(response, null, 2));

// Store the complete trip object
setTrip({
  destination: response.destination,
  days: response.days,
  budget: response.budget,
  interests: response.interests,
  weather: response.weather,
  budget_breakdown: response.budget_breakdown,
  hotels: response.hotels,
  itinerary: response.itinerary,
});

navigate("/dashboard");
  } catch (err) {
    console.error(err);
    alert("Failed to generate trip");
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={submit}
      className="max-w-4xl mx-auto mt-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-white">
        Plan Your Dream Trip ✈️
      </h2>

      <input
        type="text"
        name="destination"
        placeholder="Destination (Goa, Switzerland, Bali...)"
        value={form.destination}
        onChange={handleChange}
        required
        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <input
          type="number"
          name="days"
          placeholder="Number of Days"
          value={form.days}
          onChange={handleChange}
          required
          min={1}
          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <input
          type="number"
          name="budget"
          placeholder="Budget in ₹"
          value={form.budget}
          onChange={handleChange}
          required
          min={1000}
          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <textarea
        name="interests"
        rows={4}
        placeholder="Interests (beaches, mountains, nightlife, cafes, adventure...)"
        value={form.interests}
        onChange={handleChange}
        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-700 disabled:cursor-not-allowed py-4 rounded-xl text-white text-lg font-bold transition-all duration-300"
      >
        {loading ? "Generating AI Travel Plan..." : "Generate Trip"}
      </button>
    </form>
  );
}