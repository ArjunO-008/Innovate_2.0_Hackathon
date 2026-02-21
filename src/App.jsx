import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Hero from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ❌ Not logged in
  if (!user) {
    return <Hero />;
  }

  // ✅ Logged in → Projects dashboard
  return <Dashboard user={user} />;
}

export default App;