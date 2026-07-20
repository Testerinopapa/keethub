import { useState, useEffect, useCallback, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type TriviaPhase =
  | "lobby"
  | "category_select"
  | "question_intro"
  | "question"
  | "answer_reveal"
  | "scoring"
  | "finished";

export interface TriviaPlayer {
  id: string;
  userId: string;
  name: string;
  avatar: unknown;
  score: number;
  streak: number;
  isReady: boolean;
  isConnected: boolean;
}

export interface TriviaOption {
  id: string;
  text: string;
  color: string;
}

export interface TriviaQuestion {
  id: string;
  text: string;
  options: TriviaOption[];
  timeLimit: number;
  correctOptionId?: string;
}

export interface TriviaAnswer {
  playerId: string;
  playerName: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeMs: number;
  points: number;
}

export interface TriviaRoom {
  id: string;
  code: string;
  name: string;
  phase: TriviaPhase;
  categoryId: string | null;
  roundNumber: number;
  maxRounds: number;
  maxPlayers: number;
  ownerId: string;
  roundDeadlineAt: number | null;
}

export interface TriviaRoomState {
  success: boolean;
  room: TriviaRoom;
  selfPlayerId: string;
  isOwner: boolean;
  players: TriviaPlayer[];
  currentQuestion: TriviaQuestion | null;
  answers: TriviaAnswer[];
  self: { hasAnswered: boolean };
}

type RpcResult<T> = T & { success?: boolean; error?: string };

type RpcClient = {
  rpc: (
    fn: string,
    args?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

async function callRpc<T>(fn: string, args?: Record<string, unknown>): Promise<RpcResult<T>> {
  const { data, error } = await (supabase as unknown as RpcClient).rpc(fn, args);
  if (error) throw new Error(error.message);
  const payload = data as RpcResult<T>;
  if (payload?.success === false) {
    throw new Error(payload.error ?? "Action failed");
  }
  return payload;
}

const ROOM_STORAGE_KEY = "trivia-blitz-room-id";

export function useTriviaMultiplayer() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [state, setState] = useState<TriviaRoomState | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadState = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const roomState = await callRpc<TriviaRoomState>("get_trivia_room_state", {
        p_room_id: id,
      });
      setState(roomState as TriviaRoomState);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/room not found|not in this room|unauthorized/i.test(message)) {
        localStorage.removeItem(ROOM_STORAGE_KEY);
        setRoomId(null);
        setState(null);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reconnection on mount
  useEffect(() => {
    const savedRoomId = localStorage.getItem(ROOM_STORAGE_KEY);
    if (!savedRoomId) {
      setLoading(false);
      return;
    }
    setRoomId(savedRoomId);
    void loadState(savedRoomId).catch(() => {});
  }, [loadState]);

  // Realtime channel
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`trivia:${roomId}`, {
        config: { broadcast: { self: false } },
      })
      .on("broadcast", { event: "state-changed" }, () => {
        void loadState(roomId);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current === channel) channelRef.current = null;
      void channel.unsubscribe();
    };
  }, [loadState, roomId]);

  // Polling fallback
  useEffect(() => {
    if (!roomId) return;
    const timer = window.setInterval(() => {
      void loadState(roomId);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [loadState, roomId]);

  const notifyRoom = useCallback(() => {
    void channelRef.current?.send({
      type: "broadcast",
      event: "state-changed",
      payload: { at: Date.now() },
    });
  }, []);

  const runAction = useCallback(
    async (label: string, fn: string, args: Record<string, unknown>, after?: () => void) => {
      if (!roomId) return;
      setAction(label);
      try {
        await callRpc(fn, args);
        await loadState(roomId);
        notifyRoom();
        after?.();
      } catch (error) {
        throw error;
      } finally {
        setAction(null);
      }
    },
    [loadState, notifyRoom, roomId],
  );

  const createRoom = useCallback(
    async (name: string, maxRounds?: number) => {
      const result = await callRpc<{ roomId: string; roomCode: string }>(
        "create_trivia_room",
        { p_room_name: name, p_max_rounds: maxRounds ?? 7 },
      );
      const id = result.roomId;
      localStorage.setItem(ROOM_STORAGE_KEY, id);
      setRoomId(id);
      await loadState(id);
      return { roomId: result.roomId, roomCode: result.roomCode };
    },
    [loadState],
  );

  const joinRoom = useCallback(
    async (code: string) => {
      const result = await callRpc<{ roomId: string }>("join_trivia_room", {
        p_room_code: code,
      });
      const id = result.roomId;
      localStorage.setItem(ROOM_STORAGE_KEY, id);
      setRoomId(id);
      await loadState(id);
    },
    [loadState],
  );

  const leaveRoom = useCallback(async () => {
    if (!roomId) return;
    setAction("leave");
    try {
      await callRpc("leave_trivia_room", { p_room_id: roomId });
      notifyRoom();
    } catch {
      // Best-effort
    } finally {
      localStorage.removeItem(ROOM_STORAGE_KEY);
      setRoomId(null);
      setState(null);
      setAction(null);
    }
  }, [notifyRoom, roomId]);

  const setReady = useCallback(
    (isReady: boolean) => runAction("ready", "set_trivia_ready", { p_room_id: roomId, p_is_ready: isReady }),
    [runAction, roomId],
  );

  const selectCategory = useCallback(
    (categoryId: string) =>
      runAction("category", "select_trivia_category", {
        p_room_id: roomId,
        p_category_id: categoryId,
      }),
    [runAction, roomId],
  );

  const startGame = useCallback(
    () => runAction("start", "start_trivia_game", { p_room_id: roomId }),
    [runAction, roomId],
  );

  const submitAnswer = useCallback(
    async (optionId: string, timeMs: number) => {
      if (!roomId || !state?.currentQuestion) return;
      setAction("answer");
      try {
        await callRpc("submit_trivia_answer", {
          p_room_id: roomId,
          p_question_id: state.currentQuestion.id,
          p_selected_option_id: optionId,
          p_time_ms: timeMs,
        });
        await loadState(roomId);
        notifyRoom();
      } catch {
        // Best-effort — might fail if already answered or wrong phase
      } finally {
        setAction(null);
      }
    },
    [loadState, notifyRoom, roomId, state?.currentQuestion],
  );

  const advanceQuestion = useCallback(
    () => runAction("advance", "advance_trivia_question", { p_room_id: roomId }),
    [runAction, roomId],
  );

  // Reconnect to existing room after state is loaded
  const reconnectRoom = useCallback(
    (id: string) => {
      localStorage.setItem(ROOM_STORAGE_KEY, id);
      setRoomId(id);
      void loadState(id);
    },
    [loadState],
  );

  return {
    roomState: state,
    loading,
    action,
    roomId,
    reconnectRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    selectCategory,
    startGame,
    submitAnswer,
    advanceQuestion,
    notifyRoom,
  };
}
