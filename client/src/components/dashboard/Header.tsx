// import { useAppStore } from "../../store/useAppStore";
import { useAppStore } from "../../store/useAppstore";
import { Coins, Bell } from "lucide-react";

export const Header = () => {
  // We'll hook this up to the store we defined in the previous step
  const credits = useAppStore((state) => state.credits);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="md:hidden">
        {/* Mobile Menu Button Placeholder */}
        <span className="font-bold text-lg">ThumbAI</span>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
          <Coins size={16} className="text-yellow-600" />
          <span className="font-bold text-gray-700">{credits} Credits</span>
        </div>

        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
};
