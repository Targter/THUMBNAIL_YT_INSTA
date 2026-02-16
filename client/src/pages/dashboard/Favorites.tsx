import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Copy,
  Loader2,
  Search,
  Grid3X3,
  List as ListIcon,
  Calendar,
  Youtube,
  Instagram,
  Upload,
  Plus,
  Image as ImageIcon,
  AlertCircle,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { getFavorites, deleteFavorite, uploadFavorite } from "../../api/client";

// --- Types ---
interface Favorite {
  id: string;
  image_path: string; // Changed from image_url to match DB
  image_url: any; // The usable URL
  prompt?: string;
  platform?: string;
  created_at: string;
  is_uploaded: boolean;
}

export const Favorites = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- DATA FETCHING ---
  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const data = await getFavorites();
      const mappedData = Array.isArray(data)
        ? data.map((item: any) => ({
            ...item,
            image_url: item.image_url || item.image_path,
          }))
        : [];
      setFavorites(mappedData);
      console.log("data::", data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load assets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // --- ACTIONS ---

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadFavorite(file);
      await fetchFavorites(); // Refresh list
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this asset permanently?")) return;

    setDeletingId(id);
    try {
      await deleteFavorite(id);
      // Optimistic update
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUseStyle = (fav: Favorite) => {
    // Navigate to Generator with this image as Style Reference
    navigate("/dashboard", {
      state: {
        styleId: fav.id,
        styleUrl: fav.image_url, // Pass URL for immediate preview
        prompt: fav.prompt || "", // Pre-fill prompt if available
      },
    });
  };

  const copyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      alert("Prompt copied!");
    }
  };

  // --- FILTERING ---
  const filteredData = favorites.filter((item) => {
    const term = searchQuery.toLowerCase();
    const promptMatch = (item.prompt || "").toLowerCase().includes(term);
    const typeMatch = item.is_uploaded
      ? "upload".includes(term)
      : "generated".includes(term);
    return promptMatch || typeMatch;
  });

  return (
    <div className="h-full flex flex-col bg-[#131314] text-[#E3E3E3] font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />

      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 border-b border-white/10 shrink-0 bg-[#131314] z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white mb-1">
              Asset Library
            </h1>
            <p className="text-xs text-[#80868B]">
              Your saved styles, uploads, and generation history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-[#1E1F20] hover:bg-white/5 border border-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 text-white disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Upload Reference
            </button>

            <Link to="/dashboard">
              <button className="px-4 py-2 bg-[#A8C7FA] hover:bg-[#D3E3FD] text-[#040404] rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(168,199,250,0.1)]">
                <Plus size={14} />
                New Design
              </button>
            </Link>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#80868B] group-focus-within:text-[#A8C7FA] transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1F20] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-[#E3E3E3] placeholder:text-white/20 focus:outline-none focus:border-[#A8C7FA] transition-all"
            />
          </div>

          <div className="flex bg-[#1E1F20] rounded-lg border border-white/10 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={clsx(
                "p-1.5 rounded transition-all",
                viewMode === "grid"
                  ? "bg-white/10 text-white"
                  : "text-[#80868B] hover:text-white",
              )}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={clsx(
                "p-1.5 rounded transition-all",
                viewMode === "list"
                  ? "bg-white/10 text-white"
                  : "text-[#80868B] hover:text-white",
              )}
            >
              <ListIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
        {/* 1. LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-[#1E1F20] rounded-xl border border-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center h-64 text-[#80868B]">
            <AlertCircle size={32} className="mb-3 text-red-400" />
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={fetchFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E1F20] border border-white/10 rounded-lg text-xs hover:text-white transition-colors"
            >
              <RefreshCcw size={12} /> Try Again
            </button>
          </div>
        )}

        {/* 3. EMPTY STATE */}
        {!isLoading && !error && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-[#80868B] opacity-70">
            <ImageIcon size={48} className="mb-4 text-[#1E1F20]" />
            <p className="text-sm">No assets found.</p>
          </div>
        )}

        {/* 4. DATA GRID */}
        {!isLoading && !error && filteredData.length > 0 && (
          <div
            className={clsx(
              "grid gap-6 pb-20",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                : "grid-cols-1",
            )}
          >
            {filteredData.map((fav) => (
              <div
                key={fav.id}
                className={clsx(
                  "group relative bg-[#1E1F20] border border-white/10 rounded-xl overflow-hidden hover:border-[#A8C7FA]/50 transition-all duration-300 hover:shadow-lg",
                  viewMode === "list" && "flex items-center gap-4 p-3 h-24",
                )}
              >
                {/* IMAGE AREA */}
                <div
                  className={clsx(
                    "relative overflow-hidden bg-black/50",
                    viewMode === "grid"
                      ? "aspect-video w-full"
                      : "w-32 h-full rounded-lg shrink-0",
                  )}
                >
                  <img
                    src={fav.image_url}
                    alt={fav.prompt || "Asset"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* OVERLAY (Grid Only) */}
                  {viewMode === "grid" && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => handleUseStyle(fav)}
                        className="bg-[#A8C7FA] text-black px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-white hover:scale-105 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-300"
                      >
                        <Sparkles size={12} /> Use Style
                      </button>
                      <div className="flex gap-2 transform translate-y-2 group-hover:translate-y-0 duration-300 delay-75">
                        {fav.prompt && (
                          <button
                            onClick={(e) => copyPrompt(fav.prompt!, e)}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm"
                            title="Copy Prompt"
                          >
                            <Copy size={12} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(fav.id, e)}
                          className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm"
                          title="Delete"
                        >
                          {deletingId === fav.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BADGES */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {fav.is_uploaded && (
                      <div className="px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-medium text-blue-400 border border-white/5 flex items-center gap-1">
                        <Upload size={8} /> Upload
                      </div>
                    )}
                    {!fav.is_uploaded && fav.platform && (
                      <div className="px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-medium text-white border border-white/5 flex items-center gap-1">
                        {fav.platform === "youtube" ? (
                          <Youtube size={8} className="text-red-500" />
                        ) : (
                          <Instagram size={8} className="text-pink-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* INFO AREA */}
                <div
                  className={clsx(
                    "flex flex-col justify-between",
                    viewMode === "grid" ? "p-3" : "flex-1 pr-2 py-1",
                  )}
                >
                  <div>
                    <p
                      className="text-xs text-[#E3E3E3] font-medium line-clamp-2 leading-relaxed mb-1"
                      title={fav.prompt || "Uploaded Image"}
                    >
                      {fav.prompt || "User Upload"}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#80868B]">
                      <Calendar size={10} />
                      <span>
                        {new Date(fav.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* LIST VIEW ACTIONS */}
                  {viewMode === "list" && (
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => handleUseStyle(fav)}
                        className="text-[#A8C7FA] text-[10px] font-medium hover:underline flex items-center gap-1"
                      >
                        <Sparkles size={10} /> Use Style
                      </button>
                      <button
                        onClick={(e) => handleDelete(fav.id, e)}
                        className="text-[#80868B] hover:text-red-500 flex items-center gap-1 text-[10px]"
                      >
                        {deletingId === fav.id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Trash2 size={10} />
                        )}{" "}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
