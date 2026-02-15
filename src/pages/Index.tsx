import { useState } from "react";
import { ADDICTION_CATEGORIES, type UserData, type AddictionType } from "@/lib/freshstart-data";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import OnboardingScreen from "@/components/OnboardingScreen";
import StreakTracker from "@/components/StreakTracker";
import UrgeTimer from "@/components/UrgeTimer";
import DailyCheckin from "@/components/DailyCheckin";
import MotivationFeed from "@/components/MotivationFeed";
import ReplacementHabits from "@/components/ReplacementHabits";
import { Shield, RotateCcw, Leaf } from "lucide-react";

const Index = () => {
  const [userData, setUserData] = useLocalStorage<UserData | null>("freshstart-user", null);
  const [showUrgeTimer, setShowUrgeTimer] = useState(false);

  const handleOnboardingComplete = (name: string, addiction: AddictionType) => {
    setUserData({
      name,
      addiction,
      startDate: new Date().toISOString(),
      checkins: [],
    });
  };

  const handleCheckin = (clean: boolean, mood: number) => {
    if (!userData) return;
    const today = new Date().toISOString().split("T")[0];
    setUserData({
      ...userData,
      checkins: [...userData.checkins, { date: today, clean, mood }],
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure? This will reset all your progress.")) {
      setUserData(null);
    }
  };

  if (!userData) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const category = ADDICTION_CATEGORIES.find((c) => c.id === userData.addiction)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl text-foreground">
              Fresh<span className="text-primary">Start</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {category.emoji} {userData.name}
            </span>
            <button
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-32">
        <StreakTracker userData={userData} />
        <DailyCheckin userData={userData} onCheckin={handleCheckin} />
        <ReplacementHabits addiction={userData.addiction} />
        <MotivationFeed />
      </main>

      {/* Urge button - floating */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowUrgeTimer(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-full gradient-hero text-primary-foreground font-semibold text-lg shadow-glow hover:opacity-90 transition-all animate-pulse-soft"
        >
          <Shield className="w-5 h-5" />
          I'm Having an Urge
        </button>
      </div>

      {showUrgeTimer && <UrgeTimer onClose={() => setShowUrgeTimer(false)} />}
    </div>
  );
};

export default Index;
