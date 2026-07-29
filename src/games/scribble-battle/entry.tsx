import { lazy, Suspense } from "react";
import { GameProvider } from "./state/GameContext";

const ScribbleBattleApp = lazy(() => import("./ScribbleBattleApp"));

function ScribbleBattleEntry() {
  return (
    <div className="h-full overflow-hidden">
      <GameProvider>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Loading...
            </div>
          }
        >
          <ScribbleBattleApp />
        </Suspense>
      </GameProvider>
    </div>
  );
}

export default ScribbleBattleEntry;
