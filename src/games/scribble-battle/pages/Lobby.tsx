import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSBGame } from "@/games/scribble-battle/state/GameContext";

interface LobbyProps {
  onEnterRoom: () => void;
}

export default function Lobby({ onEnterRoom }: LobbyProps) {
  const navigate = useNavigate();
  const { createRoom, joinRoom } = useSBGame();

  const [playerName, setPlayerName] = useState("");
  const [joinPin, setJoinPin] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  // Pre-fill player name from profile
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();
        if (profile?.username && !playerName) {
          setPlayerName(profile.username);
        }
      }
    })();
  }, []);

  const handleCreate = useCallback(async () => {
    if (!playerName.trim()) {
      toast.error("Enter a player name");
      return;
    }
    setCreating(true);
    try {
      const { roomId, gamePin } = await createRoom(playerName.trim());
      await joinRoom(roomId, playerName.trim(), 1, gamePin);
      onEnterRoom();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setCreating(false);
    }
  }, [playerName, createRoom, joinRoom, onEnterRoom]);

  const handleJoin = useCallback(async () => {
    if (!playerName.trim()) {
      toast.error("Enter a player name");
      return;
    }
    if (!joinPin.trim()) {
      toast.error("Enter a game PIN");
      return;
    }
    setJoining(true);
    try {
      // First join via RPC to get roomId
      const { data, error } = await supabase.rpc("join_scribble_battle_room", {
        p_game_pin: joinPin.trim().toUpperCase(),
        p_team: 1,
      });
      if (error || !(data as any)?.success) {
        toast.error((data as any)?.error || "Invalid PIN");
        return;
      }
      const result = data as any;
      await joinRoom(result.roomId, playerName.trim(), 1, joinPin.trim().toUpperCase());
      onEnterRoom();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setJoining(false);
    }
  }, [playerName, joinPin, joinRoom, onEnterRoom]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#10204A]">Scribble Battle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team vs team drawing showdown. First team to guess wins the round!
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Join the Fun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Your Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          <Button
            className="w-full bg-[#43A8EA] hover:bg-[#43A8EA]/90"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create Game"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or join with PIN</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinPin">Game PIN</Label>
            <Input
              id="joinPin"
              placeholder="Enter 6-character PIN"
              value={joinPin}
              onChange={(e) => setJoinPin(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-lg tracking-widest uppercase"
            />
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? "Joining..." : "Join Game"}
          </Button>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => navigate({ to: "/hub" })}>
        Back to Hub
      </Button>
    </div>
  );
}
