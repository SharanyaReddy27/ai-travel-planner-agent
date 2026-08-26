export default function WeatherCard({weather}){

return(

<div className="bg-sky-800 p-6 rounded-2xl text-white">

<h2 className="text-2xl font-bold mb-3">

🌤 Weather Advice

</h2>

<pre className="whitespace-pre-wrap text-sm">

{weather}

</pre>

</div>

)

}