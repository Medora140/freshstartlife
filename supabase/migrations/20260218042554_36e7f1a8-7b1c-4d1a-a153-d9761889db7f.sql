
-- Create a security definer function to get anonymized leaderboard data
CREATE OR REPLACE FUNCTION public.get_forest_leaderboard()
RETURNS TABLE (
  rank bigint,
  display_name text,
  tree_count bigint,
  mature_trees bigint,
  total_growth bigint,
  is_current_user boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC, SUM(ut.growth_stage) DESC) as rank,
    'Grower #' || ROW_NUMBER() OVER (ORDER BY ut.user_id) as display_name,
    COUNT(*) as tree_count,
    COUNT(*) FILTER (WHERE ut.growth_stage >= 4) as mature_trees,
    SUM(ut.growth_stage)::bigint as total_growth,
    (ut.user_id = auth.uid()) as is_current_user
  FROM public.user_trees ut
  WHERE ut.is_alive = true
  GROUP BY ut.user_id
  ORDER BY tree_count DESC, total_growth DESC
  LIMIT 50;
$$;
