import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Wallet,
  CloudSun,
  Hotel,
  Route,
  Sparkles,
} from "lucide-react";
import { generateTripPdf } from "../services/pdfGenerator";

export default function PdfExportCard({ trip }) {
  const [loading, setLoading] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState("");
  const [error, setError] = useState("");

  const dest = trip?.destination || "Travel Destination";
  const days = trip?.days || 1;
  const budget = trip?.budget ? `₹${Number(trip.budget).toLocaleString("en-IN")}` : "₹0";

  async function handleDownload() {
    setLoading(true);
    setError("");
    setDownloadedFile("");

    try {
      const filename = await generateTripPdf(trip);
      setDownloadedFile(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError(err?.message || "Failed to generate travel guide PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Download Travel Guide PDF</h2>
              <p className="text-xs text-slate-400">Export your offline-ready travel itinerary</p>
            </div>
          </div>
          <p className="text-slate-300 mt-3 text-xs sm:text-sm max-w-xl leading-relaxed">
            Generate a high-resolution, print-ready PDF travel guide for{" "}
            <span className="text-indigo-400 font-semibold">{dest}</span> with all itinerary days, hotels, weather forecast, packing checklist, and budget breakdown.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          aria-label="Download Travel Guide PDF"
          className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold px-7 py-4 rounded-2xl flex items-center justify-center gap-3 transition duration-150 shadow-xl shadow-indigo-600/25 shrink-0 text-sm sm:text-base active:scale-95 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin text-white" size={20} />
              <span>Generating your travel guide...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download Travel Guide</span>
            </>
          )}
        </button>
      </div>

      {/* Success Status Alert */}
      {downloadedFile && (
        <div
          role="status"
          className="bg-emerald-950/40 border border-emerald-700/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 text-emerald-300 text-sm shadow-md animate-fadeIn"
        >
          <CheckCircle2 size={22} className="shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold text-white">PDF Travel Guide Generated Successfully!</p>
            <p className="text-emerald-300 text-xs mt-0.5">
              Saved to your device as <strong className="text-white underline">{downloadedFile}</strong>. Ready for offline access.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="bg-red-950/40 border border-red-700/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-red-300 text-sm"
        >
          <AlertCircle size={20} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* What the PDF Contains */}
      <div className="bg-slate-950/60 rounded-2xl p-5 sm:p-6 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>What Your Travel Guide Contains</span>
          </h3>
          <span className="text-xs text-slate-400">Complete Offline Dossier</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
          {/* Destination & Duration */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar size={16} />
            </div>
            <div>
              <p className="font-semibold text-white">Destination & Dates</p>
              <p className="text-slate-400 text-xs mt-0.5">{dest} • {days} Days Planned</p>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Wallet size={16} />
            </div>
            <div>
              <p className="font-semibold text-white">Budget Breakdown</p>
              <p className="text-slate-400 text-xs mt-0.5">{budget} Across 5 Categories</p>
            </div>
          </div>

          {/* Weather & Gear */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <CloudSun size={16} />
            </div>
            <div>
              <p className="font-semibold text-white">Weather & Packing</p>
              <p className="text-slate-400 text-xs mt-0.5">Packing Checklist & Precautions</p>
            </div>
          </div>

          {/* Hotel Stays */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
              <Hotel size={16} />
            </div>
            <div>
              <p className="font-semibold text-white">Hotel Recommendations</p>
              <p className="text-slate-400 text-xs mt-0.5">{trip?.hotels?.length || 3} Curated Stays with Ratings</p>
            </div>
          </div>

          {/* Full Itinerary */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3 sm:col-span-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Route size={16} />
            </div>
            <div>
              <p className="font-semibold text-white">Full Day-by-Day Itinerary</p>
              <p className="text-slate-400 text-xs mt-0.5">Morning, lunch, afternoon, evening & night timeline with costs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
