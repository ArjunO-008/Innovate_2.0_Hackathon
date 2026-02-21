import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebase";

export default function AuthCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm">
      <h3 className="text-xl font-semibold mb-4">
        {isLogin ? "Login" : "Create account"}
      </h3>

      <input
        type="email"
        placeholder="Email"
        className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-3 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full bg-black border border-gray-700 rounded px-3 py-2 mb-3 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <button
        onClick={handleAuth}
        className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-medium"
      >
        {isLogin ? "Login" : "Sign up"}
      </button>

      <p
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-gray-400 mt-4 cursor-pointer hover:text-white"
      >
        {isLogin
          ? "No account? Create one"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}