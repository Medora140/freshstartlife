import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TREE_TYPES, POINTS_PER_STAGE, MAX_STAGE, COINS_PER_CLEAN_DAY, type TreeType } from "@/lib/tree-data";
import { Coins, ShoppingBag, TreePine, Sprout, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TreeCelebration from "@/components/TreeCelebration";

interface UserTree {
  id: string;
  tree_type: string;
  growth_stage: number;
  is_alive: boolean;
  planted_at: string;
}

const TreeForest = () => {
  const { user } = useAuth();
  const [trees, setTrees] = useState<UserTree[]>([]);
  const [coins, setCoins] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [celebration, setCelebration] = useState<{
    treeName: string;
    treeEmoji: string;
    newStage: number;
  } | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;

    const [{ data: profile }, { data: treesData }] = await Promise.all([
      supabase.from("profiles").select("coins").eq("user_id", user.id).single(),
      supabase.from("user_trees").select("*").eq("user_id", user.id).order("planted_at", { ascending: true }),
    ]);

    setCoins(profile?.coins ?? 0);
    setTrees((treesData as UserTree[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync growth based on clean checkins since tree was planted
  const syncGrowth = useCallback(async () => {
    if (!user || trees.length === 0) return;

    for (const tree of trees) {
      if (!tree.is_alive || tree.growth_stage >= MAX_STAGE) continue;

      const { count } = await supabase
        .from("checkins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("clean", true)
        .gte("date", tree.planted_at.split("T")[0]);

      const newStage = Math.min(MAX_STAGE, Math.floor((count || 0) / POINTS_PER_STAGE));
      if (newStage !== tree.growth_stage) {
        await supabase.from("user_trees").update({ growth_stage: newStage }).eq("id", tree.id);
        // Trigger celebration
        const treeType = TREE_TYPES.find((t) => t.id === tree.tree_type);
        if (treeType) {
          setCelebration({
            treeName: treeType.name,
            treeEmoji: treeType.stages[newStage],
            newStage,
          });
        }
      }
    }

    // Sync coins: total clean days * COINS_PER_CLEAN_DAY
    const { count: totalClean } = await supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("clean", true);

    const earnedCoins = (totalClean || 0) * COINS_PER_CLEAN_DAY;
    // Get spent coins (sum of tree costs)
    const spentCoins = trees.reduce((sum, t) => {
      const treeType = TREE_TYPES.find((tt) => tt.id === t.tree_type);
      return sum + (treeType?.cost || 0);
    }, 0);

    const netCoins = Math.max(0, earnedCoins - spentCoins);
    if (netCoins !== coins) {
      await supabase.from("profiles").update({ coins: netCoins }).eq("user_id", user.id);
      setCoins(netCoins);
    }

    await loadData();
  }, [user, trees, coins, loadData]);

  useEffect(() => {
    if (!loading && user) {
      syncGrowth();
    }
    // Only run once after initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const plantTree = async (treeType: TreeType) => {
    if (!user) return;
    if (treeType.cost > coins) {
      toast.error("Not enough coins!");
      return;
    }

    await supabase.from("user_trees").insert({
      user_id: user.id,
      tree_type: treeType.id,
    });

    const newCoins = coins - treeType.cost;
    await supabase.from("profiles").update({ coins: newCoins }).eq("user_id", user.id);

    toast.success(`Planted a ${treeType.name}! 🌱`);
    setShowShop(false);
    await loadData();
  };

  const getTreeDisplay = (tree: UserTree) => {
    const treeType = TREE_TYPES.find((t) => t.id === tree.tree_type);
    if (!treeType) return { emoji: "🌱", name: "Unknown" };
    return {
      emoji: treeType.stages[tree.growth_stage],
      name: treeType.name,
      maxStage: tree.growth_stage >= MAX_STAGE,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Sprout className="w-8 h-8 text-primary animate-pulse-soft" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Coin balance */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-secondary" />
          <span className="font-semibold text-foreground">{coins}</span>
          <span className="text-sm text-muted-foreground">coins</span>
        </div>
        <div className="text-xs text-muted-foreground">
          +{COINS_PER_CLEAN_DAY} per clean day
        </div>
      </div>

      {/* Forest grid */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-lg text-foreground">My Forest</h3>
          </div>
          <span className="text-sm text-muted-foreground">{trees.length} trees</span>
        </div>

        {trees.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="text-5xl">🌰</div>
            <p className="text-muted-foreground text-sm">
              Your forest is empty. Plant your first tree!
            </p>
            <Button onClick={() => setShowShop(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Plant a Tree
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              {trees.map((tree) => {
                const display = getTreeDisplay(tree);
                return (
                  <div
                    key={tree.id}
                    className={`relative flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors overflow-hidden ${
                      display.maxStage ? "animate-shimmer" : ""
                    }`}
                  >
                    {display.maxStage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer-sweep pointer-events-none" />
                    )}
                    <span className={`text-4xl relative z-10 ${display.maxStage ? "" : "animate-pulse-soft"}`}>
                      {display.emoji}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center">
                      {display.name}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: MAX_STAGE + 1 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i <= tree.growth_stage ? "bg-primary" : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowShop(true)}
              className="w-full gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Tree Shop
            </Button>
          </>
        )}
      </div>

      {/* Growth info */}
      <div className="glass-card p-4 border-dashed">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">
          How it works
        </p>
        <ul className="text-sm text-foreground space-y-1">
          <li>🌱 Every clean day grows your tree</li>
          <li>💰 Earn {COINS_PER_CLEAN_DAY} coins per clean day</li>
          <li>🌳 {POINTS_PER_STAGE} clean days = 1 growth stage</li>
          <li>🏪 Spend coins to unlock new tree types</li>
        </ul>
      </div>

      {/* Shop modal */}
      {showShop && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-soft w-full max-w-md max-h-[80vh] overflow-y-auto p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-foreground">🏪 Tree Shop</h3>
              <div className="flex items-center gap-1.5 text-secondary font-semibold">
                <Coins className="w-4 h-4" /> {coins}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {TREE_TYPES.map((treeType) => {
                const owned = trees.some((t) => t.tree_type === treeType.id);
                const canAfford = coins >= treeType.cost;

                return (
                  <button
                    key={treeType.id}
                    onClick={() => plantTree(treeType)}
                    disabled={!canAfford && !owned && treeType.cost > 0}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-3xl">{treeType.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{treeType.name}</span>
                    <span className="text-xs text-muted-foreground">{treeType.description}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-secondary">
                      {treeType.cost === 0 ? "Free" : <><Coins className="w-3 h-3" /> {treeType.cost}</>}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button variant="outline" onClick={() => setShowShop(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      <TreeCelebration
        show={!!celebration}
        treeName={celebration?.treeName || ""}
        treeEmoji={celebration?.treeEmoji || ""}
        newStage={celebration?.newStage || 0}
        onComplete={() => setCelebration(null)}
      />
    </div>
  );
};

export default TreeForest;
