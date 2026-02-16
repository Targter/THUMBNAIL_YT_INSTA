import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Youtube,
  Instagram,
  Sparkles,
  LayoutTemplate,
  Move3d,
  Layers,
  Type,
  Download,
  ChevronRight,
  Command,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  // Simulating the UI state for the preview section
  const [activePlatform, setActivePlatform] = useState("youtube");

  return (
    <div className="min-h-screen bg-[#131314] text-[#E3E3E3] font-sans selection:bg-[#A8C7FA] selection:text-[#040404]">
      {/* Import Inter Font */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");
        body {
          font-family: "Inter", sans-serif;
        }
        .mono {
          font-family: "JetBrains Mono", monospace;
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-white/10 sticky top-0 bg-[#131314]/80 backdrop-blur-md z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#4285F4] to-[#9B72CB] rounded-sm"></div>
            <span className="text-lg font-medium tracking-tight">
              Creator Studio
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-[#C4C7C5] ml-2">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="#"
              className="text-[#C4C7C5] hover:text-white transition-colors"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-[#C4C7C5] hover:text-white transition-colors"
            >
              API
            </a>
            <Link to="/login">
              <button className="bg-[#A8C7FA] hover:bg-[#8AB4F8] text-[#040404] px-5 py-2 rounded-full text-sm font-medium transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-32">
        {/* Hero Section */}
        <div className="max-w-[1200px] mx-auto px-6 mb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Production-grade assets.
            <br />
            Research-lab control.
          </h1>
          <p className="text-xl text-[#C4C7C5] max-w-2xl mx-auto mb-10 font-light">
            A minimalist workspace for generating high-fidelity thumbnails.
            Maintain face consistency, edit layers inline, and export for any
            platform.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 bg-[#A8C7FA] text-[#040404] px-6 py-3 rounded-full font-medium hover:bg-[#8AB4F8] transition-all">
              <Sparkles size={18} />
              <span>Start Creating</span>
            </button>
            <button className="flex items-center gap-2 bg-[#1E1F20] border border-white/10 text-[#E3E3E3] px-6 py-3 rounded-full font-medium hover:bg-[#2D2E30] transition-all">
              <span>View Gallery</span>
              <ChevronRight size={18} className="text-[#C4C7C5]" />
            </button>
          </div>
        </div>

        {/* UI Mockup / Interface Preview */}
        {/* This mimics the actual dashboard UI requested */}
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="rounded-xl border border-white/10 bg-[#1E1F20] overflow-hidden shadow-2xl shadow-black/50">
            {/* Mock Toolbar */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-[#1E1F20]">
              <div className="flex items-center gap-4 text-xs text-[#C4C7C5]">
                <span className="flex items-center gap-2">
                  <LayoutTemplate size={14} /> Untitled Project
                </span>
                <span className="text-white/20">/</span>
                <span className="mono">v1.0.2</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-[#C4C7C5] mono">Credits: 240</div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Mock Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
              {/* LEFT PANEL: Inputs */}
              <div className="lg:col-span-3 border-r border-white/10 p-5 bg-[#131314]">
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="text-xs font-medium text-[#C4C7C5] mb-2 block uppercase tracking-wider">
                      Reference Image
                    </label>
                    <div className="h-32 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-[#C4C7C5] hover:border-[#A8C7FA] hover:text-[#A8C7FA] hover:bg-[#A8C7FA]/5 transition-all cursor-pointer">
                      <Upload size={20} className="mb-2" />
                      <span className="text-xs">Drop face/product here</span>
                    </div>
                  </div>

                  {/* Context */}
                  <div>
                    <label className="text-xs font-medium text-[#C4C7C5] mb-2 block uppercase tracking-wider">
                      Context
                    </label>
                    <textarea
                      className="w-full bg-[#1E1F20] border border-white/10 rounded-lg p-3 text-sm text-[#E3E3E3] placeholder:text-white/20 focus:outline-none focus:border-[#A8C7FA] resize-none h-24 font-light"
                      placeholder="Describe the scene (e.g., 'Shocked face looking at a glowing bitcoin chart...')"
                      readOnly
                    ></textarea>
                  </div>

                  {/* Platform Selector */}
                  <div>
                    <label className="text-xs font-medium text-[#C4C7C5] mb-2 block uppercase tracking-wider">
                      Platform
                    </label>
                    <div className="flex bg-[#1E1F20] p-1 rounded-lg border border-white/10">
                      <button
                        onClick={() => setActivePlatform("youtube")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[4px] text-xs transition-all ${activePlatform === "youtube" ? "bg-[#3C4043] text-white shadow-sm" : "text-[#C4C7C5] hover:text-white"}`}
                      >
                        <Youtube size={14} />
                        <span>YT</span>
                      </button>
                      <button
                        onClick={() => setActivePlatform("instagram")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[4px] text-xs transition-all ${activePlatform === "instagram" ? "bg-[#3C4043] text-white shadow-sm" : "text-[#C4C7C5] hover:text-white"}`}
                      >
                        <Instagram size={14} />
                        <span>IG</span>
                      </button>
                    </div>
                    <div className="text-[10px] text-[#C4C7C5] mt-2 mono text-right">
                      {activePlatform === "youtube"
                        ? "1280 x 720 px"
                        : "1080 x 1080 px"}
                    </div>
                  </div>

                  <button className="w-full bg-[#A8C7FA] hover:bg-[#8AB4F8] text-[#040404] py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 mt-4">
                    <Sparkles size={16} />
                    Generate
                  </button>
                </div>
              </div>

              {/* CENTER/RIGHT: Canvas/Results */}
              <div className="lg:col-span-9 bg-[#1E1F20] p-8 flex flex-col">
                {/* Result Grid Mockup */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-medium text-[#E3E3E3]">
                      Generated Assets
                    </h3>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/5 rounded-md text-[#C4C7C5]">
                        <Download size={16} />
                      </button>
                      <button className="p-2 hover:bg-white/5 rounded-md text-[#C4C7C5]">
                        <Layers size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1 */}
                    <div className="group relative aspect-video bg-[#131314] rounded-lg border border-white/10 overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-blue-900/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-medium">
                          Edit Canvas
                        </button>
                      </div>
                      {/* Fake thumbnail content */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-2 w-2/3 bg-white/10 rounded mb-2"></div>
                        <div className="h-2 w-1/3 bg-white/10 rounded"></div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative aspect-video bg-[#131314] rounded-lg border border-white/10 overflow-hidden cursor-pointer ring-1 ring-[#A8C7FA]/30">
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/20 to-red-900/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-medium">
                          Edit Canvas
                        </button>
                      </div>
                      {/* Fake thumbnail content */}
                      <div className="absolute top-4 right-4">
                        <div className="h-8 w-8 rounded-full bg-white/10"></div>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative aspect-video bg-[#131314] rounded-lg border border-white/10 overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-emerald-900/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-medium">
                          Edit Canvas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Canvas Editor Hint */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Type size={14} className="text-[#A8C7FA]" />
                    <span className="text-xs font-medium uppercase tracking-wider text-[#C4C7C5]">
                      Canvas Layer Controls
                    </span>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {[
                      "Headline Text",
                      "Background Image",
                      "Face Overlay",
                      "Glow Effect",
                    ].map((layer, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-2 bg-[#131314] border border-white/10 rounded text-xs text-[#C4C7C5] whitespace-nowrap"
                      >
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        {layer}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="max-w-[1200px] mx-auto px-6 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-white/5 bg-[#1E1F20] hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#131314] flex items-center justify-center mb-4 text-[#A8C7FA]">
              <Move3d size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#E3E3E3] mb-2">
              Face Consistency
            </h3>
            <p className="text-sm text-[#C4C7C5] leading-relaxed">
              Upload a reference photo once. The model locks onto facial
              features ensuring identity persistence across every generation.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/5 bg-[#1E1F20] hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#131314] flex items-center justify-center mb-4 text-[#A8C7FA]">
              <Layers size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#E3E3E3] mb-2">
              Layer-Based Editing
            </h3>
            <p className="text-sm text-[#C4C7C5] leading-relaxed">
              AI generations aren't flattened images. Edit text, swap
              backgrounds, and adjust lighting layers individually on the
              canvas.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/5 bg-[#1E1F20] hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#131314] flex items-center justify-center mb-4 text-[#A8C7FA]">
              <Command size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#E3E3E3] mb-2">
              Platform Native
            </h3>
            <p className="text-sm text-[#C4C7C5] leading-relaxed">
              Presets for YouTube, Instagram, and TikTok. Visual safe-zones
              ensure your text never gets cut off by platform UI elements.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#131314]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-sm text-[#C4C7C5] font-light">
            <a
              href="https://abhaybansal.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5"
            >
              abhaybansal.in
            </a>{" "}
            built by
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
