import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebase";

export default function AuthCard() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError]     = useState("");

  const handleAuth = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Navigation is handled automatically by PublicRoute redirecting
      // authenticated users to /dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="
      w-full max-w-sm
      rounded-2xl p-6
      bg-white/5 backdrop-blur-2xl
      border border-white/20
      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
      relative
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
    ">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-6 text-orange-500 text-center">
          {isLogin ? "Welcome back" : "Create your account"}
        </h3>

        <input
          type="email"
          placeholder="Email"
          className="
            w-full mb-3 px-4 py-2.5 rounded-lg
            bg-white/10 text-black placeholder-gray-600
            border border-white/20
            focus:outline-none focus:ring-2 focus:ring-orange-400/70
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full mb-4 px-4 py-2.5 rounded-lg
            bg-white/10 text-black placeholder-gray-600
            border border-white/20
            focus:outline-none focus:ring-2 focus:ring-orange-400/70
          "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          onClick={handleAuth}
          className="
            w-full py-2.5 rounded-lg font-semibold text-white
            bg-orange-500 hover:bg-orange-600
            shadow-[0_8px_30px_rgba(249,115,22,0.45)]
            transition-all duration-200
            hover:shadow-[0_12px_40px_rgba(249,115,22,0.6)]
          "
        >
          {isLogin ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-5 text-sm text-center text-gray-700 cursor-pointer hover:text-orange-500 transition"
        >
          {isLogin ? "No account? Create one" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
