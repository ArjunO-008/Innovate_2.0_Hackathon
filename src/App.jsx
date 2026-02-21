import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Hero from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 NEW: app view control
  const [view, setView] = useState("dashboard");
  // views: dashboard | create-project

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (!user) {
    return <Hero />;
  }

  // 🔹 Switch between dashboard & create project
  if (view === "create-project") {
    return <CreateProject onBack={() => setView("dashboard")} />;
  }

  return (
    <Dashboard
      user={user}
      onCreateProject={() => setView("create-project")}
    />
  );
}

export default App;