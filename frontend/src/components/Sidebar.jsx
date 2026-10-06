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
  { id: "hotels", label: "Recommended Stays", icon: Hotel },
  { id: "itinerary", label: "Daily Itinerary", icon: Route },
  { id: "maps", label: "Google Maps Explorer", icon: MapPinned },
  { id: "pdf", label: "Export PDF Guide", icon: FileText },
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass size={22} />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-white leading-tight">
                  Wanderlust <span className="text-cyan-400">AI</span>
                </h2>
                <p className="text-[11px] text-slate-400">Personal Travel Agent</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5" aria-label="Dashboard sections">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 text-left ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon size={19} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Agent Status */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <p className="font-medium text-slate-200">AI Agents Active</p>
              <p className="text-[10px] text-slate-400">Ready for instant query</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}