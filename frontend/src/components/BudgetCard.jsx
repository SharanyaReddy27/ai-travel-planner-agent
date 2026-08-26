export default function BudgetCard({budget}){

return(

<div className="bg-emerald-700 p-6 rounded-2xl text-white">

<h2 className="text-2xl font-bold mb-3">

💰 Budget Breakdown

</h2>

<pre className="whitespace-pre-wrap text-sm">

{budget}

</pre>

</div>

)

}