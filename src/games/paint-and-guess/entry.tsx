import { useState, useCallback } from "react";
import { GameProvider, useGame } from "./state/GameContext";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import { Card } from "@/components/ui/card";

function PaintAndGuessApp() {
  const [inRoom, setInRoom] = useState(false);
  const { gameState } = useGame();

  const handleEnterRoom = useCallback(() => setInRoom(true), []);
  const handleBack = useCallback(() => setInRoom(false), []);

  if (!inRoom) {
    return (
      <div className="h-full overflow-y-auto bg-[#FBFDFF]">
        <Lobby onEnterRoom={handleEnterRoom} />
      </div>
    );
  }

  if (!gameState.roomId) {
    return (
      <div className="flex h-full items-center justify-center bg-[#FBFDFF]">
        <Card className="p-6 text-center">
          <p className="text-lg font-semibold">Joining room...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Connecting to game server
          </p>
        </Card>
      </div>
    );
  }

  return <Room key={gameState.roomId} onBack={handleBack} />;
}

export default function PaintAndGuessEntry() {
  return (
    <div className="h-full overflow-hidden">
      <GameProvider>
        <PaintAndGuessApp />
      </GameProvider>
    </div>
  );
}
