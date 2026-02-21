import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Navbar({ user }) {
  // Generate avatar using email (DiceBear)
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`;

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-black text-white">
      
      {/* Left: App Name / Section */}
      <h1 className="text-xl font-bold tracking-wide">
        Projects
      </h1>

      {/* Right: Profile + Logout */}
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt="profile"
          className="w-9 h-9 rounded-full border border-gray-700"
        />

        <button
          onClick={() => signOut(auth)}
          className="text-sm text-gray-300 hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}