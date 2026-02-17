import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, parseISO, startOfDay } from "date-fns";
import type { UserData } from "@/lib/freshstart-data";
import { MOOD_OPTIONS } from "@/lib/freshstart-data";
import { TrendingUp, BarChart3 } from "lucide-react";

interface WeeklyProgressProps {
  userData: UserData;
}

const WeeklyProgress = ({ userData }: WeeklyProgressProps) => {
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const days: { date: string; label: string; mood: number | null; clean: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const dateStr = format(day, "yyyy-MM-dd");
      const checkin = userData.checkins.find((c) => c.date === dateStr);

      days.push({
        date: dateStr,
        label: format(day, "EEE"),
        mood: checkin ? checkin.mood : null,
        clean: checkin ? (checkin.clean ? 1 : 0) : 0,
      });
    }
    return days;
  }, [userData.checkins]);

  const stats = useMemo(() => {
    const weekCheckins = chartData.filter((d) => d.mood !== null);
    const cleanDays = chartData.filter((d) => d.clean === 1).length;
    const avgMood = weekCheckins.length
      ? Math.round((weekCheckins.reduce((s, d) => s + (d.mood ?? 0), 0) / weekCheckins.length) * 10) / 10
      : 0;
    return { cleanDays, avgMood, totalCheckins: weekCheckins.length };
  }, [chartData]);

  const moodLabel = (val: number) => MOOD_OPTIONS.find((m) => m.value === Math.round(val))?.emoji ?? "";

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-serif text-lg text-foreground">Weekly Progress</h3>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-center">
          <p className="text-2xl font-bold text-primary">{stats.cleanDays}/7</p>
          <p className="text-xs text-muted-foreground">Clean Days</p>
        </div>
        <div className="rounded-xl bg-accent/50 p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.avgMood || "—"}</p>
          <p className="text-xs text-muted-foreground">Avg Mood</p>
        </div>
        <div className="rounded-xl bg-accent/50 p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.totalCheckins}</p>
          <p className="text-xs text-muted-foreground">Check-ins</p>
        </div>
      </div>

      {/* Mood trend line */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Mood Trend</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={24} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 13 }}
              formatter={(value: number) => [`${moodLabel(value)} ${value}`, "Mood"]}
              labelFormatter={(label) => label}
            />
            <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Streak bar chart */}
      <div>
        <span className="text-sm text-muted-foreground mb-2 block">Daily Streak</span>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={chartData}>
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Bar dataKey="clean" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyProgress;
