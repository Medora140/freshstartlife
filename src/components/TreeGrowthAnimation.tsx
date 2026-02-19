import { useState, useEffect } from "react";

const DEFAULT_STAGES = ["🌰", "🌱", "🪴", "🌿", "🌳"];
const STAGE_LABELS = ["Seed", "Sprout", "Sapling", "Growing", "Tree"];
const STAGE_SCALES = ["scale-75", "scale-90", "scale-100", "scale-110", "scale-125"];

interface TreeGrowthAnimationProps {
  /** Custom emoji stages from the user's tree type */
  stages?: string[];
  onComplete?: () => void;
}

const TreeGrowthAnimation = ({ stages, onComplete }: TreeGrowthAnimationProps) => {
  const emojis = stages && stages.length === 5 ? stages : DEFAULT_STAGES;
  const [currentStage, setCurrentStage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (currentStage >= emojis.length - 1) {
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
  }, [currentStage, onComplete, emojis.length]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative h-28 w-28 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-primary/10 transition-all duration-700"
          style={{
            transform: `scale(${0.6 + currentStage * 0.15})`,
            opacity: 0.3 + currentStage * 0.15,
          }}
        />
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
        <span
          className={`text-7xl relative z-10 transition-all duration-500 ease-out ${STAGE_SCALES[currentStage] || "scale-100"} ${
            transitioning ? "opacity-0 blur-sm scale-50" : "opacity-100 blur-0"
          }`}
        >
          {emojis[currentStage]}
        </span>
      </div>

      <p
        className={`text-sm font-semibold text-primary transition-all duration-300 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {STAGE_LABELS[currentStage] || ""}
      </p>

      <div className="flex gap-2">
        {emojis.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-500 ${
              i <= currentStage ? "bg-primary w-4" : "bg-border w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeGrowthAnimation;
