import Calculator from "./components/calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-[1240px] mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          OneTrack ROI Calculator
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          See how OneTrack can help reduce your ad spend while increasing your
          revenue. Adjust the sliders to calculate your monthly savings.
        </p>
      </div>

      <div className="w-full max-w-[1240px]">
        <Calculator />
      </div>
    </main>
  );
}
