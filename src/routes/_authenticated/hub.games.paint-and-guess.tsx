import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const PaintAndGuessEntry = lazy(
  () => import("@/games/paint-and-guess/entry"),
);

export const Route = createFileRoute(
  "/_authenticated/hub/games/paint-and-guess",
)({
  ssr: false,
  component: () => (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Loading Paint &amp; Guess...
        </div>
      }
    >
      <PaintAndGuessEntry />
    </Suspense>
  ),
});
