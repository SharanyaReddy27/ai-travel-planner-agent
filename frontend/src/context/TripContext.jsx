import { createContext, useContext, useEffect, useState } from "react";

const TripContext = createContext();

export function TripProvider({ children }) {
  const [trip, setTripState] = useState(null);

  // Load saved trip on refresh
  useEffect(() => {
    const savedTrip = localStorage.getItem("tripData");
    if (savedTrip) {
      setTripState(JSON.parse(savedTrip));
    }
  }, []);

  // Save trip in state + localStorage
  const setTrip = (data) => {
    setTripState(data);
    localStorage.setItem("tripData", JSON.stringify(data));
  };

  const clearTrip = () => {
    setTripState(null);
    localStorage.removeItem("tripData");
  };

  return (
    <TripContext.Provider value={{ trip, setTrip, clearTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);