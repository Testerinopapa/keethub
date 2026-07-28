import { useEffect, useRef, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface SBChannel {
  id: string;
  subscribe: (event: string, handler: (payload: any) => void) => () => void;
  broadcast: (event: string, payload: any) => void;
  broadcastToTeam: (team: 1 | 2, event: string, payload: any) => void;
  unsubscribe: () => void;
  onStatusChange: (cb: (connected: boolean) => void) => () => void;
}

const channelCache = new Map<
  string,
  {
    team1: RealtimeChannel;
    team2: RealtimeChannel;
    events: RealtimeChannel;
  }
>();

export function useSBRealtime(): {
  joinRoomChannel: (roomId: string) => SBChannel;
  leaveRoomChannel: (roomId: string) => void;
} {
  const channelsRef = useRef<Map<string, SBChannel>>(new Map());

  const unsubscribeChannel = useCallback((roomId: string) => {
    const cached = channelCache.get(roomId);
    if (cached) {
      cached.team1.unsubscribe();
      cached.team2.unsubscribe();
      cached.events.unsubscribe();
      channelCache.delete(roomId);
    }
    channelsRef.current.delete(roomId);
  }, []);

  const joinRoomChannel = useCallback(
    (roomId: string): SBChannel => {
      const existing = channelsRef.current.get(roomId);
      if (existing) return existing;

      const handlers = new Map<string, Set<(payload: any) => void>>();

      const team1Channel = supabase.channel(`room:${roomId}:team1:drawing`, {
        config: { broadcast: { self: false } },
      });
      const team2Channel = supabase.channel(`room:${roomId}:team2:drawing`, {
        config: { broadcast: { self: false } },
      });
      const eventsChannel = supabase.channel(`room:${roomId}:events`, {
        config: { broadcast: { self: false } },
      });

      team1Channel.subscribe();
      team2Channel.subscribe();
      eventsChannel.subscribe();

      channelCache.set(roomId, {
        team1: team1Channel,
        team2: team2Channel,
        events: eventsChannel,
      });

      const channel: SBChannel = {
        id: roomId,

        subscribe(event, handler) {
          if (!handlers.has(event)) handlers.set(event, new Set());
          handlers.get(event)!.add(handler);

          // Route to appropriate channel
          if (event.startsWith("drawing:") || event === "canvas-cleared") {
            // Drawing events come on both team channels
            team1Channel.on("broadcast", { event }, ({ payload }) => handler(payload));
            team2Channel.on("broadcast", { event }, ({ payload }) => handler(payload));
          } else {
            eventsChannel.on("broadcast", { event }, ({ payload }) => handler(payload));
          }

          return () => {
            handlers.get(event)?.delete(handler);
          };
        },

        broadcast(event, payload) {
          const isDrawing = event.startsWith("drawing:") || event === "canvas-cleared";
          if (isDrawing) {
            // Broadcast to both team drawing channels (drawer only broadcasts to their team in sendDrawingEvent)
            team1Channel.send({ type: "broadcast", event, payload });
            team2Channel.send({ type: "broadcast", event, payload });
          } else {
            eventsChannel.send({ type: "broadcast", event, payload });
          }
        },

        broadcastToTeam(team, event, payload) {
          const chan = team === 1 ? team1Channel : team2Channel;
          chan.send({ type: "broadcast", event, payload });
        },

        unsubscribe() {
          unsubscribeChannel(roomId);
        },

        onStatusChange(cb) {
          const onSub = (status: string) => cb(status === "SUBSCRIBED");
          eventsChannel.on("system", { event: "connected" }, () => onSub("SUBSCRIBED"));
          eventsChannel.on("system", { event: "disconnected" }, () => onSub("CLOSED"));
          team1Channel.on("system", { event: "connected" }, () => onSub("SUBSCRIBED"));
          team1Channel.on("system", { event: "disconnected" }, () => onSub("CLOSED"));
          team2Channel.on("system", { event: "connected" }, () => onSub("SUBSCRIBED"));
          team2Channel.on("system", { event: "disconnected" }, () => onSub("CLOSED"));
          return () => {};
        },
      };

      channelsRef.current.set(roomId, channel);
      return channel;
    },
    [unsubscribeChannel],
  );

  const leaveRoomChannel = useCallback(
    (roomId: string) => {
      unsubscribeChannel(roomId);
    },
    [unsubscribeChannel],
  );

  useEffect(() => {
    return () => {
      channelsRef.current.forEach((_, roomId) => {
        unsubscribeChannel(roomId);
      });
      channelsRef.current.clear();
    };
  }, [unsubscribeChannel]);

  return { joinRoomChannel, leaveRoomChannel };
}
