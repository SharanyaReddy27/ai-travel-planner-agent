import {
  Wallet,
  Hotel,
  Utensils,
  Car,
  Compass,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const CATEGORY_ICONS = {
  accommodation: Hotel,
  hotel: Hotel,
  stay: Hotel,
  food: Utensils,
  dining: Utensils,
  meals: Utensils,
  transport: Car,
  transportation: Car,
  travel: Car,
  activities: Compass,
  sightseeing: Compass,
  miscellaneous: ShieldCheck,
  emergency: ShieldCheck,
  contingency: ShieldCheck,
};

function getCategoryIcon(catName = "") {
  const lower = catName.toLowerCase();
  for (const [key, IconComp] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return IconComp;
  }
  return TrendingUp;
}

export default function BudgetCard({ budget, totalBudget, days }) {
  const items = parseBudget(budget);

  // Compute total numeric budget if possible
  const numericTotal = totalBudget
    ? Number(totalBudget)
    : items.reduce((sum, item) => sum + (item.numVal || 0), 0);

  const perDay = days && numericTotal > 0 ? Math.round(numericTotal / Number(days)) : null;

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Budget Breakdown</h2>
            <p className="text-xs text-slate-400">Allocated estimates & daily spending</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300">
          Estimated
        </span>
      </div>

      {/* Total Budget Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 rounded-2xl p-5 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-semibold text-slate-400">Total Planned Budget</span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1 flex items-center">
            <span>₹{numericTotal ? numericTotal.toLocaleString("en-IN") : "0"}</span>
          </div>
        </div>

        {perDay && (
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-4 py-2.5 self-start sm:self-auto">
            <p className="text-[11px] uppercase font-bold text-emerald-400">Daily Average</p>
            <p className="text-lg font-bold text-emerald-200">
              ₹{perDay.toLocaleString("en-IN")}{" "}
              <span className="text-xs text-emerald-400 font-normal">/ day</span>
            </p>
          </div>
        )}
      </div>

      {/* Category List with Visual Progress Bars */}
      {items.length > 0 ? (
        <div className="space-y-3.5">
          {items.map((item, index) => {
            const Icon = getCategoryIcon(item.category);
            const pctVal = item.numPct || 20;

            return (
              <div
                key={index}
                className="bg-slate-950/60 hover:bg-slate-800/50 rounded-2xl p-4 border border-slate-800/80 transition space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="font-semibold text-white text-sm sm:text-base truncate">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    {item.percent && (
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                        {item.percent}
                      </span>
                    )}
                    <span className="text-emerald-400 font-bold text-sm sm:text-base">
                      {item.amount}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(pctVal, 5), 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-950/60 rounded-2xl p-6 text-center text-slate-400 border border-slate-800">
          No budget breakdown details available.
        </div>
      )}
    </section>
  );
}

function parseBudget(budget) {
  if (!budget) return [];

  if (Array.isArray(budget)) {
    return budget.map((item) => {
      let rawAmt = item.amount !== undefined ? item.amount : item.price || item.value || 0;
      let numVal = typeof rawAmt === "number" ? rawAmt : Number(String(rawAmt).replace(/[^0-9]/g, "")) || 0;
      let displayAmt = typeof rawAmt === "number" ? `₹${rawAmt.toLocaleString("en-IN")}` : String(rawAmt);
      if (!displayAmt.startsWith("₹") && numVal > 0) displayAmt = `₹${numVal.toLocaleString("en-IN")}`;

      let rawPct = item.percent !== undefined ? item.percent : item.percentage || "";
      let numPct = Number(String(rawPct).replace(/[^0-9.]/g, "")) || 0;
      let displayPct = rawPct ? (String(rawPct).includes("%") ? String(rawPct) : `${rawPct}%`) : "";

      return {
        category: item.category || item.title || "Expense",
        amount: displayAmt || "₹0",
        numVal,
        percent: displayPct,
        numPct,
      };
    });
  }

  if (typeof budget === "object") {
    return Object.entries(budget).map(([key, value]) => {
      const numVal = typeof value === "number" ? value : Number(String(value).replace(/[^0-9]/g, "")) || 0;
      return {
        category: key.replace(/_/g, " "),
        amount: `₹${numVal.toLocaleString("en-IN")}`,
        numVal,
        percent: "",
        numPct: 20,
      };
    });
  }

  const lines = String(budget)
    .split("\n")
    .filter((line) => line.includes("₹"));

  return lines.map((line) => {
    const amount = line.match(/₹[\d,]+/)?.[0] || "";
    const percent = line.match(/\((.*?)\)/)?.[1] || "";
    const numVal = Number(amount.replace(/[^0-9]/g, "")) || 0;
    const numPct = Number(percent.replace(/[^0-9.]/g, "")) || 20;
    const category = line
      .replace(amount, "")
      .replace(/\(.*?\)/, "")
      .replace(/[:|-]/g, "")
      .trim();

    return { category, amount, numVal, percent, numPct };
  });
}