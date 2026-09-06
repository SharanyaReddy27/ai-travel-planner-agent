import {
  LayoutDashboard,
  CloudSun,
  Wallet,
  Hotel,
  Route,
  MapPinned,
  FileText,
} from "lucide-react";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "weather", label: "Weather", icon: CloudSun },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "itinerary", label: "Itinerary", icon: Route },
  { id: "maps", label: "Maps", icon: MapPinned },
  { id: "pdf", label: "Download PDF", icon: FileText },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        ✈ AI Planner
      </h1>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition ${
                active === item.id
                  ? "bg-cyan-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}