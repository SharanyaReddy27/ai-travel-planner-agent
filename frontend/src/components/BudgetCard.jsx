export default function BudgetCard({ budget, totalBudget, days }) {
  const items = parseBudget(budget);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">
        💰 Budget Breakdown
      </h2>

      {totalBudget && (
        <div className="bg-emerald-500/10 rounded-2xl p-4 mb-6 border border-emerald-500/20">
          <p className="text-slate-400 text-sm">Total Budget</p>
          <h3 className="text-3xl font-bold text-white">
            ₹{Number(totalBudget).toLocaleString("en-IN")}
          </h3>

          {days && (
            <p className="text-emerald-300 mt-2">
              Approx ₹
              {Math.round(Number(totalBudget) / Number(days)).toLocaleString(
                "en-IN"
              )}{" "}
              per day
            </p>
          )}
        </div>
      )}

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-white">{item.category}</h3>
                {item.percent && (
                  <p className="text-sm text-slate-400">{item.percent}</p>
                )}
              </div>

              <p className="text-emerald-400 font-bold text-lg">
                {item.amount}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <pre className="whitespace-pre-wrap text-slate-300">
          {typeof budget === "string"
            ? budget
            : JSON.stringify(budget, null, 2)}
        </pre>
      )}
    </div>
  );
}

function parseBudget(budget) {
  if (!budget) return [];

  // Already an array
  if (Array.isArray(budget)) {
    return budget.map((item) => ({
      category: item.category || item.title || "Expense",
      amount:
        item.amount ||
        item.price ||
        `₹${Number(item.value || 0).toLocaleString("en-IN")}`,
      percent: item.percent || item.percentage || "",
    }));
  }

  // Object
  if (typeof budget === "object") {
    return Object.entries(budget).map(([key, value]) => ({
      category: key.replace(/_/g, " "),
      amount:
        typeof value === "number"
          ? `₹${value.toLocaleString("en-IN")}`
          : String(value),
      percent: "",
    }));
  }

  // String from Gemini
  const lines = String(budget)
    .split("\n")
    .filter((line) => line.includes("₹"));

  return lines.map((line) => {
    const amount = line.match(/₹[\d,]+/)?.[0] || "";
    const percent = line.match(/\((.*?)\)/)?.[1] || "";
    const category = line
      .replace(amount, "")
      .replace(/\(.*?\)/, "")
      .replace(/[:|-]/g, "")
      .trim();

    return { category, amount, percent };
  });
}