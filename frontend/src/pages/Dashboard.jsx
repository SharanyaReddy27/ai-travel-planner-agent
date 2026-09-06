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

export default function Dashboard() {
  const { trip } = useTrip();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  // Redirect if no trip exists
  useEffect(() => {
    if (!trip) {
      navigate("/");
    }
  }, [trip, navigate]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading Trip...
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen flex text-white">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <Navbar />

        <div className="p-8 space-y-8">
          {/* Banner */}
          <DestinationBanner destination={trip?.destination || "Travel"} />

          {/* Overview */}
          {active === "overview" && (
            <>
              <OverviewCards trip={trip} />

              <WeatherCard weather={trip?.weather} />

              <BudgetCard
                budget={trip?.budget_plan}
                totalBudget={trip?.budget}
                days={trip?.days}
              />

              <HotelCard hotels={trip?.hotels} />

              <ItineraryCard itinerary={trip?.itinerary} />
            </>
          )}

          {/* Individual Sidebar Sections */}

          {active === "weather" && (
            <WeatherCard weather={trip?.weather} />
          )}

          {active === "budget" && (
            <BudgetCard
              budget={trip?.budget_plan}
              totalBudget={trip?.budget}
              days={trip?.days}
            />
          )}

          {active === "hotels" && (
            <HotelCard hotels={trip?.hotels} />
          )}

          {active === "itinerary" && (
            <ItineraryCard itinerary={trip?.itinerary} />
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
        value={trip?.destination || "-"}
      />

      <Card
        title="Days"
        icon="🗓"
        value={`${trip?.days || 0} Days`}
      />

      <Card
        title="Budget"
        icon="💰"
        value={`₹${Number(trip?.budget || 0).toLocaleString("en-IN")}`}
        green
      />

      <Card
        title="Interests"
        icon="❤️"
        value={trip?.interests || "-"}
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