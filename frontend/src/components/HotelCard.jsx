export default function HotelCard({hotels}){

return(

<div className="bg-orange-700 p-6 rounded-2xl text-white">

<h2 className="text-2xl font-bold mb-3">

🏨 Recommended Hotels

</h2>

<pre className="whitespace-pre-wrap text-sm">

{hotels}

</pre>

</div>

)

}