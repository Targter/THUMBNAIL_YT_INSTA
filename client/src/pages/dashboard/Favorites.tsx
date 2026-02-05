import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/client";
import type { Favorite } from "../../types";
import { Trash2, Copy, Loader2 } from "lucide-react";

// Mock data fetcher (replace with real API call later)
const fetchFavorites = async () => {
  // const res = await apiClient.get<Favorite[]>('/favorites');
  // return res.data;

  // Returning mock data for UI development
  return new Promise<Favorite[]>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            id: "1",
            imageUrl:
              "https://placehold.co/600x400/2563eb/white?text=Cyberpunk",
            prompt: "Cyberpunk city neon",
          },
          {
            id: "2",
            imageUrl:
              "https://placehold.co/600x400/dc2626/white?text=YouTube+Thumbnail",
            prompt: "Surprised face reaction",
          },
          {
            id: "3",
            imageUrl: "https://placehold.co/600x400/16a34a/white?text=Nature",
            prompt: "Forest peaceful morning",
          },
        ]),
      1000,
    );
  });
};

export const Favorites = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  const handleUseStyle = (fav: Favorite) => {
    // Navigate to generator with prompt pre-filled
    navigate("/dashboard", { state: { prompt: fav.prompt, styleId: fav.id } });
  };

  if (isLoading)
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  if (isError)
    return <div className="p-12 text-red-500">Failed to load favorites.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Favorites</h1>
        <span className="text-gray-500">{data?.length || 0} items saved</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.map((fav) => (
          <div
            key={fav.id}
            className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img
                src={fav.imageUrl}
                alt={fav.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleUseStyle(fav)}
                  className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-blue-50"
                >
                  <Copy size={14} /> Reuse Style
                </button>
              </div>
            </div>

            <div className="p-4">
              <p
                className="text-sm text-gray-600 line-clamp-2"
                title={fav.prompt}
              >
                {fav.prompt}
              </p>
              <div className="mt-3 flex justify-end">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
