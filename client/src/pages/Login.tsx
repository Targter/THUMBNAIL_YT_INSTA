import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Using Magic Link (Passwordless) for simplicity
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Check your email for the magic link!");
    }
    setLoading(false);
  };

  // Dev shortcut: Anonymous login (if enabled in Supabase)
  const handleAnon = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) setMessage(error.message);
    else navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sign In to ThumbAI
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your email to receive a magic link
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded border border-blue-100">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={handleAnon}
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Skip (Guest Login)
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Requires "Enable Anonymous Sign-ins" in Supabase Auth Settings
          </p>
        </div>
      </div>
    </div>
  );
};
