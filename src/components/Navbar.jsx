import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Navbar({ user }) {
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`;

  return (
    <nav className="
      flex items-center justify-between
      px-8 py-4
      bg-white
      text-orange-500
      shadow-[0_1px_0_rgba(0,0,0,0.06)]
    ">
      
      {/* Left */}
      <h1 className="text-xl font-bold tracking-wide">
        Projects
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt="profile"
          className="
            w-9 h-9 rounded-full
            border border-orange-200
            bg-white
          "
        />

        <button
          onClick={() => signOut(auth)}
          className="
            text-sm font-medium
            text-orange-500
            hover:text-orange-600
            transition
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
}