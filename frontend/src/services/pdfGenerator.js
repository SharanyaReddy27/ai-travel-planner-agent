import { jsPDF } from "jspdf";

/**
 * Formats currency values cleanly for standard PDF fonts.
 * Uses 'Rs.' to prevent encoding artifacts in standard Helvetica font.
 */
function formatCurrency(val) {
  if (val === undefined || val === null) return "Rs. 0";
  const num = typeof val === "number" ? val : Number(String(val).replace(/[^0-9]/g, ""));
  if (isNaN(num)) return String(val).replace(/₹/g, "Rs. ");
  return `Rs. ${num.toLocaleString("en-IN")}`;
}

/**
 * Generates and downloads a formatted, professional PDF Travel Guide.
 */
export async function generateTripPdf(trip) {
  if (!trip) {
    throw new Error("No trip data available to generate PDF.");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkNewPage(neededSpace = 12) {
    if (y + neededSpace > pageHeight - margin - 8) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  function addSectionHeader(title, emoji = "") {
    checkNewPage(18);
    y += 4;
    doc.setFillColor(40, 89, 67); // forest green #285943
    doc.roundedRect(margin, y, contentWidth, 9, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`${emoji ? emoji + "  " : ""}${title}`.trim(), margin + 4, y + 6.2);
    y += 13;
  }

  // ============================================================================
  // Cover / Header Banner
  // ============================================================================
  doc.setFillColor(38, 51, 44); // deep charcoal #26332C
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent warm terracotta line
  doc.setFillColor(201, 120, 91); // terracotta #C9785B
  doc.rect(0, 42, pageWidth, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("ROAMLY TRAVEL GUIDE", margin, 18);

  const destination = trip.destination || "Your Destination";
  doc.setFontSize(14);
  doc.setTextColor(143, 175, 154); // sage #8FAF9A
  doc.text(destination.toUpperCase(), margin, 27);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const daysText = `${trip.days || 1} Days`;
  const budgetText = formatCurrency(trip.budget || 0);
  const interestsText = trip.interests ? `Interests: ${trip.interests}` : "";
  doc.text(`Duration: ${daysText}   |   Total Budget: ${budgetText}   |   ${interestsText}`, margin, 35);

  y = 50;

  // ============================================================================
  // Trip Overview / Summary
  // ============================================================================
  if (trip.summary) {
    addSectionHeader("TRIP OVERVIEW & HIGHLIGHTS", "✈");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700
    const summaryLines = doc.splitTextToSize(trip.summary, contentWidth - 4);
    for (const line of summaryLines) {
      checkNewPage(6);
      doc.text(line, margin + 2, y);
      y += 5.5;
    }
    y += 2;
  }

  // ============================================================================
  // Weather Advice
  // ============================================================================
  const weather = trip.weather || {};
  if (weather.temperature || weather.condition) {
    addSectionHeader("WEATHER ADVICE & PACKING", "☁");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    checkNewPage(7);
    doc.text(`Temperature: ${weather.temperature || "--"}   |   Condition: ${weather.condition || "--"}`, margin + 2, y);
    y += 5.5;

    if (weather.best_time) {
      checkNewPage(6);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(22, 101, 52); // green-800
      doc.text(`Best Time: ${weather.best_time}`, margin + 2, y);
      y += 6;
    }

    // Packing
    const pack = Array.isArray(weather.pack) ? weather.pack : [];
    if (pack.length > 0) {
      checkNewPage(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("Packing Essentials:", margin + 2, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const packStr = pack.join("   •   ");
      const packLines = doc.splitTextToSize(`• ${packStr}`, contentWidth - 6);
      for (const line of packLines) {
        checkNewPage(5);
        doc.text(line, margin + 4, y);
        y += 4.8;
      }
      y += 1;
    }

    // Precautions
    const precautions = Array.isArray(weather.precautions) ? weather.precautions : [];
    if (precautions.length > 0) {
      checkNewPage(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("Travel Precautions:", margin + 2, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      for (const p of precautions) {
        checkNewPage(5);
        const pLines = doc.splitTextToSize(`• ${p}`, contentWidth - 6);
        for (const line of pLines) {
          doc.text(line, margin + 4, y);
          y += 4.8;
        }
      }
    }
    y += 2;
  }

  // ============================================================================
  // Budget Breakdown
  // ============================================================================
  const budgetList = Array.isArray(trip.budget_breakdown)
    ? trip.budget_breakdown
    : Array.isArray(trip.budget_plan)
    ? trip.budget_plan
    : [];

  if (budgetList.length > 0) {
    addSectionHeader("BUDGET BREAKDOWN", "💰");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Category", margin + 4, y);
    doc.text("Estimated Amount", margin + 85, y);
    doc.text("Share (%)", margin + 145, y);
    y += 4.5;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin + 2, y, margin + contentWidth - 2, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);

    for (const item of budgetList) {
      checkNewPage(6);
      const cat = item.category || "Expense";
      const amt = formatCurrency(item.amount);
      const pct = item.percentage !== undefined ? `${item.percentage}%` : (item.percent || "--");

      doc.text(cat, margin + 4, y);
      doc.text(amt, margin + 85, y);
      doc.text(String(pct), margin + 145, y);
      y += 5.2;
    }
    y += 2;
  }

  // ============================================================================
  // Hotel Recommendations
  // ============================================================================
  const hotels = Array.isArray(trip.hotels) ? trip.hotels : [];
  if (hotels.length > 0) {
    addSectionHeader("RECOMMENDED HOTELS (ESTIMATED OPTIONS)", "🏨");

    for (let i = 0; i < hotels.length; i++) {
      const h = hotels[i];
      checkNewPage(18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const ratingStr = h.rating ? ` (${h.rating} ★)` : "";
      doc.text(`${i + 1}. ${h.name || "Recommended Hotel"}${ratingStr}`, margin + 2, y);
      y += 4.8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const priceStr = h.price ? formatCurrency(h.price) : "";
      const locStr = h.location ? `Location: ${h.location}` : "";
      const meta = [locStr, priceStr ? `Estimated: ${priceStr}` : ""].filter(Boolean).join("   |   ");
      if (meta) {
        doc.text(meta, margin + 6, y);
        y += 4.5;
      }

      if (h.description) {
        const descLines = doc.splitTextToSize(h.description, contentWidth - 10);
        for (const line of descLines) {
          checkNewPage(5);
          doc.text(line, margin + 6, y);
          y += 4.2;
        }
      }
      y += 3;
    }
  }

  // ============================================================================
  // Day-by-Day Itinerary
  // ============================================================================
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  if (itinerary.length > 0) {
    addSectionHeader("DAY-BY-DAY ITINERARY", "🗓");

    for (const day of itinerary) {
      checkNewPage(24);

      // Day Title Card
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(margin + 2, y - 3, contentWidth - 4, 8, 1.5, 1.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text(`Day ${day.day}: ${day.title || "Sightseeing"}`, margin + 5, y + 2.5);

      if (day.cost) {
        doc.setFontSize(9);
        doc.setTextColor(22, 101, 52); // green-800
        const costStr = formatCurrency(day.cost);
        doc.text(`Cost: ${costStr}`, margin + contentWidth - 36, y + 2.5);
      }
      y += 8.5;

      const slots = [
        { label: "Morning", text: day.morning },
        { label: "Lunch", text: day.lunch },
        { label: "Afternoon", text: day.afternoon },
        { label: "Evening", text: day.evening },
        { label: "Night", text: day.night },
      ];

      for (const slot of slots) {
        if (!slot.text) continue;
        checkNewPage(9);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(`• ${slot.label}:`, margin + 6, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const prefixWidth = doc.getTextWidth(`• ${slot.label}: `);
        const textLines = doc.splitTextToSize(slot.text, contentWidth - 12 - prefixWidth);

        if (textLines.length > 0) {
          doc.text(textLines[0], margin + 6 + prefixWidth, y);
          y += 4.5;
          for (let l = 1; l < textLines.length; l++) {
            checkNewPage(5);
            doc.text(textLines[l], margin + 6 + prefixWidth, y);
            y += 4.2;
          }
        } else {
          y += 4.5;
        }
      }
      y += 3;
    }
  }

  // ============================================================================
  // Page Numbers Footer
  // ============================================================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `ROAMLY   |   Your ${destination} Travel Guide   |   Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  // Generate safe filename
  const safeDest = String(destination || "trip")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const filename = `${safeDest || "travel"}-travel-guide.pdf`;
  doc.save(filename);
  return filename;
}
