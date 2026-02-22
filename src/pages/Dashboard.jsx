import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

// Temporary mock projects — replace with real Firestore fetch later
const MOCK_PROJECTS = [
  { id: 1, name: "AI Notepad" },
  { id: 2, name: "TalkBoard" },
  { id: 3, name: "Travaloo" },
];

export default function Dashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const username  = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="min-h-screen bg-white text-[#0f172a]">
      <Navbar />

      <main className="relative flex flex-col items-center px-6 py-12">

        {/* Greeting */}
        <h2 className="text-2xl font-semibold mb-10">
          Hi!{" "}
          <span className="text-[#1e3a8a] font-bold">{username}</span>{" "}
          👋
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {MOCK_PROJECTS.map((project) => (
            <Link
              key={project.id}
              to={`/project/${encodeURIComponent(project.name)}`}
              className="
                bg-white border border-gray-200
                rounded-xl p-6 shadow-sm
                hover:shadow-md hover:-translate-y-0.5
                transition-all cursor-pointer
              "
            >
              <h3 className="text-lg font-semibold text-[#0f172a]">
                {project.name}
              </h3>
              <p className="text-sm text-[#475569] mt-2">
                Click to open project
              </p>
            </Link>
          ))}
        </div>

        {/* Floating Create Project Button */}
        <button
          onClick={() => navigate("/create-project")}
          className="
            fixed bottom-8 right-8
            flex items-center gap-2
            px-6 py-3 rounded-full
            bg-orange-500 text-white font-semibold
            shadow-[0_15px_40px_rgba(249,115,22,0.45)]
            hover:bg-orange-600
            hover:shadow-[0_20px_60px_rgba(249,115,22,0.6)]
            transition-all
          "
        >
          <span className="text-xl">➕</span>
          Create Project
        </button>
      </main>
    </div>
  );
}
