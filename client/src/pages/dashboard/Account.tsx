import { useAppStore } from "../../store/useAppStore";
import {
  CreditCard,
  Clock,
  ShieldCheck,
  Zap,
  History,
  Download,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock history data structure
const HISTORY_ITEMS = [
  {
    id: "h1",
    title: "Gaming Reaction Thumbnail",
    date: "Feb 07, 2026",
    cost: 1,
    img: "https://placehold.co/100x60/3b82f6/white?text=Img1",
    prompt: "Shocked face...",
  },
  {
    id: "h2",
    title: "Tech Review Background",
    date: "Feb 06, 2026",
    cost: 1,
    img: "https://placehold.co/100x60/10b981/white?text=Img2",
    prompt: "Minimal desk...",
  },
  {
    id: "h3",
    title: "Podcast Cover Art",
    date: "Feb 05, 2026",
    cost: 1,
    img: "https://placehold.co/60x60/8b5cf6/white?text=Img3",
    prompt: "Dark moody...",
  },
];

export const Account = () => {
  const credits = useAppStore((state) => state.credits);
  const navigate = useNavigate();

  const handleReEdit = (item: (typeof HISTORY_ITEMS)[0]) => {
    // Navigate back to generator with the original prompt to allow re-editing
    navigate("/dashboard", { state: { prompt: item.prompt } });
  };

  return (
    <div className="h-full bg-[#131314] text-[#E3E3E3] overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto px-10 py-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-white mb-2">
            Account & Billing
          </h1>
          <p className="text-[#C4C7C5] text-sm">
            Manage your credits, subscription, and generation history.
          </p>
        </div>

        {/* --- Top Metrics Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#1E1F20] rounded-xl p-6 border border-white/10 h-[180px] overflow-hidden">
            <div className="flex items-center gap-3 text-[#C4C7C5] mb-4">
              <Zap size={18} className="text-[#A8C7FA]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Available Credits
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold text-white font-mono">
                {credits}
              </span>
              <span className="text-sm text-[#80868B] pb-1">credits</span>
            </div>
            <button className="mt-6 w-full py-2 bg-[#A8C7FA] hover:bg-white text-black text-xs font-bold rounded-lg transition-all">
              Add Credits
            </button>
          </div>

          <div className="bg-[#1E1F20] rounded-xl p-6 border border-white/10 h-45 overflow-hidden">
            <div className="flex items-center gap-3 text-[#C4C7C5] mb-4">
              <CreditCard size={18} className="text-[#A8C7FA]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Current Plan
              </span>
            </div>
            <div className="text-xl font-medium text-white mb-1">
              Professional
            </div>
            <p className="text-xs text-[#80868B]">Renews on March 01, 2026</p>
            <button className="mt-4 w-full py-2 bg-transparent border border-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/5 transition-all">
              Manage Subscription
            </button>
          </div>

          <div className="bg-[#1E1F20] rounded-xl p-6 border border-white/10 h-[180px] overflow-hidden">
            <div className="flex items-center gap-3 text-[#C4C7C5] mb-2">
              <ShieldCheck size={18} className="text-[#A8C7FA]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Security
              </span>
            </div>
            <p className="text-sm text-[#E3E3E3] mb-4">
              Managed via Google Auth
            </p>
            <p className="text-xs text-[#80868B]">abhay@example.com</p>
            <button className="mt-4 w-full py-2 bg-transparent border border-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/5 transition-all">
              Account Settings
            </button>
          </div>
        </div>

        {/* --- Usage History Section --- */}
        <div className="bg-[#1E1F20] rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-medium text-white flex items-center gap-2">
              <History size={18} className="text-[#A8C7FA]" /> Generation
              History
            </h3>
            <button className="text-xs text-[#A8C7FA] hover:text-white transition-colors flex items-center gap-1">
              Download CSV <Download size={12} />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {HISTORY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-10 bg-black rounded border border-white/10 overflow-hidden">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover"
                      alt="thumbnail"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#E3E3E3]">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-[#80868B] font-mono mt-0.5">
                      {item.date} • {item.prompt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#80868B]">
                    -{item.cost} Credit
                  </span>

                  {/* Action Group */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleReEdit(item)}
                      className="px-3 py-1.5 text-xs font-medium bg-[#A8C7FA] text-black rounded hover:bg-white transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} /> Re-Edit
                    </button>
                    <button className="p-1.5 text-[#C4C7C5] hover:bg-white/10 rounded">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 flex justify-center border-t border-white/5">
            <button className="text-xs text-[#80868B] hover:text-[#A8C7FA] flex items-center gap-1 transition-colors">
              View All History <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
