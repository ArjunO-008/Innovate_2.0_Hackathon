import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <nav className="
      flex items-center justify-between
      px-8 py-4
      bg-white
      text-orange-500
      shadow-[0_1px_0_rgba(0,0,0,0.06)]
    ">
      {/* Left */}
      <Link to="/dashboard" className="text-xl font-bold tracking-wide hover:opacity-80 transition">
        ProMag
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <img
              src={avatarUrl}
              alt="profile"
              className="w-9 h-9 rounded-full border border-orange-200 bg-white"
            />
            <span className="text-sm text-gray-500 hidden sm:block">
              {user.email.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-orange-500 hover:text-orange-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
