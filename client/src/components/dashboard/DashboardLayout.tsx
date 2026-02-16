// import { Outlet } from "react-router-dom";
// import { Sidebar } from "./Sidebar";
// import { Header } from "./Header";

// export const DashboardLayout = () => {
//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-50">
//       {/* <Sidebar /> */}

//       <div className="flex-1 flex flex-col h-full overflow-hidden">
//         {/* <Header /> */}

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-auto p-0">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MotionConfig } from "framer-motion";

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // MotionConfig ensures all layout animations share the same spring physics
    <MotionConfig transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <div className="flex h-screen w-screen overflow-hidden bg-[#131314] text-[#E3E3E3]">
        {/* Sidebar - Collapsible */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#131314]">
          <Header
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* 
            CRITICAL: 
            flex-1 and overflow-hidden here ensure the 'Outlet' (your Generator) 
            is contained strictly within the remaining height.
            The Generator will handle its own internal scrolling.
          */}
          <main className="flex-1 overflow-hidden relative">
            <Outlet />
          </main>
        </div>
      </div>
    </MotionConfig>
  );
};
