import {useState} from "react";
import {planTrip} from "../services/api";

export default function PlannerForm({setTrip}){

const [loading,setLoading]=useState(false);

const [form,setForm]=useState({
destination:"",
days:"",
budget:"",
interests:""
});

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
})

}

const submit=async(e)=>{

e.preventDefault();

setLoading(true);

const data=await planTrip({
destination:form.destination,
days:Number(form.days),
budget:Number(form.budget),
interests:form.interests
});

setTrip(data);

setLoading(false);

}

return(

<form
onSubmit={submit}
className="bg-slate-900 rounded-3xl p-8 max-w-3xl mx-auto space-y-5 shadow-2xl">

<input
className="w-full p-4 rounded-xl bg-slate-800 text-white"
placeholder="Destination"
name="destination"
onChange={handleChange}
/>

<input
type="number"
className="w-full p-4 rounded-xl bg-slate-800 text-white"
placeholder="Number of Days"
name="days"
onChange={handleChange}
/>

<input
type="number"
className="w-full p-4 rounded-xl bg-slate-800 text-white"
placeholder="Budget"
name="budget"
onChange={handleChange}
/>

<textarea
className="w-full p-4 rounded-xl bg-slate-800 text-white"
rows="4"
placeholder="Interests (beaches, cafes, nightlife...)"
name="interests"
onChange={handleChange}
/>

<button
className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold">

{loading?"Generating Trip...":"Generate Trip"}

</button>

</form>

)

}