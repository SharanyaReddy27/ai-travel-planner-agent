import { Compass, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { setTrip } = useTrip();

  function newTrip() {
    setTrip(null);
    navigate("/");
  }

  return (
    <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-8 py-5 flex justify-between items-center z-50">

      <div className="flex items-center gap-3">
        <Compass className="text-cyan-400"/>
        <h1 className="text-xl font-bold">AI Travel Planner Dashboard</h1>
      </div>

      <button
        onClick={newTrip}
        className="bg-cyan-600 hover:bg-cyan-700 px-5 py-3 rounded-xl flex gap-2 items-center"
      >
        <Plus size={18}/>
        New Trip
      </button>

    </nav>
  );
}