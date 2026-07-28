import { useSBGame } from "@/games/scribble-battle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Wifi, WifiOff, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";

export function GameHeader() {
  const { gameState, isGameActive, isDrawer, isConnected } = useSBGame();

  const { round, gamePin, team1Score, team2Score, team, team1FinalProgress, team2FinalProgress, finalWords } = gameState;
  const phase = gameState.phase;

  const copyPin = () => {
    if (gamePin) {
      navigator.clipboard.writeText(gamePin);
      toast.success("PIN copied!");
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-[#43A8EA] to-[#11BFC4] px-4 py-2 text-white">
      {/* PIN */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold tracking-widest">{gamePin}</span>
        <button onClick={copyPin} className="hover:opacity-80">
          <Copy className="h-3 w-3" />
        </button>
      </div>

      {/* Connection */}
      <Badge variant="outline" className="border-white/30 text-white">
        {isConnected ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
        {isConnected ? "Connected" : "Reconnecting..."}
      </Badge>

      {/* Role indicator */}
      {isGameActive && (
        <Badge variant="outline" className="border-white/30 text-white">
          {isDrawer ? (
            <><Pencil className="mr-1 h-3 w-3" /> Drawing</>
          ) : (
            <><Eye className="mr-1 h-3 w-3" /> Guessing</>
          )}
        </Badge>
      )}

      {/* Timer */}
      {isGameActive && (
        <div className="flex items-center gap-1 font-mono text-sm">
          <span className={round.timeLeft <= 10 ? "animate-pulse text-yellow-200" : ""}>
            {round.timeLeft}s
          </span>
        </div>
      )}

      {/* Round info */}
      {phase === "regular" && (
        <span className="text-xs opacity-90">
          Round {round.number} / {gameState.maxRegularRounds}
        </span>
      )}
      {phase === "final" && (
        <span className="text-xs opacity-90">
          Final Relay ({finalWords.length} words)
        </span>
      )}

      <div className="flex-1" />

      {/* Team scores */}
      <div className="flex items-center gap-4">
        <div className={`rounded px-2 py-1 text-sm font-bold ${team === 1 ? "bg-white/20" : ""}`}>
          Team 1: {team1Score}
          {phase === "final" && ` (${team1FinalProgress}/${finalWords.length})`}
        </div>
        <div className={`rounded px-2 py-1 text-sm font-bold ${team === 2 ? "bg-white/20" : ""}`}>
          Team 2: {team2Score}
          {phase === "final" && ` (${team2FinalProgress}/${finalWords.length})`}
        </div>
      </div>
    </div>
  );
}
