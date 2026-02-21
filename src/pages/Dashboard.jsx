import Navbar from "../components/Navbar";

export default function Dashboard({ user }) {
  const username = user.email.split("@")[0];

  // Temporary mock projects
  const projects = [
    { id: 1, name: "AI Notepad" },
    { id: 2, name: "TalkBoard" },
    { id: 3, name: "Travaloo" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar user={user} />

      <main className="flex flex-col items-center px-6 py-12">
        
        {/* Greeting */}
        <h2 className="text-2xl font-semibold mb-10">
          Hi! <span className="text-indigo-500">{username}</span> 👋
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          
          {/* Existing Projects */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6
                         hover:border-indigo-500 transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold">
                {project.name}
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Click to open project
              </p>
            </div>
          ))}

          {/* Create New Project */}
          <div
            className="flex flex-col items-center justify-center
                       bg-gray-900 border border-dashed border-gray-700
                       rounded-xl p-6 hover:border-indigo-500 transition
                       cursor-pointer"
          >
            <span className="text-3xl mb-2">➕</span>
            <p className="text-gray-400 font-medium">
              Create New Project
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}