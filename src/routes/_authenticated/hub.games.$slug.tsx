import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Construction, Trophy } from "lucide-react";
import { getGameBySlug } from "@/lib/games.functions";
import { getGameLeaderboard } from "@/lib/scores.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const gameQuery = (slug: string) =>
  queryOptions({
    queryKey: ["game", slug],
    queryFn: () => getGameBySlug({ data: { slug } }),
  });

const leaderboardQuery = (gameId: string | undefined) =>
  queryOptions({
    queryKey: ["game-leaderboard", gameId],
    queryFn: () => (gameId ? getGameLeaderboard({ data: { gameId } }) : Promise.resolve([])),
    enabled: !!gameId,
  });

export const Route = createFileRoute("/_authenticated/hub/games/$slug")({
  loader: async ({ context, params }) => {
    const game = await context.queryClient.ensureQueryData(gameQuery(params.slug));
    if (!game) throw notFound();
    return game;
  },
  component: GameDetail,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">
      Game not found.{" "}
      <Link to="/hub" className="text-primary underline">
        Back to library
      </Link>
    </div>
  ),
});

function GameDetail() {
  const { slug } = Route.useParams();
  const { data: game } = useSuspenseQuery(gameQuery(slug));
  const { data: leaderboard } = useSuspenseQuery(leaderboardQuery(game?.id));

  if (!game) return null;
  const accent = game.accent_color ?? "#a78bfa";

  return (
    <div className="px-6 py-8 md:px-10 max-w-6xl mx-auto">
      <Link
        to="/hub"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to library
      </Link>

      <div
        className="rounded-3xl border border-border p-8 md:p-12 mb-8 relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${accent}30, transparent 60%), linear-gradient(135deg, ${accent}20, oklch(0.22 0.035 268))`,
        }}
      >
        <Badge variant="secondary" className="mb-4">
          {game.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{game.title}</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">{game.description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-border bg-card aspect-video grid place-items-center">
            <div className="text-center p-8 max-w-md">
              <Construction className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Not quite ready yet</h2>
              <p className="text-muted-foreground mb-4">
                This game doesn't have a live build yet. Check back soon or try one of the ready games
                from the library.
              </p>
              <Link to="/hub">
                <Button variant="default">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to library
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Top players</h2>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scores yet — be the first!</p>
          ) : (
            <ol className="space-y-2">
              {leaderboard.map((row, i) => (
                <li key={row.id} className="flex items-center justify-between text-sm py-1">
                  <span className="flex items-center gap-3">
                    <span className="w-5 text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                    <span className="truncate">{row.username ?? "anon"}</span>
                  </span>
                  <span className="font-semibold tabular-nums">{row.score.toLocaleString()}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
