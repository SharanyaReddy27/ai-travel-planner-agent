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
    <section className="rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
            <Wallet size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C]">
              Budget Breakdown
            </h2>
            <p className="text-xs text-[#6B756E]">Thoughtful spending allocations</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#6B756E]">
          Estimated
        </span>
      </div>

      {/* Total Budget Card */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-medium text-[#6B756E]">Your Planned Trip</span>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#26332C] mt-1">
            ₹{numericTotal ? numericTotal.toLocaleString("en-IN") : "0"}
          </div>
        </div>

        {perDay && (
          <div className="bg-white border border-[#E8E2D8] rounded-xl px-4 py-2.5 self-start sm:self-auto shadow-2xs">
            <p className="text-[11px] uppercase font-semibold text-[#6B756E]">Average Per Day</p>
            <p className="text-base sm:text-lg font-serif font-bold text-[#285943]">
              ₹{perDay.toLocaleString("en-IN")}{" "}
              <span className="text-xs text-[#6B756E] font-sans font-normal">/ day</span>
            </p>
          </div>
        )}
      </div>

      {/* Category List with Soft Indicators */}
      {items.length > 0 ? (
        <div className="space-y-3.5">
          {items.map((item, index) => {
            const Icon = getCategoryIcon(item.category);
            const pctVal = item.numPct || 20;

            return (
              <div
                key={index}
                className="bg-[#FAF8F5] hover:bg-[#F2ECE1] rounded-2xl p-4 border border-[#E8E2D8] transition space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D8] flex items-center justify-center text-[#285943] shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="font-semibold text-[#26332C] text-sm sm:text-base truncate">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    {item.percent && (
                      <span className="text-xs text-[#6B756E] font-medium hidden sm:inline">
                        {item.percent}
                      </span>
                    )}
                    <span className="text-[#285943] font-bold text-sm sm:text-base">
                      {item.amount}
                    </span>
                  </div>
                </div>

                {/* Calm Warm Progress bar */}
                <div className="w-full bg-[#E8E2D8] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#285943] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(pctVal, 5), 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FAF8F5] rounded-2xl p-6 text-center text-[#6B756E] border border-[#E8E2D8]">
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