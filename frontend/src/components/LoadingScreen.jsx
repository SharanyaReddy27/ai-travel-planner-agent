export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col justify-center items-center z-50">

      <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-cyan-400"></div>

      <h2 className="text-white text-3xl mt-8 font-bold">
        🤖 AI Agents Planning Your Trip...
      </h2>

      <p className="text-slate-400 mt-3">
        Weather Agent • Budget Agent • Hotel Agent • Itinerary Agent
      </p>

    </div>
  );
}