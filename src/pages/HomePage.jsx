import AuthCard from "../components/AuthCard";

export default function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide">
          PAIN
        </h1>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 gap-12">
        
        {/* Left Section */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Don’t just <br />
            manage tasks <span className="text-indigo-500">Deliver outcomes.</span>
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            An AI-powered product and project assistant that plans, automates,
            and monitors the entire product lifecycle — from idea to deployment.
          </p>
        </div>

        {/* Right Section - Auth Card */}
        <div className="md:w-1/2 flex justify-center">
          <AuthCard />
        </div>
      </section>
    </div>
  );
}