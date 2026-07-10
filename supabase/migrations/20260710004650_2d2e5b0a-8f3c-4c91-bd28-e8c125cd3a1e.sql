-- Seed Ping Pong game entry (idempotent)
INSERT INTO public.games (slug, title, description, category, accent_color)
VALUES (
  'ping-pong',
  'Ping Pong',
  'Classic table tennis arcade. Challenge a friend or face the AI in a fast-paced paddle battle!',
  'arcade',
  '#06b6d4'
)
ON CONFLICT (slug) DO NOTHING;
