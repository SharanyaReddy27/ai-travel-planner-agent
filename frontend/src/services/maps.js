/**
 * Google Maps search URL helper.
 * Generates safe URL-encoded Google Maps search links without requiring an API key.
 */

export function getGoogleMapsUrl(query, destination = "") {
  const parts = [];
  if (query) parts.push(String(query).trim());
  if (destination && !String(query).toLowerCase().includes(String(destination).toLowerCase())) {
    parts.push(String(destination).trim());
  }

  const cleanQuery = parts.join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery)}`;
}

export function openGoogleMaps(query, destination = "") {
  if (typeof window === "undefined") return;
  const url = getGoogleMapsUrl(query, destination);
  window.open(url, "_blank", "noopener,noreferrer");
}
