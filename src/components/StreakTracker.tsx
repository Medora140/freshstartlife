import { useMemo } from "react";
import { ADDICTION_CATEGORIES, type UserData } from "@/lib/freshstart-data";
import { Flame, DollarSign, Heart, Calendar } from "lucide-react";

interface StreakTrackerProps {
  userData: UserData;
}

const StreakTracker = ({ userData }: StreakTrackerProps) => {
  const category = ADDICTION_CATEGORIES.find((c) => c.id === userData.addiction)!;

  const stats = useMemo(() => {
    const start = new Date(userData.startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const moneySaved = days * category.costPerDay;
    const currentMilestone = [...category.healthMilestones]
      .reverse()
      .find((m) => days >= m.days);
    const nextMilestone = category.healthMilestones.find((m) => days < m.days);

    return { days, hours, moneySaved, currentMilestone, nextMilestone };
  }, [userData.startDate, category]);

  return (
    <div className="space-y-4">
      {/* Main streak */}
      <div className="glass-card p-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Flame className="w-4 h-4" />
          Current Streak
        </div>
        <div className="text-6xl font-serif text-foreground">{stats.days}</div>
        <div className="text-muted-foreground font-medium">
          days & {stats.hours} hours free
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {category.costPerDay > 0 && (
          <div className="glass-card p-4 space-y-1">
            <div className="flex items-center gap-2 text-success">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Saved</span>
            </div>
            <div className="text-2xl font-serif text-foreground">
              ${stats.moneySaved.toLocaleString()}
            </div>
          </div>
        )}

        <div className="glass-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Check-ins</span>
          </div>
          <div className="text-2xl font-serif text-foreground">
            {userData.checkins.length}
          </div>
        </div>

        <div className={`glass-card p-4 space-y-1 ${category.costPerDay === 0 ? "" : "col-span-2"}`}>
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Health</span>
          </div>
          <p className="text-sm text-foreground font-medium">
            {stats.currentMilestone?.message || "Your healing has begun 🌱"}
          </p>
        </div>
      </div>

      {/* Next milestone */}
      {stats.nextMilestone && (
        <div className="glass-card p-4 border-dashed">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
            Next milestone — Day {stats.nextMilestone.days}
          </p>
          <p className="text-sm text-foreground">{stats.nextMilestone.message}</p>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-hero transition-all duration-500"
              style={{
                width: `${Math.min(100, (stats.days / stats.nextMilestone.days) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakTracker;
