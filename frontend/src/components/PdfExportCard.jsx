import { useState } from "react";
import { FileText, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
    <section className="rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-800/80 p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3 text-indigo-400">
            <FileText size={32} />
            <h2 className="text-3xl font-bold text-white">Download Travel Guide</h2>
          </div>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Export a complete, professionally formatted PDF guide for{" "}
            <span className="text-indigo-300 font-semibold">{dest}</span> with all itinerary days, hotels, weather, and budget details.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold px-7 py-4 rounded-2xl flex items-center justify-center gap-3 transition duration-200 shadow-xl shadow-indigo-600/30 shrink-0 text-base active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download PDF Guide</span>
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {downloadedFile && (
        <div className="bg-emerald-950/40 border border-emerald-700/80 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
          <span>
            Successfully generated and downloaded <strong className="text-white">{downloadedFile}</strong>!
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-700/80 rounded-2xl p-4 flex items-center gap-3 text-red-300 text-sm">
          <AlertCircle size={20} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* What's Included Preview */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/70 space-y-4">
        <h3 className="text-lg font-bold text-white">What's included in this PDF:</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase font-semibold">Destination</p>
            <p className="font-bold text-white mt-1">{dest}</p>
            <p className="text-xs text-indigo-400 mt-1">{days} Days Itinerary</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase font-semibold">Budget Plan</p>
            <p className="font-bold text-emerald-400 mt-1">{budget}</p>
            <p className="text-xs text-slate-400 mt-1">5 Category Allocation</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase font-semibold">Weather & Gear</p>
            <p className="font-bold text-cyan-300 mt-1">{trip?.weather?.temperature || "Live Weather"}</p>
            <p className="text-xs text-slate-400 mt-1">Packing & Precautions</p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs uppercase font-semibold">Stays & Sights</p>
            <p className="font-bold text-orange-400 mt-1">{trip?.hotels?.length || 3} Hotels</p>
            <p className="text-xs text-slate-400 mt-1">Day-wise Timeline</p>
          </div>
        </div>
      </div>
    </section>
  );
}
