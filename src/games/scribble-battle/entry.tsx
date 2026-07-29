import { useState, useCallback, useEffect } from "react";
import { GameProvider, useSBGame } from "./state/GameContext";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import { Card } from "@/components/ui/card";
import { useGameFocusStore } from "@/stores/game-focus.store";

function ScribbleBattleApp() {
  const [inRoom, setInRoom] = useState(false);
  const { gameState } = useSBGame();
  const setGameFocus = useGameFocusStore((state) => state.setActive);

  const handleEnterRoom = useCallback(() => setInRoom(true), []);
  const handleBack = useCallback(() => setInRoom(false), []);

  useEffect(() => {
    setGameFocus(inRoom);
    return () => setGameFocus(false);
  }, [inRoom, setGameFocus]);

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

function ScribbleBattleEntry() {
  return (
    <div className="h-full overflow-hidden">
      <GameProvider>
        <ScribbleBattleApp />
      </GameProvider>
    </div>
  );
}

export default ScribbleBattleEntry;
