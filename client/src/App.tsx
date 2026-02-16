import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Generator } from "./pages/dashboard/Generator";
import { supabase } from "./lib/supabase";
import { Login } from "./pages/Login";
import { Favorites } from "./pages/dashboard/Favorites"; // Import
import { Account } from "./pages/dashboard/Account"; // Import
// import { Landing } from "./pages/Landing"; // Ensure this exists or use placeholder
import LandingPage from "./pages/Landing";
import { useEffect, useState, type JSX } from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!session) return <Navigate to="/login" replace />;

  return children;
};

//

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
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
