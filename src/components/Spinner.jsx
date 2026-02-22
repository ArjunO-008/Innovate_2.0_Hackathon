import { useEffect, useState } from "react";

export default function Spinner() {
  const steps = [
    "Analyzing problem statement…",
    "Understanding purpose…",
    "Defining expected output…",
    "Identifying target audience…",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= steps.length - 1) return;

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 1200); // change speed if needed

    return () => clearTimeout(timer);
  }, [index, steps.length]);

  return (
    <div className="flex flex-col items-center gap-4 py-10 bg-white">
      {/* Spinner */}
      <div
        className="
          w-10 h-10
          border-4 border-orange-200
          border-t-orange-500
          rounded-full
          animate-spin
        "
      />

      {/* Dynamic Text */}
      <p className="text-orange-600 text-sm font-medium transition-all">
        {steps[index]}
      </p>
    </div>
  );
}