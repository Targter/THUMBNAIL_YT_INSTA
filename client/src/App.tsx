import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Generator } from "./pages/dashboard/Generator";
import { Favorites } from "./pages/dashboard/Favorites"; // Import
import { Account } from "./pages/dashboard/Account"; // Import
// import { Landing } from "./pages/Landing"; // Ensure this exists or use placeholder
import { Landing } from "./pages/Landing";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Generator />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="account" element={<Account />} />
            <Route
              path="about"
              element={
                <div className="p-8 text-center text-gray-500">
                  About Page - Static Content
                </div>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
