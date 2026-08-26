import {useState} from "react";

import Hero from "../components/Hero";
import PlannerForm from "../components/PlannerForm";
import WeatherCard from "../components/WeatherCard";
import BudgetCard from "../components/BudgetCard";
import HotelCard from "../components/HotelCard";
import ItineraryCard from "../components/ItineraryCard";

export default function Home(){

const [trip,setTrip]=useState(null);

return(

<div className="min-h-screen bg-slate-950 text-white">

<Hero/>

<PlannerForm setTrip={setTrip}/>

{trip && (

<div className="max-w-5xl mx-auto py-10 space-y-8 text-white">

<WeatherCard weather={trip.weather}/>

<BudgetCard budget={trip.budget}/>

<HotelCard hotels={trip.hotels}/>

<ItineraryCard itinerary={trip.itinerary}/>

</div>

)}

</div>

)

}