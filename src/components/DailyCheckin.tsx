import { useState, useEffect } from "react";
import { MOOD_OPTIONS, type UserData } from "@/lib/freshstart-data";
import { CheckCircle2, XCircle } from "lucide-react";
import TreeGrowthAnimation from "@/components/TreeGrowthAnimation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TREE_TYPES } from "@/lib/tree-data";

interface DailyCheckinProps {
  userData: UserData;
  onCheckin: (clean: boolean, mood: number) => void;
}

const DailyCheckin = ({ userData, onCheckin }: DailyCheckinProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<"clean" | "mood" | "done">("clean");
  const [isClean, setIsClean] = useState<boolean | null>(null);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [activeTreeStages, setActiveTreeStages] = useState<string[] | undefined>(undefined);

  // Fetch the user's most recent tree to use its stages in the animation
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_trees")
      .select("tree_type")
      .eq("user_id", user.id)
      .eq("is_alive", true)
      .order("planted_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const treeType = TREE_TYPES.find((t) => t.id === data.tree_type);
          if (treeType) setActiveTreeStages(treeType.stages);
        }
      });
  }, [user]);

  const today = new Date().toISOString().split("T")[0];
  const alreadyCheckedIn = userData.checkins.some((c) => c.date === today);

  if (alreadyCheckedIn) {
    const todayCheckin = userData.checkins.find((c) => c.date === today)!;
    const mood = MOOD_OPTIONS.find((m) => m.value === todayCheckin.mood);
    return (
      <div className="glass-card p-6 text-center space-y-3">
        <div className="text-3xl">{todayCheckin.clean ? "✅" : "💪"}</div>
        <h3 className="font-serif text-lg text-foreground">Today's Check-in Complete</h3>
        <p className="text-sm text-muted-foreground">
          {todayCheckin.clean ? "Stayed clean today" : "Had a slip — that's okay, you're still here"} · Mood: {mood?.emoji}
        </p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="glass-card p-6 text-center space-y-3 animate-fade-up">
        {isClean ? (
          <>
            <TreeGrowthAnimation stages={activeTreeStages} />
            <h3 className="font-serif text-lg text-foreground">Your tree is growing! 🌳</h3>
            <p className="text-sm text-muted-foreground">Amazing! Another clean day fuels your forest.</p>
          </>
        ) : (
          <>
            <div className="text-4xl">💪</div>
            <h3 className="font-serif text-lg text-foreground">Check-in saved!</h3>
            <p className="text-sm text-muted-foreground">Tomorrow is a new chance. We believe in you.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-5 animate-fade-up">
      <h3 className="font-serif text-xl text-foreground text-center">Daily Check-in</h3>

      {step === "clean" && (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">Did you stay clean today?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setIsClean(true); setStep("mood"); }}
              className="p-4 rounded-2xl border-2 border-border hover:border-success bg-card hover:bg-success/10 transition-all flex flex-col items-center gap-2"
            >
              <CheckCircle2 className="w-8 h-8 text-success" />
              <span className="font-semibold text-foreground">Yes!</span>
            </button>
            <button
              onClick={() => { setIsClean(false); setStep("mood"); }}
              className="p-4 rounded-2xl border-2 border-border hover:border-secondary bg-card hover:bg-secondary/10 transition-all flex flex-col items-center gap-2"
            >
              <XCircle className="w-8 h-8 text-secondary" />
              <span className="font-semibold text-foreground">Not today</span>
            </button>
          </div>
        </div>
      )}

      {step === "mood" && (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">How are you feeling?</p>
          <div className="flex justify-center gap-3">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  selectedMood === mood.value
                    ? "border-primary bg-primary/10 scale-110"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-muted-foreground">{mood.label}</span>
              </button>
            ))}
          </div>
          {selectedMood !== null && (
            <button
              onClick={() => {
                onCheckin(isClean!, selectedMood);
                setStep("done");
              }}
              className="w-full py-3 rounded-2xl gradient-hero text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Save Check-in
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyCheckin;
