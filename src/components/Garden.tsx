import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TREE_TYPES, MAX_STAGE, COINS_PER_CLEAN_DAY, type TreeType } from "@/lib/tree-data";
import { Coins, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GardenTree {
  id: string;
  tree_type: string;
  growth_stage: number;
  is_alive: boolean;
  position_x: number;
  position_y: number;
}

const Garden = () => {
  const { user } = useAuth();
  const [trees, setTrees] = useState<GardenTree[]>([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const gardenRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [{ data: profile }, { data: treesData }] = await Promise.all([
      supabase.from("profiles").select("coins").eq("user_id", user.id).single(),
      supabase.from("user_trees").select("id, tree_type, growth_stage, is_alive, position_x, position_y").eq("user_id", user.id).order("planted_at", { ascending: true }),
    ]);
    setCoins(profile?.coins ?? 0);
    setTrees((treesData as GardenTree[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const getTreeDisplay = (tree: GardenTree) => {
    const treeType = TREE_TYPES.find((t) => t.id === tree.tree_type);
    if (!treeType) return { emoji: "🌱", name: "Unknown" };
    return {
      emoji: treeType.stages[tree.growth_stage],
      name: treeType.name,
      maxStage: tree.growth_stage >= MAX_STAGE,
    };
  };

  const handlePointerDown = (treeId: string) => {
    if (!editMode) return;
    setDragging(treeId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !gardenRef.current) return;
      const rect = gardenRef.current.getBoundingClientRect();
      const x = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0.1, Math.min(0.9, (e.clientY - rect.top) / rect.height));
      setTrees((prev) =>
        prev.map((t) => (t.id === dragging ? { ...t, position_x: x, position_y: y } : t))
      );
    },
    [dragging]
  );

  const handlePointerUp = useCallback(async () => {
    if (!dragging) return;
    const tree = trees.find((t) => t.id === dragging);
    if (tree) {
      await supabase
        .from("user_trees")
        .update({ position_x: tree.position_x, position_y: tree.position_y })
        .eq("id", tree.id);
    }
    setDragging(null);
  }, [dragging, trees]);

  const plantTree = async (treeType: TreeType) => {
    if (!user) return;
    if (treeType.cost > coins) {
      toast.error("Not enough coins!");
      return;
    }
    // Random position
    const px = 0.15 + Math.random() * 0.7;
    const py = 0.25 + Math.random() * 0.5;

    await supabase.from("user_trees").insert({
      user_id: user.id,
      tree_type: treeType.id,
      position_x: px,
      position_y: py,
    });

    const newCoins = coins - treeType.cost;
    await supabase.from("profiles").update({ coins: newCoins }).eq("user_id", user.id);

    toast.success(`Planted a ${treeType.name}! 🌱`);
    setShowShop(false);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-4xl animate-pulse-soft">🌱</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="glass-card p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-secondary" />
          <span className="font-semibold text-sm text-foreground">{coins}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
            className="gap-1.5 text-xs"
          >
            <GripVertical className="w-3.5 h-3.5" />
            {editMode ? "Done" : "Arrange"}
          </Button>
          <Button size="sm" onClick={() => setShowShop(true)} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Plant
          </Button>
        </div>
      </div>

      {/* Garden area */}
      <div
        ref={gardenRef}
        className="relative w-full rounded-2xl overflow-hidden border border-border select-none touch-none"
        style={{ aspectRatio: "4 / 3" }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 dark:from-slate-800 dark:via-slate-700 dark:to-emerald-950" />

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700 rounded-b-2xl" />

        {/* Ground texture dots */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-emerald-900 dark:bg-emerald-400"
              style={{
                left: `${8 + i * 8}%`,
                bottom: `${10 + (i % 3) * 15}%`,
              }}
            />
          ))}
        </div>

        {/* Sun/Moon */}
        <div className="absolute top-4 right-6 w-10 h-10 rounded-full bg-yellow-300 dark:bg-slate-400 opacity-80 shadow-lg" />

        {/* Clouds */}
        <div className="absolute top-6 left-[10%] text-2xl opacity-40 dark:opacity-20">☁️</div>
        <div className="absolute top-12 left-[55%] text-lg opacity-30 dark:opacity-15">☁️</div>

        {/* Trees */}
        {trees.map((tree) => {
          const display = getTreeDisplay(tree);
          const sizeScale = 0.7 + tree.growth_stage * 0.2;
          return (
            <div
              key={tree.id}
              className={`absolute transition-all ${
                dragging === tree.id ? "z-30 scale-110" : "z-10"
              } ${editMode ? "cursor-grab active:cursor-grabbing" : ""} ${
                display.maxStage ? "drop-shadow-lg" : ""
              }`}
              style={{
                left: `${tree.position_x * 100}%`,
                top: `${tree.position_y * 100}%`,
                transform: `translate(-50%, -50%) scale(${sizeScale})`,
                transitionDuration: dragging === tree.id ? "0ms" : "200ms",
              }}
              onPointerDown={() => handlePointerDown(tree.id)}
            >
              <div className="flex flex-col items-center">
                <span
                  className={`text-4xl sm:text-5xl ${
                    display.maxStage ? "drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" : ""
                  }`}
                >
                  {display.emoji}
                </span>
                <span className="text-[9px] font-medium text-foreground/70 bg-background/60 rounded px-1 mt-0.5 backdrop-blur-sm">
                  {display.name}
                </span>
              </div>
              {editMode && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <GripVertical className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {trees.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="text-5xl mb-3">🌾</div>
            <p className="text-sm font-medium text-foreground/70 bg-background/60 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              Your garden is empty — plant a tree!
            </p>
          </div>
        )}

        {/* Edit mode overlay hint */}
        {editMode && trees.length > 0 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 text-xs font-medium text-foreground/80 bg-background/70 rounded-full px-3 py-1 backdrop-blur-sm">
            Drag trees to rearrange
          </div>
        )}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        {trees.length} tree{trees.length !== 1 ? "s" : ""} planted · +{COINS_PER_CLEAN_DAY} coins per clean day
      </p>

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
                const canAfford = coins >= treeType.cost;
                return (
                  <button
                    key={treeType.id}
                    onClick={() => plantTree(treeType)}
                    disabled={!canAfford && treeType.cost > 0}
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
    </div>
  );
};

export default Garden;
