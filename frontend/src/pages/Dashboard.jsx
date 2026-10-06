import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DestinationBanner from "../components/DestinationBanner";
import WeatherCard from "../components/WeatherCard";
import BudgetCard from "../components/BudgetCard";
import HotelCard from "../components/HotelCard";
import ItineraryCard from "../components/ItineraryCard";
import MapsCard from "../components/MapsCard";
import PdfExportCard from "../components/PdfExportCard";
import { MapPin, Calendar, IndianRupee, Sparkles, Compass, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const { trip } = useTrip();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!trip) navigate("/");
  }, [trip, navigate]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Compass size={32} className="animate-spin" />
        </div>
        <h2 className="text-xl font-bold">No Active Trip Found</h2>
        <p className="text-slate-400 text-sm">Please create a trip plan from the planner.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition"
        >
          <ArrowLeft size={16} />
          <span>Return to Trip Planner</span>
        </button>
      </div>
    );
  }

  // Normalize backend response
  const tripData = trip.trip || trip.data || trip;

  const budgetData =
    tripData.budget_breakdown ||
    tripData.budget_plan ||
    tripData.budget ||
    [];

  return (
    <div className="bg-slate-950 min-h-screen flex text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar with mobile drawer support */}
      <Sidebar
        active={active}
        setActive={setActive}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          destination={tripData.destination || ""}
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Destination Header Banner */}
          <DestinationBanner
            destination={tripData.destination || "Travel"}
            days={tripData.days}
            budget={tripData.budget}
            interests={tripData.interests}
            summary={tripData.summary}
          />

          {/* Tab: Overview (All-in-one trip overview) */}
          {active === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Metric Overview Cards */}
              <OverviewCards trip={tripData} />

              {/* Weather & Budget 2-Column Grid */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <WeatherCard weather={tripData.weather} />

                <BudgetCard
                  budget={budgetData}
                  totalBudget={tripData.budget}
                  days={tripData.days}
                />
              </div>

              {/* Recommended Hotels */}
              <HotelCard hotels={tripData.hotels} destination={tripData.destination} />

              {/* Day-by-Day Itinerary */}
              <ItineraryCard itinerary={tripData.itinerary} destination={tripData.destination} />

              {/* Maps Section */}
              <MapsCard
                destination={tripData.destination}
                itinerary={tripData.itinerary}
                hotels={tripData.hotels}
              />

              {/* PDF Export Section */}
              <PdfExportCard trip={tripData} />
            </div>
          )}

          {/* Dedicated Tab: Weather */}
          {active === "weather" && (
            <div className="animate-fadeIn">
              <WeatherCard weather={tripData.weather} />
            </div>
          )}

          {/* Dedicated Tab: Budget */}
          {active === "budget" && (
            <div className="animate-fadeIn">
              <BudgetCard
                budget={budgetData}
                totalBudget={tripData.budget}
                days={tripData.days}
              />
            </div>
          )}

          {/* Dedicated Tab: Hotels */}
          {active === "hotels" && (
            <div className="animate-fadeIn">
              <HotelCard hotels={tripData.hotels} destination={tripData.destination} />
            </div>
          )}

          {/* Dedicated Tab: Itinerary */}
          {active === "itinerary" && (
            <div className="animate-fadeIn">
              <ItineraryCard itinerary={tripData.itinerary} destination={tripData.destination} />
            </div>
          )}

          {/* Dedicated Tab: Maps */}
          {active === "maps" && (
            <div className="animate-fadeIn">
              <MapsCard
                destination={tripData.destination}
                itinerary={tripData.itinerary}
                hotels={tripData.hotels}
              />
            </div>
          )}

          {/* Dedicated Tab: Download PDF */}
          {active === "pdf" && (
            <div className="animate-fadeIn">
              <PdfExportCard trip={tripData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Overview Metric Cards ---------------- */

function OverviewCards({ trip }) {
  const formattedBudget = trip.budget
    ? `₹${Number(trip.budget).toLocaleString("en-IN")}`
    : "₹0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        label="Destination"
        icon={<MapPin size={20} className="text-cyan-400" />}
        value={trip.destination || "Destination"}
        subtext="Target Location"
      />

      <MetricCard
        label="Trip Duration"
        icon={<Calendar size={20} className="text-purple-400" />}
        value={`${trip.days || 1} Days`}
        subtext="Planned Timeline"
      />

      <MetricCard
        label="Estimated Budget"
        icon={<IndianRupee size={20} className="text-emerald-400" />}
        value={formattedBudget}
        subtext="Allocated Funds"
        emerald
      />

      <MetricCard
        label="Interests & Style"
        icon={<Sparkles size={20} className="text-amber-400" />}
        value={trip.interests || "Sightseeing & Leisure"}
        subtext="Personalized Focus"
      />
    </div>
  );
}

/* ---------------- Metric Card ---------------- */

function MetricCard({ label, icon, value, subtext, emerald = false }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 hover:border-slate-700 transition duration-200 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      <div>
        <h3
          className={`text-xl sm:text-2xl font-extrabold truncate ${
            emerald ? "text-emerald-400" : "text-white"
          }`}
          title={value}
        >
          {value}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
      </div>
    </div>
  );
}