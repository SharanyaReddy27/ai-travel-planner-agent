import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { planTrip } from "../services/api";
import LoadingScreen from "./LoadingScreen";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
  ArrowRight,
} from "lucide-react";

const POPULAR_DESTINATIONS = ["Goa", "Manali", "Jaipur", "Kerala", "Switzerland", "Paris"];

const SUGGESTED_INTERESTS = [
  "Beach",
  "Food",
  "Culture",
  "Nature",
  "Adventure",
  "Nightlife",
  "History",
  "Relaxation",
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
    interests: "Beach, Food, Relaxation",
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

    // Capitalize first letter of each tag for natural presentation
    const formatted = updated
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(", ");

    setForm((prev) => ({
      ...prev,
      interests: formatted,
    }));
  };

  const submit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");

    if (!form.destination.trim()) {
      setErrorMessage("Please share where you would like to go.");
      return;
    }
    if (!form.days || Number(form.days) < 1) {
      setErrorMessage("Please enter how many days you plan to travel (at least 1 day).");
      return;
    }
    if (!form.budget || Number(form.budget) < 1000) {
      setErrorMessage("Please enter an estimated budget of at least ₹1,000.");
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
        err.message || "We couldn't shape your trip right now. Please check your connection and try again."
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
        <form
          onSubmit={submit}
          className="bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-200/60 space-y-8"
        >
          {/* Card Header */}
          <div className="border-b border-[#E8E2D8] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#C9785B]">
                Personal Travel Planner
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#26332C] mt-1">
                Tell us about your upcoming journey
              </h2>
            </div>
            <p className="text-xs text-[#6B756E]">
              Custom itinerary, weather, stays & costs
            </p>
          </div>

          {/* Inline Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="bg-[#FDF2F0] border border-[#F3C5BA] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-[#8A2C1D] text-sm animate-fadeIn"
            >
              <AlertCircle size={20} className="shrink-0 text-[#C9785B] mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-[#8A2C1D]">Please check your details</p>
                <p className="text-[#8A2C1D]/80 mt-0.5">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => submit()}
                className="bg-[#8A2C1D] hover:bg-[#6E2216] text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Destination Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="destination" className="text-sm font-semibold text-[#26332C] flex items-center gap-2">
                <MapPin size={17} className="text-[#285943]" />
                <span>Where do you want to go?</span>
              </label>
              <span className="text-xs text-[#6B756E]">City, Region, or Country</span>
            </div>

            <input
              id="destination"
              type="text"
              name="destination"
              placeholder="e.g. Goa, Manali, Jaipur, Switzerland, Paris..."
              value={form.destination}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#26332C] placeholder-[#9CA39E] focus:outline-none focus:ring-2 focus:ring-[#285943]/20 focus:border-[#285943] transition text-base"
            />

            {/* Popular destination quick chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[#6B756E] font-medium">Popular ideas:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  type="button"
                  key={dest}
                  onClick={() => handleSelectDestination(dest)}
                  className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer ${
                    form.destination.toLowerCase() === dest.toLowerCase()
                      ? "bg-[#285943] text-white border-[#285943] font-medium"
                      : "bg-[#FAF8F5] text-[#26332C] border-[#E8E2D8] hover:border-[#8FAF9A] hover:bg-white"
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
                <label htmlFor="days" className="text-sm font-semibold text-[#26332C] flex items-center gap-2">
                  <Calendar size={17} className="text-[#285943]" />
                  <span>How long are you staying?</span>
                </label>
                <span className="text-xs text-[#6B756E]">1 to 30 days</span>
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
                className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#26332C] placeholder-[#9CA39E] focus:outline-none focus:ring-2 focus:ring-[#285943]/20 focus:border-[#285943] transition text-base"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-[#6B756E]">Quick picks:</span>
                {[3, 5, 7].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setForm((prev) => ({ ...prev, days: String(num) }))}
                    className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      Number(form.days) === num
                        ? "bg-[#285943] text-white border-[#285943] font-medium"
                        : "bg-[#FAF8F5] text-[#6B756E] border-[#E8E2D8] hover:text-[#26332C] hover:bg-white"
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
                <label htmlFor="budget" className="text-sm font-semibold text-[#26332C] flex items-center gap-2">
                  <IndianRupee size={17} className="text-[#285943]" />
                  <span>What's your budget?</span>
                </label>
                <span className="text-xs text-[#6B756E]">Total in INR (₹)</span>
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
                className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#26332C] placeholder-[#9CA39E] focus:outline-none focus:ring-2 focus:ring-[#285943]/20 focus:border-[#285943] transition text-base"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-[#6B756E]">Suggested:</span>
                {[15000, 30000, 50000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setForm((prev) => ({ ...prev, budget: String(amt) }))}
                    className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      Number(form.budget) === amt
                        ? "bg-[#285943] text-white border-[#285943] font-medium"
                        : "bg-[#FAF8F5] text-[#6B756E] border-[#E8E2D8] hover:text-[#26332C] hover:bg-white"
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
              <label htmlFor="interests" className="text-sm font-semibold text-[#26332C] flex items-center gap-2">
                <Sparkles size={17} className="text-[#C9785B]" />
                <span>What do you enjoy?</span>
              </label>
              <span className="text-xs text-[#6B756E]">Select tags or write freely below</span>
            </div>

            {/* Elegant Travel Tags */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {SUGGESTED_INTERESTS.map((tag) => {
                const isActive = activeInterestsList.includes(tag.toLowerCase());
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleInterest(tag)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition cursor-pointer ${
                      isActive
                        ? "bg-[#285943] text-white border-[#285943] font-medium shadow-xs"
                        : "bg-[#FAF8F5] text-[#26332C] border-[#E8E2D8] hover:border-[#8FAF9A] hover:bg-white"
                    }`}
                  >
                    {isActive ? (
                      <Check size={12} className="text-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8FAF9A]" />
                    )}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            <textarea
              id="interests"
              name="interests"
              rows={2}
              placeholder="e.g. scenic coastal cafes, sunset points, walking tours, heritage architecture, quiet beaches..."
              value={form.interests}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-[#26332C] placeholder-[#9CA39E] focus:outline-none focus:ring-2 focus:ring-[#285943]/20 focus:border-[#285943] transition text-sm leading-relaxed resize-none mt-2"
            />
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#285943] hover:bg-[#1F4735] active:scale-[0.99] disabled:bg-stone-400 disabled:cursor-not-allowed py-4 px-6 rounded-2xl text-white text-base sm:text-lg font-semibold shadow-md shadow-[#285943]/20 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{loading ? "Planning your trip..." : "Plan My Trip"}</span>
              <ArrowRight size={19} />
            </button>

            <p className="text-center text-xs text-[#6B756E] mt-3">
              Your personalized itinerary, weather, stays, and budget will be ready in seconds.
            </p>
          </div>
        </form>
      </div>
    </>
  );
}