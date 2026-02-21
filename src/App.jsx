import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Hero from "./pages/HomePage";

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

  // Optional: prevent UI flicker
  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  // ❌ Not logged in → show Hero (with auth card)
  if (!user) {
    return <Hero />;
  }

  // ✅ Logged in → temporary dashboard
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        Logged in as {user.email}
      </h1>
    </div>
  );
}

export default App;