import AuthCard from "../components/AuthCard";
import HeroImg from "../assets/HeroImg.png";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-wide text-orange-500">
          ProMag
        </h1>
      </nav>

      {/* Hero Content */}
      <section className="relative z-20 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 gap-12">
        
        {/* Left */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-orange-500">
            Don’t just <br />
            manage tasks <span className="text-black">Deliver outcomes.</span>
          </h2>

          <p className="text-black text-lg leading-relaxed bg-[#7e6fff1c]">
            An AI-powered product and project assistant that plans, automates,
            and monitors the entire product lifecycle — from idea to deployment.
          </p>
        </div>

        {/* Right */}
        <div className="md:w-1/2 flex justify-center">
          <AuthCard />
        </div>
      </section>

      {/* Background Image (BELOW content) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-full flex justify-center pointer-events-none">
        <img
          src={HeroImg}
          alt="Integrations illustration"
          className="w-full max-w-5xl object-contain opacity-90"
        />
      </div>

    </div>
  );
}