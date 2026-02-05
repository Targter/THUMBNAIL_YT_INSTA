import { Link } from "react-router-dom";
import { ArrowRight, Wand2 } from "lucide-react";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span>🎨</span> ThumbAI
        </div>
        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Log In
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
          v1.0 Public Beta
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Thumbnails generated <br />
          <span className="text-blue-600">in seconds.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10">
          Stop wasting hours in Photoshop. Describe your video, and let our AI
          generate high-CTR thumbnails tailored for YouTube and Instagram.
        </p>

        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-200"
        >
          <Wand2 size={20} />
          Start Generating Free
          <ArrowRight size={20} />
        </Link>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-4xl opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {/* Placeholders for social proof */}
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </main>
    </div>
  );
};
