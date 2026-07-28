import { useSBGame } from "@/games/scribble-battle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface MatchResultsProps {
  onRematch: () => void;
  onLeave: () => void;
}

export function MatchResults({ onRematch, onLeave }: MatchResultsProps) {
  const { gameState } = useSBGame();

  if (gameState.phase !== "game-ended") return null;

  const allPlayers = [...gameState.team1, ...gameState.team2].sort((a, b) => b.score - a.score);
  const t1Won = gameState.team1Score > gameState.team2Score;
  const t2Won = gameState.team2Score > gameState.team1Score;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-96 max-w-[90vw] max-h-[85vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-[#FF9418]" />
            Game Over
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Team scores */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`rounded-lg p-3 text-center ${t1Won ? "bg-green-100" : "bg-muted/50"}`}>
              <p className="text-xs text-muted-foreground">Team One</p>
              <p className="text-2xl font-bold">{gameState.team1Score}</p>
              {t1Won && <p className="text-xs text-green-600">Winner!</p>}
            </div>
            <div className={`rounded-lg p-3 text-center ${t2Won ? "bg-green-100" : "bg-muted/50"}`}>
              <p className="text-xs text-muted-foreground">Team Two</p>
              <p className="text-2xl font-bold">{gameState.team2Score}</p>
              {t2Won && <p className="text-xs text-green-600">Winner!</p>}
            </div>
          </div>

          {/* Top players */}
          <div>
            <p className="mb-1 text-sm font-medium">Top Players</p>
            {allPlayers.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1">
                <span className="flex items-center gap-2">
                  <span className="w-5 text-center font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  {p.name}
                </span>
                <span className="font-mono font-medium">{p.score} pts</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={onRematch}>
              Play Again
            </Button>
            <Button variant="outline" onClick={onLeave}>
              Leave
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
