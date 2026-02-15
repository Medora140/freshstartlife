import { type AddictionType } from "@/lib/freshstart-data";
import { Repeat2, ArrowRight } from "lucide-react";

const REPLACEMENT_HABITS: Record<AddictionType, { trigger: string; replacement: string; emoji: string }[]> = {
  smoking: [
    { trigger: "After a meal", replacement: "Chew sugar-free gum or take a 5-min walk", emoji: "🚶" },
    { trigger: "Stress at work", replacement: "Do 10 deep breaths or squeeze a stress ball", emoji: "🧘" },
    { trigger: "With morning coffee", replacement: "Switch to herbal tea for a week", emoji: "🍵" },
    { trigger: "Social smoking", replacement: "Hold a toothpick or sip sparkling water", emoji: "💧" },
    { trigger: "Boredom", replacement: "Try a 5-minute stretching routine", emoji: "🤸" },
  ],
  alcohol: [
    { trigger: "After work wind-down", replacement: "Make a mocktail or kombucha ritual", emoji: "🍹" },
    { trigger: "Social pressure", replacement: "Order a club soda with lime confidently", emoji: "🍋" },
    { trigger: "Can't sleep", replacement: "Try a guided sleep meditation", emoji: "🌙" },
    { trigger: "Celebrating", replacement: "Celebrate with a special meal instead", emoji: "🎉" },
    { trigger: "Feeling anxious", replacement: "Journal for 5 minutes about what's on your mind", emoji: "📝" },
  ],
  drugs: [
    { trigger: "Emotional pain", replacement: "Call a trusted friend or support line", emoji: "📞" },
    { trigger: "Peer pressure", replacement: "Have an exit plan ready — leave or text a buddy", emoji: "🚪" },
    { trigger: "Boredom or loneliness", replacement: "Start a new creative hobby: drawing, music, cooking", emoji: "🎨" },
    { trigger: "Feeling overwhelmed", replacement: "Break tasks into tiny steps; do just one", emoji: "✅" },
    { trigger: "Nostalgia for the high", replacement: "Exercise hard for 20 min — natural endorphins", emoji: "🏃" },
  ],
  social_media: [
    { trigger: "First thing in the morning", replacement: "Read 2 pages of a book instead", emoji: "📖" },
    { trigger: "Waiting in line", replacement: "Practice mindful observation of your surroundings", emoji: "👀" },
    { trigger: "Feeling lonely", replacement: "Text or call a real friend", emoji: "💬" },
    { trigger: "Procrastinating", replacement: "Set a 10-min timer and do one task", emoji: "⏱️" },
    { trigger: "Before bed scrolling", replacement: "Listen to a podcast or do a body scan", emoji: "🎧" },
  ],
  porn_gaming: [
    { trigger: "Late night alone", replacement: "Start an evening routine: stretch, read, journal", emoji: "📓" },
    { trigger: "Stress or anxiety", replacement: "Do a cold shower or intense short workout", emoji: "🚿" },
    { trigger: "Boredom", replacement: "Learn a new skill: cooking, instrument, language", emoji: "🎸" },
    { trigger: "Feeling disconnected", replacement: "Go to a café, park, or social meetup", emoji: "☕" },
    { trigger: "Habitual trigger", replacement: "Move your device out of the room at trigger times", emoji: "📵" },
  ],
  sugar_junk: [
    { trigger: "3pm energy crash", replacement: "Eat a handful of nuts and drink water", emoji: "🥜" },
    { trigger: "Emotional eating", replacement: "Pause and name the emotion. Then choose.", emoji: "💭" },
    { trigger: "Craving sweets", replacement: "Try frozen berries or dark chocolate (85%+)", emoji: "🫐" },
    { trigger: "Fast food convenience", replacement: "Meal prep one simple healthy lunch on Sunday", emoji: "🥗" },
    { trigger: "Late night snacking", replacement: "Brush your teeth early as a stop signal", emoji: "🪥" },
  ],
};

interface ReplacementHabitsProps {
  addiction: AddictionType;
}

const ReplacementHabits = ({ addiction }: ReplacementHabitsProps) => {
  const habits = REPLACEMENT_HABITS[addiction];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-primary">
        <Repeat2 className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase tracking-wide">Replacement Habits</span>
      </div>

      <div className="space-y-2">
        {habits.map((habit, i) => (
          <div
            key={i}
            className="glass-card p-4 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{habit.emoji}</span>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span>When: {habit.trigger}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground font-medium leading-snug">
                    {habit.replacement}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReplacementHabits;
