import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { planTrip } from "../services/api";
import LoadingScreen from "./LoadingScreen";
import {
  Compass,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Plus,
  Check,
} from "lucide-react";

const POPULAR_DESTINATIONS = ["Goa", "Manali", "Jaipur", "Kerala", "Switzerland", "Hyderabad"];

const SUGGESTED_INTERESTS = [
  "Beaches",
  "Nightlife",
  "Cafes & Food",
  "Mountains",
  "Culture & Forts",
  "Adventure Sports",
  "Relaxation & Spa",
];

export default function PlannerForm() {
  const navigate = useNavigate();
  const { setTrip } = useTrip();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    destination: "",
    days: "3",
    budget: "25000",
    interests: "beaches, cafes, nightlife",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSelectDestination = (dest) => {
    setForm((prev) => ({ ...prev, destination: dest }));
    if (errorMessage) setErrorMessage("");
  };

  const handleToggleInterest = (tag) => {
    const lowerTag = tag.toLowerCase();
    const currentTags = form.interests
      ? form.interests.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];

    let updated;
    if (currentTags.includes(lowerTag)) {
      updated = currentTags.filter((t) => t !== lowerTag);
    } else {
      updated = [...currentTags, lowerTag];
    }

    setForm((prev) => ({
      ...prev,
      interests: updated.join(", "),
    }));
  };

  const submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");

    if (!form.destination.trim()) {
      setErrorMessage("Please enter a destination to plan your trip.");
      return;
    }
    if (!form.days || Number(form.days) < 1) {
      setErrorMessage("Please enter a valid trip duration of at least 1 day.");
      return;
    }
    if (!form.budget || Number(form.budget) < 1000) {
      setErrorMessage("Please enter a valid budget of at least ₹1,000.");
      return;
    }

    setLoading(true);

    try {
      const response = await planTrip({
        destination: form.destination.trim(),
        days: Number(form.days),
        budget: Number(form.budget),
        interests: form.interests.trim(),
      });

      console.log("Trip generation response:", response);

      // Store the complete normalized trip object
      setTrip({
        destination: response.destination || form.destination.trim(),
        days: response.days || Number(form.days),
        budget: response.budget || Number(form.budget),
        interests: response.interests || form.interests.trim(),
        summary: response.summary || "",
        weather: response.weather || {},
        budget_breakdown: response.budget_breakdown || response.budget_plan || [],
        budget_plan: response.budget_plan || response.budget_breakdown || [],
        hotels: response.hotels || [],
        itinerary: response.itinerary || [],
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Trip generation error:", err);
      setErrorMessage(
        err.message || "Unable to generate your trip right now. Please check backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const activeInterestsList = form.interests
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return (
    <>
      {loading && <LoadingScreen destination={form.destination} />}

      <div className="relative max-w-4xl mx-auto">
        {/* Subtle background ambient glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-50" />

        <form
          onSubmit={submit}
          className="relative bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8"
        >
          {/* Header */}
          <div className="border-b border-slate-800/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 text-cyan-400 mb-1">
                <Compass size={22} />
                <span className="text-xs font-bold uppercase tracking-wider">Trip Parameters</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Customize Your Adventure
              </h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full self-start sm:self-auto">
              All Fields Required
            </span>
          </div>

          {/* Inline Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="bg-red-950/50 border border-red-700/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-red-200 text-sm animate-fadeIn"
            >
              <AlertCircle size={20} className="shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-white">Generation Failed</p>
                <p className="text-red-300 mt-0.5">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => submit()}
                className="bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-600/60 flex items-center gap-1.5 shrink-0 transition"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Destination Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="destination" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <MapPin size={16} className="text-cyan-400" />
                <span>Destination</span>
              </label>
              <span className="text-xs text-slate-400">City, Region or Country</span>
            </div>

            <input
              id="destination"
              type="text"
              name="destination"
              placeholder="e.g. Goa, Switzerland, Kyoto, Manali..."
              value={form.destination}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-base"
            />

            {/* Popular destination quick chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Quick suggestions:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  type="button"
                  key={dest}
                  onClick={() => handleSelectDestination(dest)}
                  className={`text-xs px-3 py-1 rounded-lg border transition ${
                    form.destination.toLowerCase() === dest.toLowerCase()
                      ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/80 font-medium"
                      : "bg-slate-800/60 text-slate-300 border-slate-700/80 hover:bg-slate-700/80 hover:text-white"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Budget Row */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Days Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="days" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span>Duration (Days)</span>
                </label>
                <span className="text-xs text-slate-400">1 to 30 days</span>
              </div>

              <input
                id="days"
                type="number"
                name="days"
                placeholder="e.g. 4"
                value={form.days}
                onChange={handleChange}
                required
                min={1}
                max={30}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-base"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-400">Presets:</span>
                {[3, 5, 7].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setForm((prev) => ({ ...prev, days: String(num) }))}
                    className={`text-xs px-2.5 py-1 rounded-md border transition ${
                      Number(form.days) === num
                        ? "bg-purple-950/80 text-purple-300 border-purple-500 font-semibold"
                        : "bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="budget" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <IndianRupee size={16} className="text-emerald-400" />
                  <span>Estimated Total Budget (₹)</span>
                </label>
                <span className="text-xs text-slate-400">INR</span>
              </div>

              <input
                id="budget"
                type="number"
                name="budget"
                placeholder="e.g. 25000"
                value={form.budget}
                onChange={handleChange}
                required
                min={1000}
                step={500}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-base"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-400">Presets:</span>
                {[15000, 30000, 50000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setForm((prev) => ({ ...prev, budget: String(amt) }))}
                    className={`text-xs px-2.5 py-1 rounded-md border transition ${
                      Number(form.budget) === amt
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500 font-semibold"
                        : "bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="interests" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <span>Interests & Travel Style</span>
              </label>
              <span className="text-xs text-slate-400">Click tags below or type custom</span>
            </div>

            <textarea
              id="interests"
              name="interests"
              rows={3}
              placeholder="e.g. beaches, sunset viewpoints, seafood, local markets, historic monuments..."
              value={form.interests}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-base leading-relaxed resize-none"
            />

            {/* Interactive tag pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {SUGGESTED_INTERESTS.map((tag) => {
                const isActive = activeInterestsList.includes(tag.toLowerCase());
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleInterest(tag)}
                    className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
                      isActive
                        ? "bg-cyan-950/90 text-cyan-200 border-cyan-500 font-medium"
                        : "bg-slate-800/60 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {isActive ? <Check size={12} className="text-cyan-400" /> : <Plus size={12} className="text-slate-400" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:via-sky-400 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed py-4 px-6 rounded-2xl text-white text-base sm:text-lg font-bold shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Compass size={22} className="animate-spin" style={{ animationDuration: "12s" }} />
              <span>{loading ? "Generating AI Travel Plan..." : "Generate AI Travel Plan"}</span>
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              Powered by Gemini & LangGraph Multi-Agent Architecture
            </p>
          </div>
        </form>
      </div>
    </>
  );
}