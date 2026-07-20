import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Crown, LogOut, Play, Check, Users, Copy, Clipboard } from "lucide-react";
import { toast } from "sonner";
import type { TriviaRoomState } from "../hooks/useTriviaMultiplayer";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "general", name: "General Knowledge", icon: "\u{1F9E0}", desc: "Mix of everything" },
  { id: "science", name: "Science", icon: "\u{1F52C}", desc: "Biology, chemistry, physics" },
  { id: "history", name: "History", icon: "\u{1F4DC}", desc: "World history and events" },
  { id: "pop-culture", name: "Pop Culture", icon: "\u{1F3AC}", desc: "Movies, music, TV" },
  { id: "sports", name: "Sports", icon: "⚽", desc: "Athletics and teams" },
  { id: "geography", name: "Geography", icon: "\u{1F30D}", desc: "Countries and capitals" },
  { id: "technology", name: "Technology", icon: "\u{1F4BB}", desc: "Computers and tech" },
];

interface Props {
  state: TriviaRoomState | null;
  action: string | null;
  onCreateRoom: (name: string) => Promise<{ roomId: string; roomCode: string }>;
  onJoinRoom: (code: string) => Promise<void>;
  onLeaveRoom: () => Promise<void>;
  onSetReady: (isReady: boolean) => Promise<void>;
  onSelectCategory: (categoryId: string) => Promise<void>;
  onStartGame: () => Promise<void>;
}

export default function MultiplayerLobby({
  state,
  action,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onSetReady,
  onSelectCategory,
  onStartGame,
}: Props) {
  const [createName, setCreateName] = useState("Trivia Room");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isInRoom = state !== null;
  const isHost = state?.isOwner ?? false;
  const phase = state?.room.phase ?? "lobby";
  const selfId = state?.selfPlayerId;
  const players = state?.players ?? [];
  const selfPlayer = players.find((p) => p.id === selfId);
  const allReady = players.filter((p) => p.isConnected).every((p) => p.isReady) && players.length >= 2;

  const handleCreate = useCallback(async () => {
    setError(null);
    try {
      const result = await onCreateRoom(createName);
      setCreatedCode(result.roomCode);
      toast.success(`Room created! Code: ${result.roomCode}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create room");
    }
  }, [createName, onCreateRoom]);

  const handleJoin = useCallback(async () => {
    setError(null);
    try {
      await onJoinRoom(joinCode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to join room");
    }
  }, [joinCode, onJoinRoom]);

  const copyCode = () => {
    if (createdCode || state?.room.code) {
      void navigator.clipboard.writeText(createdCode ?? state?.room.code ?? "");
      toast.success("Code copied!");
    }
  };

  // ── Lobby: room with category select ──────────────────────────
  if (isInRoom) {
    const code = state.room.code;
    const categoryId = state.room.categoryId;
    const categoryName = CATEGORIES.find((c) => c.id === categoryId)?.name;

    return (
      <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gradient-primary mb-2">
            {state.room.name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <span className="text-lg font-mono tracking-wider font-bold">{code}</span>
            <button
              type="button"
              onClick={copyCode}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {categoryName && (
            <p className="mt-2 text-sm text-muted-foreground">Category: {categoryName}</p>
          )}
        </div>

        {/* Category selection (host, before game starts) */}
        {isHost && phase === "lobby" && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Select a Category</CardTitle>
              <CardDescription>Pick a quiz category to play</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  disabled={action !== null}
                  onClick={() => onSelectCategory(cat.id).catch(() => {})}
                  className={cn(
                    "text-left rounded-lg border-2 p-3 transition-all duration-200",
                    categoryId === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <p className="text-sm font-medium mt-1">{cat.name}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {isHost && phase === "category_select" && !categoryId && (
          <Card className="mb-6 border-dashed">
            <CardContent className="py-4 text-center text-muted-foreground text-sm">
              Select a category above to continue
            </CardContent>
          </Card>
        )}

        {/* Player list */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Players ({players.length}/{state.room.maxPlayers})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2",
                  player.isConnected ? "bg-muted/30" : "bg-muted/10 opacity-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {player.id === state.room.ownerId && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{player.name}</p>
                    {!player.isConnected && (
                      <p className="text-xs text-muted-foreground">Disconnected</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {player.isReady && <Check className="w-4 h-4 text-success" />}
                  {player.id === selfId && phase !== "category_select" && (
                    <Button
                      size="sm"
                      variant={player.isReady ? "default" : "outline"}
                      disabled={action !== null}
                      onClick={() => onSetReady(!player.isReady).catch(() => {})}
                    >
                      {player.isReady ? "Ready!" : "Ready Up"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onLeaveRoom().catch(() => {})}
            disabled={action !== null}
            className="flex-shrink-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave
          </Button>

          {isHost && (
            <Button
              className="flex-1 glow-primary"
              disabled={!allReady || !categoryId || action !== null}
              onClick={() => onStartGame().catch((e) => toast.error(e instanceof Error ? e.message : "Failed"))}
            >
              <Play className="w-4 h-4 mr-2" />
              {!categoryId ? "Select a category" : !allReady ? "Waiting for players..." : "Start Game"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Join/Create panel ─────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-4 md:py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gradient-primary mb-3">
          Trivia Blitz
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
          Compete against friends in real-time trivia. Create a room or join one with a PIN.
        </p>
      </div>

      {error && (
        <Card className="mb-4 border-destructive/50 bg-destructive/5">
          <CardContent className="py-3 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Create */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create a Room</CardTitle>
            <CardDescription>Start a new game and invite friends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {createdCode ? (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-2">Share this code:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-mono font-bold tracking-widest">{createdCode}</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Clipboard className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Waiting for players to join...</p>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Room name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
                <Button
                  className="w-full"
                  disabled={action !== null}
                  onClick={handleCreate}
                >
                  Create Room
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Join */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Join a Room</CardTitle>
            <CardDescription>Enter a 6-digit PIN to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="000000"
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <Button
              variant="outline"
              className="w-full"
              disabled={joinCode.length !== 6 || action !== null}
              onClick={handleJoin}
            >
              Join Room
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
