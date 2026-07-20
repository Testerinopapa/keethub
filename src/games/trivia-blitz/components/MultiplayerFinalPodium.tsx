import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, RotateCcw, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TriviaRoomState } from "../hooks/useTriviaMultiplayer";

interface Props {
  state: TriviaRoomState;
  submitting: boolean;
  submitted: boolean;
  onSubmitScore: () => void;
  onPlayAgain: () => void;
  onLeaveRoom: () => void;
}

const PODIUM_COLORS = [
  "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  "text-slate-400 bg-slate-400/10 border-slate-400/30",
  "text-amber-700 bg-amber-700/10 border-amber-700/30",
];

export default function MultiplayerFinalPodium({
  state,
  submitting,
  submitted,
  onSubmitScore,
  onPlayAgain,
  onLeaveRoom,
}: Props) {
  const players = [...(state.players ?? [])].sort((a, b) => b.score - a.score);
  const selfId = state.selfPlayerId;
  const selfPlayer = players.find((p) => p.id === selfId);
  const selfRank = players.findIndex((p) => p.id === selfId) + 1;

  return (
    <div className="max-w-lg mx-auto px-4 py-4 md:py-8">
      <div className="text-center mb-6">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gradient-primary mb-2">
          Game Over!
        </h1>
        <p className="text-muted-foreground">
          {state.room.maxRounds} questions completed
        </p>
      </div>

      {/* Podium top 3 */}
      {players.length >= 2 && (
        <div className="grid grid-cols-3 gap-2 mb-6 items-end">
          {/* 2nd place */}
          {players[1] && (
            <div className="text-center order-1">
              <div className="text-2xl mb-1">
                <Medal className="w-8 h-8 text-slate-400 mx-auto" />
              </div>
              <p className="text-sm font-semibold truncate">{players[1].name}</p>
              <p className="text-lg font-bold tabular-nums">{players[1].score.toLocaleString()}</p>
            </div>
          )}

          {/* 1st place */}
          <div className="text-center order-2 -mt-4">
            <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-1" />
            <p className="text-base font-bold truncate">{players[0].name}</p>
            <p className="text-2xl font-extrabold tabular-nums">{players[0].score.toLocaleString()}</p>
          </div>

          {/* 3rd place */}
          {players[2] && (
            <div className="text-center order-3">
              <Medal className="w-8 h-8 text-amber-700 mx-auto mb-1" />
              <p className="text-sm font-semibold truncate">{players[2].name}</p>
              <p className="text-lg font-bold tabular-nums">{players[2].score.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Full ranking */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Final Standings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                player.id === selfId && "bg-primary/10 border border-primary/30",
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn("font-bold w-6 text-center tabular-nums", index < 3 && PODIUM_COLORS[index])}>
                  {index + 1}
                </span>
                <span className="font-medium">{player.name}</span>
                {player.id === selfId && (
                  <span className="text-xs text-primary font-medium">(You)</span>
                )}
              </div>
              <span className="font-bold tabular-nums text-base">{player.score.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {!submitted ? (
          <Button
            size="lg"
            className="w-full glow-primary"
            onClick={onSubmitScore}
            disabled={submitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Score to Leaderboard"}
          </Button>
        ) : (
          <Card className="border-success/40 bg-success/5">
            <CardContent className="py-3 text-center">
              <p className="text-success font-semibold">Score submitted!</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onLeaveRoom}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Leave
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
