// Scribble Battle — team-based drawing & guessing game
// Uses Supabase RPC functions for game authority and
// Supabase Realtime for peer-to-peer drawing/chat.

export const SB_CONSTANTS = {
  DEFAULT_WORD_PACK: "classic",
  DEFAULT_ROUND_TIME: 60,
  DEFAULT_REGULAR_ROUNDS: 5,
  MAX_PLAYERS_PER_TEAM: 10,
  MIN_PLAYERS_PER_TEAM: 2,
} as const;
