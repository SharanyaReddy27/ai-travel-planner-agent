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
    <section className="rounded-3xl bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] border border-[#8FAF9A]/50 flex items-center justify-center text-[#285943]">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#26332C]">
                Take Your Itinerary With You
              </h2>
              <p className="text-xs text-[#6B756E]">Ready for printing and offline access during your trip</p>
            </div>
          </div>
          <p className="text-[#6B756E] mt-3 text-xs sm:text-sm max-w-xl leading-relaxed">
            Download a curated travel guide for{" "}
            <span className="text-[#285943] font-semibold">{dest}</span> with your day-by-day itinerary, places to stay, weather notes, packing checklist, and budget breakdown.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          aria-label="Download your travel guide"
          className="bg-[#285943] hover:bg-[#1F4735] disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-semibold px-7 py-4 rounded-2xl flex items-center justify-center gap-3 transition duration-150 shadow-sm shrink-0 text-sm sm:text-base active:scale-95 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin text-white" size={20} />
              <span>Preparing your travel guide...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download Your Travel Guide</span>
            </>
          )}
        </button>
      </div>

      {/* Success Status Alert */}
      {downloadedFile && (
        <div
          role="status"
          className="bg-[#E8EFEA] border border-[#8FAF9A] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 text-[#285943] text-sm animate-fadeIn"
        >
          <CheckCircle2 size={22} className="shrink-0 text-[#285943]" />
          <div>
            <p className="font-bold text-[#26332C]">Your travel guide is downloaded!</p>
            <p className="text-[#285943] text-xs mt-0.5">
              Saved to your device as <strong className="underline">{downloadedFile}</strong>. Ready for offline exploration.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="bg-[#FDF2F0] border border-[#F3C5BA] rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-[#8A2C1D] text-sm"
        >
          <AlertCircle size={20} className="shrink-0 text-[#C9785B]" />
          <span>{error}</span>
        </div>
      )}

      {/* What the Guide Contains */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#26332C] flex items-center gap-2">
            <Sparkles size={16} className="text-[#C9785B]" />
            <span>Included in your guide</span>
          </h3>
          <span className="text-xs text-[#6B756E]">Offline dossier</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs sm:text-sm">
          {/* Destination & Duration */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#285943] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar size={16} />
            </div>
            <div>
              <p className="font-semibold text-[#26332C]">Destination & Dates</p>
              <p className="text-[#6B756E] text-xs mt-0.5">{dest} • {days} Days</p>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#285943] flex items-center justify-center shrink-0 mt-0.5">
              <Wallet size={16} />
            </div>
            <div>
              <p className="font-semibold text-[#26332C]">Budget Breakdown</p>
              <p className="text-[#6B756E] text-xs mt-0.5">{budget} Planned Allocations</p>
            </div>
          </div>

          {/* Weather & Gear */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#FAF3F0] text-[#C9785B] flex items-center justify-center shrink-0 mt-0.5">
              <CloudSun size={16} />
            </div>
            <div>
              <p className="font-semibold text-[#26332C]">Weather & Packing</p>
              <p className="text-[#6B756E] text-xs mt-0.5">Packing Checklist & Advice</p>
            </div>
          </div>

          {/* Hotel Stays */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] flex items-start gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#FAF3F0] text-[#C9785B] flex items-center justify-center shrink-0 mt-0.5">
              <Hotel size={16} />
            </div>
            <div>
              <p className="font-semibold text-[#26332C]">Places to Stay</p>
              <p className="text-[#6B756E] text-xs mt-0.5">{trip?.hotels?.length || 3} Curated Stays</p>
            </div>
          </div>

          {/* Full Itinerary */}
          <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] flex items-start gap-3 sm:col-span-2 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E8EFEA] text-[#285943] flex items-center justify-center shrink-0 mt-0.5">
              <Route size={16} />
            </div>
            <div>
              <p className="font-semibold text-[#26332C]">Complete Daily Itinerary</p>
              <p className="text-[#6B756E] text-xs mt-0.5">Morning to evening timeline with local sights & dining</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
