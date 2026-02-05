import { NavLink } from "react-router-dom";
import { LayoutDashboard, Heart, User, Info } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { to: "/dashboard", label: "Generator", icon: LayoutDashboard, end: true },
  { to: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { to: "/dashboard/account", label: "Account", icon: User },
  { to: "/dashboard/about", label: "About", icon: Info },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-3xl">🎨</span> ThumbAI
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                isActive
                  ? "bg-blue-50 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg text-white">
          <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">
            Pro Plan
          </p>
          <p className="text-sm mt-1">Unlock 4k Exports</p>
        </div>
      </div>
    </aside>
  );
};
