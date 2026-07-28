-- 1. Player insert policies: require self
DROP POLICY IF EXISTS "Authenticated can join chess rooms" ON public.chess_players;
CREATE POLICY "Authenticated can join chess rooms" ON public.chess_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated can join trivia rooms" ON public.trivia_players;
CREATE POLICY "Authenticated can join trivia rooms" ON public.trivia_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "SB players can join rooms" ON public.scribble_battle_players;
CREATE POLICY "SB players can join rooms" ON public.scribble_battle_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 2. Room insert policies: require ownership
DROP POLICY IF EXISTS "Authenticated can create chess rooms" ON public.chess_rooms;
CREATE POLICY "Authenticated can create chess rooms" ON public.chess_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Authenticated can create trivia rooms" ON public.trivia_rooms;
CREATE POLICY "Authenticated can create trivia rooms" ON public.trivia_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "SB rooms creatable by authenticated" ON public.scribble_battle_rooms;
CREATE POLICY "SB rooms creatable by authenticated" ON public.scribble_battle_rooms
  FOR INSERT TO authenticated WITH CHECK (owner_id IS NOT NULL AND owner_id = auth.uid());

-- 3. Missing WITH CHECK on updates
DROP POLICY IF EXISTS "SB players can update own row" ON public.scribble_battle_players;
CREATE POLICY "SB players can update own row" ON public.scribble_battle_players
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "SB room owner can update" ON public.scribble_battle_rooms;
CREATE POLICY "SB room owner can update" ON public.scribble_battle_rooms
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- 4. Fixed search_path on helpers missing it
ALTER FUNCTION public.get_sb_room_state(uuid) SET search_path = public;
ALTER FUNCTION public.sb_round_resolved(uuid) SET search_path = public;
ALTER FUNCTION public.set_sb_player_ready(uuid, boolean) SET search_path = public;
ALTER FUNCTION public.switch_sb_team(uuid, integer) SET search_path = public;
ALTER FUNCTION public.tg_sb_rooms_updated_at() SET search_path = public;

-- 5. Revoke EXECUTE from anon on every public function; revoke internal helpers from all clients
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', r.sig);
  END LOOP;
END $$;

-- Internal-only helpers: not callable by signed-in users either
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND (p.proname LIKE 'tg\_%'
        OR p.proname IN (
          'generate_balderdash_code','generate_chess_code','generate_game_pin',
          'generate_trivia_code','get_random_word','handle_new_user',
          'has_role','all_guessers_finished','sb_round_resolved','compute_trivia_points'
        ))
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM authenticated', r.sig);
  END LOOP;
END $$;
