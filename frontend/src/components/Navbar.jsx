import { Compass, Plus, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";

export default function Navbar({ onToggleMobileMenu, destination = "" }) {
  const navigate = useNavigate();
  const { setTrip } = useTrip();

  function newTrip() {
    setTrip(null);
    navigate("/");
  }

  return (
    <nav className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4 flex justify-between items-center z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open menu navigation"
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hidden sm:flex items-center justify-center text-cyan-400">
            <Compass size={18} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
              AI Travel Planner
            </h1>
            {destination && (
              <p className="text-xs text-cyan-400 font-medium">
                {destination} Guide
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={newTrip}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition duration-150 active:scale-95 shadow-sm"
        >
          <Plus size={16} className="text-cyan-400" />
          <span>New Trip</span>
        </button>
      </div>
    </nav>
  );
}