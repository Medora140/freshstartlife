import { useState, useEffect, useCallback } from "react";
import { BREATHING_STEPS } from "@/lib/freshstart-data";
import { Shield, X } from "lucide-react";

interface UrgeTimerProps {
  onClose: () => void;
}

const UrgeTimer = ({ onClose }: UrgeTimerProps) => {
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [breathIndex, setBreathIndex] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);

  const totalSeconds = 120; // 2 minutes
  const currentBreath = BREATHING_STEPS[breathIndex];

  const startTimer = useCallback(() => {
    setActive(true);
    setElapsed(0);
    setBreathIndex(0);
    setBreathTimer(BREATHING_STEPS[0].duration);
  }, []);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= totalSeconds) {
          setActive(false);
          return totalSeconds;
        }
        return prev + 1;
      });

      setBreathTimer((prev) => {
        if (prev <= 1) {
          setBreathIndex((bi) => {
            const next = (bi + 1) % BREATHING_STEPS.length;
            setBreathTimer(BREATHING_STEPS[next].duration);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const progress = (elapsed / totalSeconds) * 100;
  const isComplete = elapsed >= totalSeconds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm p-8 space-y-6 animate-fade-up">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-serif text-foreground">Urge Support</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!active && !isComplete && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center mx-auto shadow-glow">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">Feeling an urge?</p>
              <p className="text-sm text-muted-foreground">
                That's okay. Urges usually pass within 2-5 minutes. Let's breathe through it together.
              </p>
            </div>
            <button
              onClick={startTimer}
              className="w-full py-4 rounded-2xl gradient-hero text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all"
            >
              Start Breathing Exercise
            </button>
          </div>
        )}

        {active && (
          <div className="text-center space-y-6">
            {/* Breathing circle */}
            <div className="relative w-40 h-40 mx-auto">
              <div
                className={`absolute inset-0 rounded-full border-4 border-primary/20 flex items-center justify-center ${
                  currentBreath.label === "Breathe In" || currentBreath.label === "Hold"
                    ? "animate-breathe"
                    : ""
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl font-serif text-primary">{breathTimer}</div>
                  <div className="text-sm font-semibold text-foreground">{currentBreath.label}</div>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">{currentBreath.instruction}</p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-hero transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.floor((totalSeconds - elapsed) / 60)}:{((totalSeconds - elapsed) % 60).toString().padStart(2, "0")} remaining
              </p>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="text-center space-y-4">
            <div className="text-5xl">🌟</div>
            <h4 className="text-xl font-serif text-foreground">You did it!</h4>
            <p className="text-sm text-muted-foreground">
              The urge has passed. You're stronger than you think. Every urge you overcome rewires your brain.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl gradient-hero text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Continue My Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrgeTimer;
