import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}

const EMOJIS = ["✨", "🎉", "⭐", "🌟", "💫", "🎊", "🌈", "💛"];

interface TreeCelebrationProps {
  show: boolean;
  treeName: string;
  treeEmoji: string;
  newStage: number;
  onComplete: () => void;
}

const TreeCelebration = ({ show, treeName, treeEmoji, newStage, onComplete }: TreeCelebrationProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);

    const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1.5,
      size: 14 + Math.random() * 18,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-confetti-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Center celebration card */}
      <div className="animate-scale-in bg-card border border-border rounded-2xl shadow-glow p-6 text-center space-y-3 pointer-events-auto max-w-xs mx-4">
        <div className="text-6xl animate-bounce-once">{treeEmoji}</div>
        <h3 className="font-serif text-xl text-foreground">Level Up!</h3>
        <p className="text-sm text-muted-foreground">
          Your <span className="font-semibold text-foreground">{treeName}</span> grew to stage {newStage}!
        </p>
        <div className="flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i <= newStage ? "bg-primary scale-110" : "bg-border"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreeCelebration;
