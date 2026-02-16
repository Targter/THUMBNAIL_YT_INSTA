// // import { useAppStore } from "../../store/useAppStore";
// // import { useAppStore } from "../../store/useAppstore";
// import { useAppStore } from "../../store/useAppStore";
// import { Coins, Bell } from "lucide-react";

// export const Header = () => {
//   // We'll hook this up to the store we defined in the previous step
//   const credits = useAppStore((state) => state.credits);

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
//       <div className="md:hidden">
//         {/* Mobile Menu Button Placeholder */}
//         <span className="font-bold text-lg">ThumbAI</span>
//       </div>

//       <div className="ml-auto flex items-center gap-6">
//         <button className="text-gray-500 hover:text-gray-700 relative">
//           <Bell size={20} />
//           <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
//           <Coins size={16} className="text-yellow-600" />
//           <span className="font-bold text-gray-700">{credits} Credits</span>
//         </div>

//         <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
//           U
//         </div>
//       </div>
//     </header>
//   );
// };

import { useAppStore } from "../../store/useAppStore";
import { Bell, Menu, Search, CreditCard } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const credits = useAppStore((state) => state.credits);

  return (
    <header className="h-16 bg-[#131314] border-b border-white/10 flex items-center justify-between shrink-0 z-40">
      {/* Header */}
      <div className="h-16 w-[300px] px-6 border-b border-white/10 flex items-center justify-between shrink-0 ">
        <div className="flex items-center gap-3">
          {/* <div className="w-6 h-6 bg-gradient-to-tr from-[#4285F4] to-[#9B72CB] rounded text-[10px] flex items-center justify-center font-bold text-white shadow-lg">
            AI
          </div> */}
          <span className="font-medium tracking-tight text-white truncate">
            Creator Studio
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-[#C4C7C5] font-mono flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${credits > 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
          ></div>
          {credits}
        </div>
      </div>
      {/* Left: Mobile Toggle & Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-[#C4C7C5] hover:bg-white/5 rounded-lg transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Global Search (Optional visual flair) */}
        <div className="hidden md:flex items-center gap-2 bg-[#1E1F20] border border-white/10 rounded-full px-4 py-1.5 w-64 focus-within:border-[#A8C7FA] focus-within:ring-1 focus-within:ring-[#A8C7FA]/20 transition-all">
          <Search size={14} className="text-[#C4C7C5]" />
          <input
            type="text"
            placeholder="Search projects..."
            className="bg-transparent border-none outline-none text-sm text-[#E3E3E3] placeholder:text-white/20 w-full"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        {/* Credits Pill */}
        <div className="flex items-center gap-3 bg-[#1E1F20] pl-3 pr-1 py-1 rounded-full border border-white/10">
          <span className="text-xs font-medium text-[#C4C7C5]">
            Available Credits
          </span>
          <div className="flex items-center gap-1.5 bg-[#131314] px-2 py-1 rounded-full border border-white/5">
            <div
              className={`w-2 h-2 rounded-full ${credits > 0 ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-red-500"}`}
            ></div>
            <span className="text-xs font-bold text-white mono">{credits}</span>
          </div>
          <button className="p-1.5 bg-[#A8C7FA] rounded-full text-black hover:bg-white transition-colors">
            <CreditCard size={12} />
          </button>
        </div>

        <div className="h-6 w-px bg-white/10"></div>

        <button className="text-[#C4C7C5] hover:text-white relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#131314]"></span>
        </button>

        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border border-white/20 shadow-lg"></button>
      </div>
    </header>
  );
};
