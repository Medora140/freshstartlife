import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TreePine, Sprout, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  display_name: string;
  tree_count: number;
  mature_trees: number;
  total_growth: number;
  is_current_user: boolean;
}

const ForestLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.rpc("get_forest_leaderboard");
      if (!error && data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Sprout className="w-8 h-8 text-primary animate-pulse-soft" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="glass-card p-6 text-center space-y-3">
        <Trophy className="w-10 h-10 text-muted-foreground mx-auto" />
        <p className="text-muted-foreground text-sm">
          No growers yet. Be the first to plant a tree!
        </p>
      </div>
    );
  }

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Crown className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Crown className="w-4 h-4 text-amber-600" />;
    return <span className="text-xs text-muted-foreground w-4 text-center">{rank}</span>;
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-secondary" />
        <h3 className="font-serif text-lg text-foreground">Forest Leaderboard</h3>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              entry.is_current_user
                ? "bg-primary/10 border border-primary/20"
                : "bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-center w-6">
              {rankIcon(entry.rank)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground truncate">
                  {entry.is_current_user ? "You" : entry.display_name}
                </span>
                {entry.is_current_user && (
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                    YOU
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <TreePine className="w-3 h-3" /> {entry.tree_count} trees
                </span>
                <span>·</span>
                <span>🌳 {entry.mature_trees} mature</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-semibold text-foreground">
                {entry.total_growth}
              </span>
              <p className="text-[10px] text-muted-foreground">growth pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForestLeaderboard;
