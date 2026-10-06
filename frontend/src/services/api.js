const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function planTrip(data) {
  const res = await fetch(`${API_URL}/plan-trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody.detail || errBody.error || `Server error (${res.status})`;
    throw new Error(message);
  }

  const result = await res.json();

  console.log("Backend Response:", result);

  // Return only the actual trip object.
  return result.trip || result.data || result;
}