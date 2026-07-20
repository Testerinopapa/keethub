import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TriviaRoomState } from "../hooks/useTriviaMultiplayer";

interface Props {
  state: TriviaRoomState;
}

const MEDAL_COLORS = ["text-yellow-500", "text-slate-400", "text-amber-700"];

export default function MultiplayerScoreboard({ state }: Props) {
  const players = [...(state.players ?? [])].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-lg mx-auto px-4 py-4 md:py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">Scoreboard</h2>
        <p className="text-sm text-muted-foreground">
          Question {state.room.roundNumber} of {state.room.maxRounds}
        </p>
      </div>

      <Card>
        <CardContent className="py-2">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={cn(
                "flex items-center gap-3 py-3 border-b border-border last:border-0",
                index === 0 && "bg-yellow-500/5 -mx-4 px-4 rounded-lg",
              )}
            >
              <div className="w-8 text-center flex-shrink-0">
                {index === 0 ? (
                  <Trophy className="w-5 h-5 text-yellow-500 mx-auto" />
                ) : index < 3 ? (
                  <Medal className={cn("w-5 h-5 mx-auto", MEDAL_COLORS[index])} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{player.name}</p>
                {player.streak > 1 && (
                  <p className="text-xs text-warning">{player.streak}x streak</p>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold tabular-nums">{player.score.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
