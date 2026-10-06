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
      <div className="min-h-screen bg-[#F7F4ED] flex flex-col items-center justify-center text-[#26332C] p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
          <Compass size={32} className="animate-spin" />
        </div>
        <h2 className="text-xl font-serif font-bold">No Active Trip Found</h2>
        <p className="text-[#6B756E] text-sm">Please plan a journey from the home page.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-[#285943] hover:bg-[#1F4735] text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition cursor-pointer"
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
    <div className="bg-[#F7F4ED] min-h-screen flex text-[#26332C] selection:bg-[#8FAF9A]/30 selection:text-[#285943]">
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

              {/* Places to Stay */}
              <HotelCard hotels={tripData.hotels} destination={tripData.destination} />

              {/* Day-by-Day Itinerary */}
              <ItineraryCard itinerary={tripData.itinerary} destination={tripData.destination} />

              {/* Maps Section */}
              <MapsCard
                destination={tripData.destination}
                itinerary={tripData.itinerary}
                hotels={tripData.hotels}
              />

              {/* PDF Guide Section */}
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
        icon={<MapPin size={19} className="text-[#285943]" />}
        value={trip.destination || "Destination"}
        subtext="Chosen Location"
      />

      <MetricCard
        label="Duration"
        icon={<Calendar size={19} className="text-[#285943]" />}
        value={`${trip.days || 1} Days`}
        subtext="Trip Schedule"
      />

      <MetricCard
        label="Planned Budget"
        icon={<IndianRupee size={19} className="text-[#285943]" />}
        value={formattedBudget}
        subtext="Estimated Total"
      />

      <MetricCard
        label="Style & Enjoyment"
        icon={<Sparkles size={19} className="text-[#C9785B]" />}
        value={trip.interests || "Sightseeing & Leisure"}
        subtext="Personalized Focus"
      />
    </div>
  );
}

/* ---------------- Metric Card ---------------- */

function MetricCard({ label, icon, value, subtext }) {
  return (
    <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 sm:p-6 hover:border-[#8FAF9A] transition duration-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs uppercase font-medium text-[#6B756E] tracking-wider">
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      <div>
        <h3
          className="text-xl sm:text-2xl font-serif font-bold text-[#26332C] truncate"
          title={value}
        >
          {value}
        </h3>
        <p className="text-xs text-[#6B756E] mt-1">{subtext}</p>
      </div>
    </div>
  );
}