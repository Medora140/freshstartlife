import { useState, useEffect } from "react";

const STAGES = [
  { emoji: "🌰", label: "Seed", scale: "scale-75" },
  { emoji: "🌱", label: "Sprout", scale: "scale-90" },
  { emoji: "🪴", label: "Sapling", scale: "scale-100" },
  { emoji: "🌿", label: "Growing", scale: "scale-110" },
  { emoji: "🌳", label: "Tree", scale: "scale-125" },
];

interface TreeGrowthAnimationProps {
  onComplete?: () => void;
}

const TreeGrowthAnimation = ({ onComplete }: TreeGrowthAnimationProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (currentStage >= STAGES.length - 1) {
      const timer = setTimeout(() => onComplete?.(), 1200);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentStage((s) => s + 1);
        setTransitioning(false);
      }, 300);
    }, 900);

    return () => clearTimeout(timer);
  }, [currentStage, onComplete]);

  const stage = STAGES[currentStage];

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Tree emoji with morph animation */}
      <div className="relative h-28 w-28 flex items-center justify-center">
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full bg-primary/10 transition-all duration-700"
          style={{
            transform: `scale(${0.6 + currentStage * 0.15})`,
            opacity: 0.3 + currentStage * 0.15,
          }}
        />
        {/* Sparkle particles */}
        {currentStage > 0 && !transitioning && (
          <>
            {[...Array(3)].map((_, i) => (
              <span
                key={`${currentStage}-${i}`}
                className="absolute text-sm animate-confetti-particle pointer-events-none"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.2s",
                }}
              >
                ✨
              </span>
            ))}
          </>
        )}
        {/* Main emoji */}
        <span
          className={`text-7xl relative z-10 transition-all duration-500 ease-out ${stage.scale} ${
            transitioning ? "opacity-0 blur-sm scale-50" : "opacity-100 blur-0"
          }`}
        >
          {stage.emoji}
        </span>
      </div>

      {/* Stage label */}
      <p
        className={`text-sm font-semibold text-primary transition-all duration-300 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {stage.label}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i <= currentStage
                ? "bg-primary w-4"
                : "bg-border w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeGrowthAnimation;
