// import { useAppStore } from "../../store/useAppStore";
import { useAppStore } from "../../store/useAppstore";
import { CreditCard, Clock, ShieldCheck } from "lucide-react";

export const Account = () => {
  const credits = useAppStore((state) => state.credits);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Account & Billing
      </h1>

      {/* Credit Status Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-10 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 font-medium mb-1">Available Balance</p>
            <h2 className="text-5xl font-bold">
              {credits}{" "}
              <span className="text-2xl font-normal opacity-80">Credits</span>
            </h2>
          </div>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors">
            Top Up
          </button>
        </div>
        <p className="mt-6 text-sm opacity-70 flex items-center gap-2">
          <ShieldCheck size={16} /> Secure payment via Stripe
        </p>
      </div>

      {/* Usage History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-gray-500" /> Usage History
          </h3>
          <button className="text-sm text-blue-600 hover:underline">
            Download Invoice
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  🎨
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Thumbnail Generation
                  </p>
                  <p className="text-xs text-gray-500">
                    Feb {10 - i}, 2026 • 2:3{i} PM
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                -1 Credit
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
