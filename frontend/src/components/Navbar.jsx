import { Plus, Menu, Compass } from "lucide-react";
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
    <nav className="sticky top-0 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8] px-4 sm:px-8 py-3.5 flex justify-between items-center z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open menu navigation"
          className="lg:hidden p-2 rounded-xl text-[#26332C] hover:bg-[#F2ECE1] border border-[#E8E2D8] transition"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] border border-[#8FAF9A]/50 hidden sm:flex items-center justify-center text-[#285943]">
            <Compass size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg sm:text-xl text-[#26332C] tracking-tight">
                ROAMLY
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8EFEA] text-[#285943] border border-[#8FAF9A]/40 hidden md:inline">
                Travel Guide
              </span>
            </div>
            {destination && (
              <p className="text-xs text-[#6B756E] font-medium hidden sm:block">
                Your {destination} getaway
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={newTrip}
          className="bg-[#285943] hover:bg-[#1F4735] text-white px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition duration-150 active:scale-95 shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Plan a New Trip</span>
        </button>
      </div>
    </nav>
  );
}