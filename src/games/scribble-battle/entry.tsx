import { useState, useCallback, useEffect } from "react";
import { GameProvider, useSBGame } from "./state/GameContext";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import { useGameFocusStore } from "@/stores/game-focus.store";

function ScribbleBattleApp() {
  const [inRoom, setInRoom] = useState(false);
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

  // Route to room when joined
  return <Room key={Date.now()} onBack={handleBack} />;
}

export default function ScribbleBattleEntry() {
  return (
    <div className="h-full overflow-hidden">
      <GameProvider>
        <ScribbleBattleApp />
      </GameProvider>
    </div>
  );
}
