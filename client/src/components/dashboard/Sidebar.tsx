// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, Heart, User, Info } from "lucide-react";
// import clsx from "clsx";

// const navItems = [
//   { to: "/dashboard", label: "Generator", icon: LayoutDashboard, end: true },
//   { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
//   { to: "/dashboard/account", label: "Account", icon: User },
//   { to: "/dashboard/about", label: "About", icon: Info },
// ];

// export const Sidebar = () => {
//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex">
//       <div className="p-6 border-b border-gray-100">
//         <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
//           <span className="text-3xl">🎨</span> ThumbAI
//         </h1>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             end={item.end}
//             className={({ isActive }) =>
//               clsx(
//                 "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
//                 isActive
//                   ? "bg-blue-50 text-primary"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
//               )
//             }
//           >
//             <item.icon size={20} />
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-gray-100">
//         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
//           <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">
//             Pro Plan
//           </p>
//           <p className="text-sm mt-1">Unlock 4k Exports</p>
//         </div>
//       </div>
//     </aside>
//   );
// };

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  User,
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const navItems = [
  { to: "/dashboard", label: "Studio", icon: LayoutDashboard, end: true },
  { to: "/dashboard/favorites", label: "Saved Assets", icon: Heart },
  { to: "/dashboard/account", label: "Profile", icon: User },
  { to: "/dashboard/about", label: "Updates", icon: Info },
];

export const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) => {
  return (
    <motion.aside
      initial={false}
      // 260
      animate={{ width: isOpen ? 200 : 72 }}
      className="h-full bg-[#1E1F20] border-r border-white/10 flex flex-col shrink-0 z-50 relative"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#4285F4] to-[#9B72CB] rounded-lg flex items-center justify-center text-white shadow-lg">
            <Sparkles size={18} fill="white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-lg tracking-tight text-[#E3E3E3]">
                  ThumbAI
                </span>
                <span className="text-[10px] text-[#A8C7FA] uppercase tracking-wider font-medium">
                  Enterprise
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={`${item.label}`}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                isActive
                  ? "bg-[#A8C7FA]/10 text-[#A8C7FA]"
                  : "text-[#C4C7C5] hover:bg-white/5 hover:text-[#E3E3E3]",
              )
            }
          >
            <item.icon size={20} className="shrink-0" />

            {/* Label Animation */}
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-14 bg-[#2D2E30] text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Plan Info */}
      <div className="p-3 border-t border-white/5 overflow-hidden">
        <div
          className={clsx(
            "bg-gradient-to-br from-[#1E1F20] to-black border border-white/10 rounded-xl transition-all relative overflow-hidden group",
            isOpen ? "p-4" : "p-2 items-center flex flex-col justify-center",
          )}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#A8C7FA] rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

          <div className="flex items-center gap-3 mb-2 justify-center">
            <div className="p-1.5 bg-[#A8C7FA]/20 rounded-md text-[#A8C7FA]">
              <Zap size={16} fill="currentColor" />
            </div>
            {isOpen && (
              <span className="text-sm font-bold text-white">Pro Plan</span>
            )}
          </div>

          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-[11px] text-[#C4C7C5] mb-3">
                Unlock 4k exports and unlimited cloud storage.
              </p>
              <button className="w-full py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-[#A8C7FA] transition-colors">
                Upgrade
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button (Floating) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-[#1E1F20] border border-white/10 rounded-full p-1 text-[#C4C7C5] hover:text-white hover:bg-[#2D2E30] transition-colors z-50 shadow-lg"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </motion.aside>
  );
};
