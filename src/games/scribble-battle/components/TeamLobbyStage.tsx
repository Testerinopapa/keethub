import { useSBGame } from "@/games/scribble-battle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface TeamLobbyStageProps {
  isHost: boolean;
  isReady: boolean;
  allPlayersReady: boolean;
  gamePin: string | null;
  onReadyToggle: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onSwitchTeam: (team: 1 | 2) => void;
  currentTeam: 1 | 2 | null;
}

export function TeamLobbyStage({
  isHost,
  isReady,
  allPlayersReady,
  gamePin,
  onReadyToggle,
  onStartGame,
  onLeaveRoom,
  onSwitchTeam,
  currentTeam,
}: TeamLobbyStageProps) {
  const { gameState } = useSBGame();

  const copyPin = () => {
    if (gamePin) {
      navigator.clipboard.writeText(gamePin);
      toast.success("PIN copied!");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {/* PIN display */}
      <Card className="bg-gradient-to-r from-[#43A8EA] to-[#11BFC4] text-white">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm opacity-90">Game PIN</p>
            <p className="text-3xl font-bold tracking-widest">{gamePin || "..."}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={copyPin}>
            <Copy className="mr-1 h-4 w-4" />
            Copy
          </Button>
        </CardContent>
      </Card>

      {/* Teams */}
      <div className="grid grid-cols-2 gap-4">
        {/* Team 1 */}
        <Card className={currentTeam === 1 ? "ring-2 ring-[#43A8EA]" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Team One
              </span>
              <Badge variant="outline">{gameState.team1.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {gameState.team1.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  {p.name}
                  {gameState.ownerId === gameState.authUserId && p.id === gameState.selfId && (
                    <Crown className="h-3 w-3 text-[#FF9418]" />
                  )}
                </span>
                <span>
                  {p.isReady ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not ready</span>
                  )}
                </span>
              </div>
            ))}
            {gameState.team1.length === 0 && (
              <p className="text-xs text-muted-foreground">No players yet</p>
            )}
            {currentTeam !== 1 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => onSwitchTeam(1)}
              >
                Join Team One
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Team 2 */}
        <Card className={currentTeam === 2 ? "ring-2 ring-[#43A8EA]" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Team Two
              </span>
              <Badge variant="outline">{gameState.team2.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {gameState.team2.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  {p.name}
                  {gameState.ownerId === gameState.authUserId && p.id === gameState.selfId && (
                    <Crown className="h-3 w-3 text-[#FF9418]" />
                  )}
                </span>
                <span>
                  {p.isReady ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not ready</span>
                  )}
                </span>
              </div>
            ))}
            {gameState.team2.length === 0 && (
              <p className="text-xs text-muted-foreground">No players yet</p>
            )}
            {currentTeam !== 2 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => onSwitchTeam(2)}
              >
                Join Team Two
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rules */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How to Play</p>
          <ul className="mt-1 space-y-1 text-xs">
            <li>Each round, one drawer per team draws the same word</li>
            <li>Teammates guess — first correct guess wins the round</li>
            <li>Winning drawer stays, losing team rotates</li>
            <li>After {gameState.maxRegularRounds} regular rounds, a rapid final relay begins</li>
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant={isReady ? "default" : "outline"}
          className={isReady ? "bg-green-500 hover:bg-green-600" : ""}
          onClick={onReadyToggle}
        >
          {isReady ? "Ready!" : "Ready Up"}
        </Button>

        {isHost && (
          <Button
            className="flex-1 bg-[#43A8EA] hover:bg-[#43A8EA]/90"
            disabled={!allPlayersReady}
            onClick={onStartGame}
          >
            {allPlayersReady ? "Start Game" : `Waiting for players...`}
          </Button>
        )}

        <Button variant="ghost" onClick={onLeaveRoom}>
          Leave
        </Button>
      </div>
    </div>
  );
}
