import {
  LayoutDashboard,
  CloudSun,
  Wallet,
  Hotel,
  Route,
  MapPinned,
  FileText,
  X,
  Compass,
} from "lucide-react";

const menuItems = [
  { id: "overview", label: "Trip Overview", icon: LayoutDashboard },
  { id: "weather", label: "Weather & Packing", icon: CloudSun },
  { id: "budget", label: "Budget Breakdown", icon: Wallet },
  { id: "hotels", label: "Places to Stay", icon: Hotel },
  { id: "itinerary", label: "Daily Itinerary", icon: Route },
  { id: "maps", label: "Explore on Maps", icon: MapPinned },
  { id: "pdf", label: "Download Guide", icon: FileText },
];

export default function Sidebar({ active, setActive, isOpen, onClose }) {
  const handleItemClick = (id) => {
    setActive(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onClick={onClose}
          onKeyDown={(e) => (e.key === "Enter" || e.key === "Escape") && onClose && onClose()}
          className="fixed inset-0 bg-[#26332C]/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-[#FAF8F5] border-r border-[#E8E2D8] p-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
                <Compass size={22} />
              </div>
              <div>
                <h2 className="font-serif font-black text-xl text-[#26332C] leading-none tracking-tight">
                  ROAMLY
                </h2>
                <p className="text-[11px] text-[#6B756E] mt-1 font-medium">Your trip, thoughtfully planned.</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden text-[#6B756E] hover:text-[#26332C] p-1.5 rounded-lg hover:bg-[#F2ECE1] transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5" aria-label="Trip sections">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? "bg-[#285943] text-white shadow-xs font-semibold"
                      : "text-[#26332C] hover:bg-[#F2ECE1] hover:text-[#26332C]"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-[#6B756E]"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Planning Status */}
        <div className="pt-6 border-t border-[#E8E2D8]">
          <div className="bg-white rounded-xl p-3 border border-[#E8E2D8] flex items-center gap-3 shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8FAF9A] animate-pulse" />
            <div className="text-xs">
              <p className="font-semibold text-[#26332C]">Thoughtfully organized</p>
              <p className="text-[10px] text-[#6B756E]">Ready for your journey</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}