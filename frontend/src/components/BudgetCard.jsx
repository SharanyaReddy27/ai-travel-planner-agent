import { Wallet, IndianRupee } from "lucide-react";

export default function BudgetCard({ budget, totalBudget, days }) {
  const budgetItems = parseBudget(budget);

  return (
    <section className="rounded-3xl bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-700 p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Wallet className="text-emerald-400" size={34} />
        <h2 className="text-3xl font-bold text-white">Budget Planner</h2>
      </div>

      {/* Total Budget */}
      <div className="bg-slate-800/60 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-slate-400">Total Trip Budget</p>
          <h3 className="text-4xl font-bold text-emerald-400 mt-2">
            ₹{Number(totalBudget || 0).toLocaleString("en-IN")}
          </h3>
          <p className="text-slate-400 mt-2">{days} Days Trip</p>
        </div>

        <IndianRupee className="text-emerald-400" size={60} />
      </div>

      {/* Budget Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgetItems.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700"
          >
            <p className="text-slate-400">{item.category}</p>

            <h3 className="text-2xl font-bold text-white mt-2">
              ₹{item.amount}
            </h3>

            <p className="text-emerald-400 font-semibold mt-2">
              {item.percent}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Parse AI text into cards */
function parseBudget(text = "") {
  const categories = [
    ["Accommodation", "30%", "6,00,000"],
    ["Transport", "25%", "5,00,000"],
    ["Food", "12%", "2,40,000"],
    ["Shopping", "10%", "2,00,000"],
    ["Emergency", "8%", "1,60,000"],
    ["Activities", "15%", "3,00,000"],
  ];

  return categories.map(([category, percent, fallback]) => {
    const regex = new RegExp(
      `${category}[\\s\\S]*?₹([\\d,]+)`,
      "i"
    );

    const match = text.match(regex);

    return {
      category,
      percent,
      amount: match ? match[1] : fallback,
    };
  });
}