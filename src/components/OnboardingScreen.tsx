import { useState } from "react";
import { ADDICTION_CATEGORIES, type AddictionType } from "@/lib/freshstart-data";
import heroBg from "@/assets/hero-bg.jpg";

interface OnboardingScreenProps {
  onComplete: (name: string, addiction: AddictionType) => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<AddictionType | null>(null);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 gradient-calm" />

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        {step === 0 && (
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <h1 className="text-5xl font-serif text-foreground">
                Fresh<span className="text-primary">Start</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-sm mx-auto">
                Your journey to freedom begins with a single step. We're here to walk with you.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="What's your name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-center text-lg font-medium shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button
                onClick={() => name.trim() && setStep(1)}
                disabled={!name.trim()}
                className="w-full py-4 rounded-2xl gradient-hero text-primary-foreground font-semibold text-lg shadow-glow hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Begin Your Journey
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-foreground">
                Hi {name} 👋
              </h2>
              <p className="text-muted-foreground">
                What would you like to overcome?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ADDICTION_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selected === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelected(cat.id)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left space-y-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-lg">{cat.emoji}</span>
                    </div>
                    <span className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => selected && onComplete(name.trim(), selected)}
              disabled={!selected}
              className="w-full py-4 rounded-2xl gradient-hero text-primary-foreground font-semibold text-lg shadow-glow hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start My FreshStart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
