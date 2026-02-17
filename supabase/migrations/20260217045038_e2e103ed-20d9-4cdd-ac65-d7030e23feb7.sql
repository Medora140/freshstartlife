
-- Add coins column to profiles
ALTER TABLE public.profiles ADD COLUMN coins integer NOT NULL DEFAULT 0;

-- Create user_trees table
CREATE TABLE public.user_trees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tree_type TEXT NOT NULL DEFAULT 'oak',
  planted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  growth_stage INTEGER NOT NULL DEFAULT 0,
  is_alive BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_trees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trees" ON public.user_trees
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trees" ON public.user_trees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trees" ON public.user_trees
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trees" ON public.user_trees
  FOR DELETE USING (auth.uid() = user_id);
