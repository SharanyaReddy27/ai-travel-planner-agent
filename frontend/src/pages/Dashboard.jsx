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

export default function Dashboard() {
  const { trip } = useTrip();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  useEffect(() => {
    if (!trip) navigate("/");
  }, [trip, navigate]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading Trip...
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
    <div className="bg-slate-950 min-h-screen flex text-white">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <Navbar />

        <div className="p-8 space-y-8">
          {/* Destination Banner */}
          <DestinationBanner
            destination={tripData.destination || "Travel"}
          />

          {/* Overview */}
          {active === "overview" && (
            <>
              <OverviewCards trip={tripData} />

              <div className="grid lg:grid-cols-2 gap-6">
                <WeatherCard weather={tripData.weather} />

                <BudgetCard
                  budget={budgetData}
                  totalBudget={tripData.budget}
                  days={tripData.days}
                />
              </div>

              <HotelCard hotels={tripData.hotels} destination={tripData.destination} />

              <ItineraryCard itinerary={tripData.itinerary} destination={tripData.destination} />
            </>
          )}

          {/* Weather Page */}
          {active === "weather" && (
            <WeatherCard weather={tripData.weather} />
          )}

          {/* Budget Page */}
          {active === "budget" && (
            <BudgetCard
              budget={budgetData}
              totalBudget={tripData.budget}
              days={tripData.days}
            />
          )}

          {/* Hotels Page */}
          {active === "hotels" && (
            <HotelCard hotels={tripData.hotels} destination={tripData.destination} />
          )}

          {/* Itinerary Page */}
          {active === "itinerary" && (
            <ItineraryCard itinerary={tripData.itinerary} destination={tripData.destination} />
          )}

          {/* Maps Page */}
          {active === "maps" && (
            <MapsCard
              destination={tripData.destination}
              itinerary={tripData.itinerary}
              hotels={tripData.hotels}
            />
          )}

          {/* Download PDF Page */}
          {active === "pdf" && (
            <PdfExportCard trip={tripData} />
          )}
        </div>
      </div>
    </div>
  );
}


/* ---------------- Overview Cards ---------------- */

function OverviewCards({ trip }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <Card
        title="Destination"
        icon="🌍"
        value={trip.destination || "Travel"}
      />

      <Card
        title="Days"
        icon="🗓"
        value={`${trip.days || 0} Days`}
      />

      <Card
        title="Budget"
        icon="💰"
        value={`₹${Number(trip.budget || 0).toLocaleString("en-IN")}`}
        green
      />

      <Card
        title="Interests"
        icon="❤️"
        value={trip.interests || "Not specified"}
      />
    </div>
  );
}

/* ---------------- Card ---------------- */

function Card({ title, icon, value, green = false }) {
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 hover:border-cyan-500 transition duration-300">
      <p className="text-slate-400 text-sm">{title}</p>

      <h2
        className={`mt-3 text-2xl font-bold ${
          green ? "text-green-400" : "text-white"
        }`}
      >
        {icon} {value}
      </h2>
    </div>
  );
}