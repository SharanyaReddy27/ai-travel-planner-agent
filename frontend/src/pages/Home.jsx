import Hero from "../components/Hero";
import PlannerForm from "../components/PlannerForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <PlannerForm />
      </div>
    </div>
  );
}