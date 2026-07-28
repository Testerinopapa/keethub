import { useSBGame } from "@/games/scribble-battle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock } from "lucide-react";

export function RoundSummary() {
  const { gameState } = useSBGame();

  // Only show during round-ended pauses or on timeout reveal
  const revealedWord = gameState.round.revealedWord;
  const winningTeam = gameState.round.winningTeam;

  if (!revealedWord) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-96 max-w-[90vw] text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            Round Over
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-lg">
            The word was: <span className="font-bold text-[#43A8EA]">{revealedWord}</span>
          </p>
          {winningTeam ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Trophy className="h-5 w-5" />
              <span className="font-bold">Team {winningTeam === 1 ? "One" : "Two"} wins!</span>
            </div>
          ) : (
            <p className="text-muted-foreground">Nobody guessed correctly</p>
          )}
          <p className="text-xs text-muted-foreground">Next round starting soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
