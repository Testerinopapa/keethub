import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowDownUp,
  ArrowRight,
  BookOpen,
  Clock,
  Gamepad2,
  GraduationCap,
  Palette,
  Puzzle,
  Search,
  Sparkles,
  Star,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listGames, type Game } from "@/lib/games.functions";
import { LOCAL_GAMES, PORTED_ROUTES } from "@/lib/local-games";
import { cn } from "@/lib/utils";
import { useHubStore } from "@/stores/hub-store";

const gamesQuery = queryOptions({
  queryKey: ["games"],
  queryFn: () => listGames(),
});

type GameTheme = {
  accent: string;
  soft: string;
  focus: string;
  icon: LucideIcon;
  displayTitle?: string;
};

type GameDisplay = {
  title: string;
  description: string;
  category: string;
  accent: string;
  soft: string;
  focus: string;
  icon: LucideIcon;
};

const gameArtworkBySlug: Record<string, string> = {
  "chess-blitz": "/games/chess-blitz-card.png",
  chess: "/games/chess-blitz-card.png",
  "scribble-scrattle": "/games/scribble-scrattle-card.png",
  "paint-and-guess": "/games/scribble-scrattle-card.png",
  "trivia-blitz": "/games/trivia-blitz-card.png",
  keetdash: "/games/keetdash-card.png",
  balderdash: "/games/keetdash-card.png",
};

const gameThemeBySlug: Record<string, GameTheme> = {
  semanteek: {
    displayTitle: "Semanteek",
    accent: "#08AAA7",
    soft: "#ECFBFA",
    focus: "Vocabulary clues",
    icon: BookOpen,
  },
  semantic: {
    displayTitle: "Semanteek",
    accent: "#08AAA7",
    soft: "#ECFBFA",
    focus: "Vocabulary clues",
    icon: BookOpen,
  },
  "chess-blitz": {
    displayTitle: "Chess Blitz",
    accent: "#FF9418",
    soft: "#FFF8D9",
    focus: "Strategy practice",
    icon: Trophy,
  },
  chess: {
    displayTitle: "Chess Blitz",
    accent: "#FF9418",
    soft: "#FFF8D9",
    focus: "Strategy practice",
    icon: Trophy,
  },
  "scribble-scrattle": {
    displayTitle: "Scribble Scrattle",
    accent: "#43A8EA",
    soft: "#ECFBFA",
    focus: "Draw and describe",
    icon: Palette,
  },
  "paint-and-guess": {
    displayTitle: "Scribble Scrattle",
    accent: "#43A8EA",
    soft: "#ECFBFA",
    focus: "Draw and describe",
    icon: Palette,
  },
  "trivia-blitz": {
    displayTitle: "Trivia Blitz",
    accent: "#FF3B8D",
    soft: "#FFF1F6",
    focus: "Quick answers",
    icon: Star,
  },
  keetdash: {
    displayTitle: "Keetdash",
    accent: "#762A87",
    soft: "#F7F1FF",
    focus: "Meaning and bluffing",
    icon: Puzzle,
  },
  balderdash: {
    displayTitle: "Keetdash",
    accent: "#762A87",
    soft: "#F7F1FF",
    focus: "Meaning and bluffing",
    icon: Puzzle,
  },
};

const categoryThemeByKey: Record<string, GameTheme> = {
  arcade: {
    accent: "#43A8EA",
    soft: "#ECFBFA",
    focus: "Quick play",
    icon: Gamepad2,
  },
  party: {
    accent: "#FF3B8D",
    soft: "#FFF1F6",
    focus: "Classroom play",
    icon: Users,
  },
  puzzle: {
    accent: "#08AAA7",
    soft: "#ECFBFA",
    focus: "Word skills",
    icon: Puzzle,
  },
  strategy: {
    accent: "#FF9418",
    soft: "#FFF8D9",
    focus: "Strategy practice",
    icon: Trophy,
  },
  trivia: {
    accent: "#762A87",
    soft: "#F7F1FF",
    focus: "Quiz practice",
    icon: Star,
  },
};

const defaultTheme: GameTheme = {
  accent: "#43A8EA",
  soft: "#FBFDFF",
  focus: "English practice",
  icon: Gamepad2,
};

export const Route = createFileRoute("/_authenticated/hub/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(gamesQuery),
  component: LibraryPage,
});

function mergeGames(serverGames: Game[]): Game[] {
  const seen = new Set(serverGames.map((g) => g.slug));
  const merged = [...serverGames];
  for (const local of LOCAL_GAMES) {
    if (!seen.has(local.slug)) {
      merged.push(local.data);
    }
  }
  return merged;
}

function LibraryPage() {
  const { data: serverGames } = useSuspenseQuery(gamesQuery);
  const games = useMemo(() => mergeGames(serverGames), [serverGames]);
  const search = useHubStore((s) => s.search);
  const setSearch = useHubStore((s) => s.setSearch);
  const activeCategory = useHubStore((s) => s.activeCategory);
  const setCategory = useHubStore((s) => s.setCategory);
  const sortMode = useHubStore((s) => s.sortMode);
  const setSortMode = useHubStore((s) => s.setSortMode);
  const recentlyPlayed = useHubStore((s) => s.recentlyPlayed);
  const trackGameVisit = useHubStore((s) => s.trackGameVisit);

  const categories = useMemo(
    () => Array.from(new Set(games.map((g) => g.category))).sort(),
    [games],
  );

  const recentGames = useMemo(
    () => recentlyPlayed.map((slug) => games.find((g) => g.slug === slug)).filter(Boolean) as Game[],
    [recentlyPlayed, games],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = games.filter((game) => {
      const display = getGameDisplay(game);
      const matchesSearch =
        !q ||
        game.title.toLowerCase().includes(q) ||
        display.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortMode === "name-asc") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortMode === "name-desc") result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    else if (sortMode === "recent") {
      result = [...result].sort((a, b) => {
        const ai = recentlyPlayed.indexOf(a.slug);
        const bi = recentlyPlayed.indexOf(b.slug);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
        return 0;
      });
    }

    return result;
  }, [games, search, activeCategory, sortMode, recentlyPlayed]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFDFF] text-[#10204A]">
      <section className="border-b border-[#E8ECF4] bg-[linear-gradient(120deg,#FFF1F6_0%,#FBFDFF_48%,#ECFBFA_100%)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10">
          <div className="max-w-3xl">
            <img
              src="/primkeet-logo.png"
              alt="PrimKeet"
              width={176}
              height={60}
              className="mb-5 h-14 w-auto object-contain"
            />
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#BDECEB] bg-white/80 px-4 py-2 text-sm font-extrabold text-[#087E7D] shadow-sm">
              <Sparkles className="h-4 w-4 fill-[#FFD13B] text-[#FFD13B]" />
              ESL games for class and home
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] text-[#10204A] md:text-5xl">
              Bright games for growing English skills
            </h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#667085] md:text-lg">
              Pick a PrimKeet game, practice words and ideas, then send real scores to the live
              leaderboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatTile
              icon={Gamepad2}
              label="Games ready"
              value={games.length.toString()}
              color="#FF3B8D"
              bg="#FFF1F6"
            />
            <StatTile
              icon={GraduationCap}
              label="Learning styles"
              value={categories.length.toString()}
              color="#08AAA7"
              bg="#ECFBFA"
            />
            <StatTile icon={Trophy} label="Leaderboard" value="Live" color="#FF9418" bg="#FFF8D9" />
          </div>
        </div>
      </section>

      {/* Recently played strip */}
      {recentGames.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-5 pt-6 md:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-[#FF9418]" />
            <h2 className="text-lg font-black text-[#10204A]">Continue playing</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {recentGames.map((game) => (
              <RecentGameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#10204A]">Game library</h2>
            <p className="mt-1 text-sm font-semibold text-[#667085]">
              {filtered.length} of {games.length} games shown
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-96">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
              <Input
                placeholder="Search games"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 rounded-full border-[#D7DEEA] bg-white pl-11 pr-4 text-base font-semibold text-[#10204A] shadow-[0_10px_24px_rgba(16,32,74,0.06)] placeholder:text-[#98A2B3] focus-visible:ring-[#08AAA7]"
              />
            </div>
            <div className="relative flex-shrink-0">
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
                className="h-12 cursor-pointer appearance-none rounded-full border border-[#D7DEEA] bg-white pl-4 pr-10 text-sm font-bold text-[#10204A] shadow-[0_10px_24px_rgba(16,32,74,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08AAA7]"
              >
                <option value="default">Default order</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="recent">Recently played</option>
              </select>
              <ArrowDownUp className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          <CategoryButton active={!activeCategory} onClick={() => setCategory(null)}>
            All games
          </CategoryButton>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              active={activeCategory === category}
              onClick={() => setCategory(category)}
            >
              {formatCategory(category)}
            </CategoryButton>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-[#C8D2E2] bg-white px-6 py-16 text-center">
            <Search className="mx-auto h-9 w-9 text-[#08AAA7]" />
            <h3 className="mt-4 text-xl font-black text-[#10204A]">No games found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm font-semibold text-[#667085]">
              Try another search or category.
            </p>
          </div>
        ) : (
          <Suspense fallback={
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          }>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </Suspense>
        )}
      </section>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="grid min-h-24 grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-white/80 bg-white/86 p-4 shadow-[0_14px_34px_rgba(16,32,74,0.08)] backdrop-blur">
      <span
        className="grid h-12 w-12 place-items-center rounded-lg"
        style={{ backgroundColor: bg }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </span>
      <span className="min-w-0">
        <span className="block text-2xl font-black leading-none text-[#10204A]">{value}</span>
        <span className="mt-1 block text-sm font-bold text-[#667085]">{label}</span>
      </span>
    </div>
  );
}

function CategoryButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full border px-4 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08AAA7] focus-visible:ring-offset-2",
        active
          ? "border-[#FF3B8D] bg-[#FF3B8D] text-white shadow-[0_10px_22px_rgba(255,59,141,0.22)]"
          : "border-[#E8ECF4] bg-white text-[#667085] hover:border-[#08AAA7] hover:text-[#087E7D]",
      )}
    >
      {children}
    </button>
  );
}

function GameCard({ game }: { game: Game }) {
  const [imageFailed, setImageFailed] = useState(false);
  const display = getGameDisplay(game);
  const artwork = getArtworkForGame(game);
  const hasArtwork = Boolean(artwork && !imageFailed);
  const route = PORTED_ROUTES[game.slug];
  const Icon = display.icon;
  const trackGameVisit = useHubStore((s) => s.trackGameVisit);

  const handleClick = () => trackGameVisit(game.slug);

  const content = (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#E8ECF4] bg-white shadow-[0_14px_34px_rgba(16,32,74,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#BDECEB] hover:shadow-[0_20px_42px_rgba(16,32,74,0.12)]">
      <div className="p-3" style={{ backgroundColor: display.soft }}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-white/70">
          {hasArtwork ? (
            <img
              src={artwork ?? undefined}
              alt={`${display.title} card artwork`}
              loading="lazy"
              className="h-full w-full object-contain"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <ArtworkFallback display={display} />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-extrabold"
            style={{ backgroundColor: display.soft, color: display.accent }}
          >
            <Icon className="h-3.5 w-3.5" />
            {display.focus}
          </span>
          <span className="inline-flex h-8 items-center rounded-full bg-[#F4F7FB] px-3 text-xs font-extrabold text-[#667085]">
            {display.category}
          </span>
        </div>

        <h3 className="text-2xl font-black leading-tight text-[#10204A]">{display.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[#667085]">
          {display.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <span className="text-xs font-bold text-[#98A2B3]">/{game.slug}</span>
          <span className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#10204A] px-5 text-sm font-extrabold text-white transition group-hover:bg-[#FF3B8D]">
            Play
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );

  if (route) {
    return (
      <Link
        to={route as any}
        onClick={handleClick}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08AAA7] focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      to="/hub/games/$slug"
      params={{ slug: game.slug } as any}
      onClick={handleClick}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08AAA7] focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}

function RecentGameCard({ game }: { game: Game }) {
  const display = getGameDisplay(game);
  const route = PORTED_ROUTES[game.slug];
  const trackGameVisit = useHubStore((s) => s.trackGameVisit);
  const Icon = display.icon;

  const content = (
    <div className="group flex flex-col rounded-lg border border-[#E8ECF4] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#BDECEB]">
      <span
        className="mb-2 grid h-8 w-8 place-items-center rounded-lg"
        style={{ backgroundColor: display.soft }}
      >
        <Icon className="h-4 w-4" style={{ color: display.accent }} />
      </span>
      <p className="truncate text-sm font-black text-[#10204A]">{display.title}</p>
    </div>
  );

  const linkTo = route ?? "/hub/games/$slug";
  const linkParams = route ? undefined : { slug: game.slug };

  return (
    <Link
      to={linkTo as any}
      params={linkParams as any}
      onClick={() => trackGameVisit(game.slug)}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08AAA7] focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}

function GameCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#E8ECF4] bg-white">
      <div className="p-3">
        <Skeleton className="aspect-[4/5] w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-end justify-between pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ArtworkFallback({ display }: { display: GameDisplay }) {
  const Icon = display.icon;

  return (
    <div
      className="flex h-full flex-col items-center justify-center px-5 text-center"
      style={{ backgroundColor: display.soft }}
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
        <Icon className="h-8 w-8" style={{ color: display.accent }} />
      </span>
      <p className="mt-4 text-xl font-black leading-tight text-[#10204A]">{display.title}</p>
      <p className="mt-2 text-sm font-bold text-[#667085]">Card artwork coming soon</p>
    </div>
  );
}

function getArtworkForGame(game: Game) {
  return gameArtworkBySlug[normalizeKey(game.slug)] ?? game.thumbnail_url ?? null;
}

function getGameDisplay(game: Game): GameDisplay {
  const slugTheme = gameThemeBySlug[normalizeKey(game.slug)];
  const categoryTheme = categoryThemeByKey[normalizeKey(game.category)];
  const theme = slugTheme ?? categoryTheme ?? defaultTheme;

  return {
    title: theme.displayTitle ?? game.title,
    description: game.description,
    category: formatCategory(game.category),
    accent: theme.accent,
    soft: theme.soft,
    focus: theme.focus,
    icon: theme.icon,
  };
}

function normalizeKey(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function formatCategory(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
