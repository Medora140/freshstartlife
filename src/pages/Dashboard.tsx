import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ADDICTION_CATEGORIES, type AddictionType, type UserData } from "@/lib/freshstart-data";
import OnboardingScreen from "@/components/OnboardingScreen";
import StreakTracker from "@/components/StreakTracker";
import UrgeTimer from "@/components/UrgeTimer";
import DailyCheckin from "@/components/DailyCheckin";
import MotivationFeed from "@/components/MotivationFeed";
import ReplacementHabits from "@/components/ReplacementHabits";
import { Shield, LogOut, Leaf } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUrgeTimer, setShowUrgeTimer] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", user.id)
      .single();

    // Load active addiction
    const { data: addiction } = await supabase
      .from("user_addictions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!addiction) {
      setUserData(null);
      setLoading(false);
      return;
    }

    // Load checkins
    const { data: checkins } = await supabase
      .from("checkins")
      .select("date, clean, mood")
      .eq("addiction_id", addiction.id)
      .order("date", { ascending: false });

    setUserData({
      name: profile?.name || "",
      addiction: addiction.addiction_type as AddictionType,
      startDate: addiction.start_date,
      checkins: (checkins || []).map((c: any) => ({
        date: c.date,
        clean: c.clean,
        mood: c.mood,
      })),
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleOnboardingComplete = async (name: string, addiction: AddictionType) => {
    if (!user) return;

    // Update profile name
    await supabase.from("profiles").update({ name }).eq("user_id", user.id);

    // Create addiction record
    await supabase.from("user_addictions").insert({
      user_id: user.id,
      addiction_type: addiction,
      start_date: new Date().toISOString(),
    });

    await loadUserData();
  };

  const handleCheckin = async (clean: boolean, mood: number) => {
    if (!user) return;

    // Get active addiction id
    const { data: addiction } = await supabase
      .from("user_addictions")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!addiction) return;

    await supabase.from("checkins").insert({
      user_id: user.id,
      addiction_id: addiction.id,
      date: new Date().toISOString().split("T")[0],
      clean,
      mood,
    });

    await loadUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-primary">
          <Leaf className="w-12 h-12" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
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
              {ADDICTION_CATEGORIES.find((c) => c.id === userData.addiction)?.emoji} {userData.name}
            </span>
            <button
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-32">
        <StreakTracker userData={userData} />
        <DailyCheckin userData={userData} onCheckin={handleCheckin} />
        <ReplacementHabits addiction={userData.addiction} />
        <MotivationFeed />
      </main>

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

export default Dashboard;
