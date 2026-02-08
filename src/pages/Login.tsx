import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await login(username, password);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">
      <div className="w-full max-w-md bg-[#111] border border-white/5 rounded-2xl shadow-2xl p-8 mx-4">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <p className="text-slate-500 mt-2">Enter credentials to access admin</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500" 
            />
            <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-200 outline-none active:scale-[0.98]"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}