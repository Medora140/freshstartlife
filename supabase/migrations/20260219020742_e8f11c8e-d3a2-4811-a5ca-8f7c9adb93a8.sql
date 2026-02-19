
-- Add position columns to user_trees for garden placement
ALTER TABLE public.user_trees
ADD COLUMN position_x double precision NOT NULL DEFAULT 0.5,
ADD COLUMN position_y double precision NOT NULL DEFAULT 0.5;

-- Randomize positions for existing trees so they don't all stack
UPDATE public.user_trees SET
  position_x = 0.1 + random() * 0.8,
  position_y = 0.2 + random() * 0.6;
