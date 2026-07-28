import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const ScribbleBattleEntry = lazy(
  () => import("@/games/scribble-battle/entry"),
);

export const Route = createFileRoute(
  "/_authenticated/hub/games/scribble-battle",
)({
  ssr: false,
  component: () => (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Loading Scribble Battle...
        </div>
      }
    >
      <ScribbleBattleEntry />
    </Suspense>
  ),
});
