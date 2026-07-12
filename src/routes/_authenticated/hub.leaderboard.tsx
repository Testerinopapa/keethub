import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Gift,
  Home,
  MessageCircle,
  Sparkles,
  Star,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { getDiceBearAvatarUrlFromSeed } from "@/lib/avatar/dicebear/api";

type NavItem = {
  label: string;
  icon: LucideIcon;
  to?: "/hub" | "/hub/leaderboard";
  active?: boolean;
};

type Winner = {
  rank: 1 | 2 | 3;
  name: string;
  points: number;
  label: string;
  seed: string;
  cardClass: string;
  frameClass: string;
  medalClass: string;
  labelClass: string;
  orderClass: string;
  elevated?: boolean;
};

type LeaderboardRow = {
  rank: number;
  name: string;
  achievement?: string;
  streak: number;
  points: number;
  seed: string;
  avatarClass: string;
};

type DateRange = {
  label: string;
  boost: number;
  note: string;
};

const navItems: NavItem[] = [
  { label: "Home", icon: Home, to: "/hub" },
  { label: "Community", icon: UsersRound },
  { label: "Leaderboard", icon: Trophy, to: "/hub/leaderboard", active: true },
  { label: "Messages", icon: MessageCircle },
  { label: "Rewards", icon: Gift },
];

const winners: Winner[] = [
  {
    rank: 2,
    name: "Liam Carter",
    points: 4820,
    label: "Great effort!",
    seed: "Liam Carter",
    cardClass:
      "border-[#c9c8ff] bg-[linear-gradient(145deg,#f5f3ff,#eef5ff)] shadow-[0_18px_44px_rgba(143,134,226,0.22)]",
    frameClass: "border-[#c4c7ff] bg-[linear-gradient(145deg,#e9e9ff,#f4f8ff)]",
    medalClass: "border-[#b8bbff] bg-[linear-gradient(145deg,#f0efff,#d8dcff)] text-[#615fc6]",
    labelClass: "border-[#bbb7ff] bg-[#ecebff] text-[#4e48c5]",
    orderClass: "md:order-1 md:mt-14",
  },
  {
    rank: 1,
    name: "Sophia Martinez",
    points: 6540,
    label: "Unstoppable! 👑",
    seed: "Sophia Martinez",
    cardClass:
      "border-[#ffd889] bg-[linear-gradient(145deg,#fff8df,#fff0bd)] shadow-[0_24px_58px_rgba(240,174,60,0.28)]",
    frameClass: "border-[#f7bf42] bg-[linear-gradient(145deg,#fff3bd,#fffaf0)]",
    medalClass: "border-[#e7a92d] bg-[linear-gradient(145deg,#fff2a8,#ffc94b)] text-[#9a5b00]",
    labelClass: "border-[#f4bd46] bg-[#fff0ba] text-[#9a4e08]",
    orderClass: "md:order-2",
    elevated: true,
  },
  {
    rank: 3,
    name: "Olivia Brown",
    points: 3920,
    label: "Keep it up! 💖",
    seed: "Olivia Brown",
    cardClass:
      "border-[#ffc1bb] bg-[linear-gradient(145deg,#fff4ed,#ffe8ee)] shadow-[0_18px_44px_rgba(242,146,156,0.2)]",
    frameClass: "border-[#ffb5af] bg-[linear-gradient(145deg,#ffe7df,#fff4f7)]",
    medalClass: "border-[#ffb09b] bg-[linear-gradient(145deg,#ffd6be,#ff9f7b)] text-[#9c4523]",
    labelClass: "border-[#ffb2b9] bg-[#ffe1e8] text-[#ba2f55]",
    orderClass: "md:order-3 md:mt-20",
  },
];

const leaderboardRows: LeaderboardRow[] = [
  {
    rank: 4,
    name: "Ava Johnson",
    achievement: "Rising Star",
    streak: 12,
    points: 3250,
    seed: "Ava Johnson",
    avatarClass: "bg-[#efe7ff]",
  },
  {
    rank: 5,
    name: "Noah Williams",
    streak: 9,
    points: 2980,
    seed: "Noah Williams",
    avatarClass: "bg-[#f7eadf]",
  },
  {
    rank: 6,
    name: "Emma Davis",
    achievement: "Team Player",
    streak: 7,
    points: 2760,
    seed: "Emma Davis",
    avatarClass: "bg-[#dff6ef]",
  },
  {
    rank: 7,
    name: "James Taylor",
    streak: 6,
    points: 2430,
    seed: "James Taylor",
    avatarClass: "bg-[#e7f1ff]",
  },
  {
    rank: 8,
    name: "Isabella Anderson",
    streak: 5,
    points: 2210,
    seed: "Isabella Anderson",
    avatarClass: "bg-[#f4e8ff]",
  },
  {
    rank: 9,
    name: "Ethan Thomas",
    streak: 4,
    points: 1980,
    seed: "Ethan Thomas",
    avatarClass: "bg-[#eaf7dc]",
  },
  {
    rank: 10,
    name: "Mia White",
    streak: 3,
    points: 1750,
    seed: "Mia White",
    avatarClass: "bg-[#ffe6ef]",
  },
];

const confetti = [
  { left: "8%", top: "18%", color: "#ff9fc7", rotate: "-18deg" },
  { left: "22%", top: "7%", color: "#c69aff", rotate: "28deg" },
  { left: "47%", top: "16%", color: "#ffd35c", rotate: "12deg" },
  { left: "61%", top: "8%", color: "#ffb4d3", rotate: "-34deg" },
  { left: "76%", top: "18%", color: "#9ed8ff", rotate: "21deg" },
  { left: "91%", top: "9%", color: "#ffd56b", rotate: "-18deg" },
];

const dateRanges: DateRange[] = [
  {
    label: "May 12 – May 18, 2025",
    boost: 1,
    note: "Current weekly sprint",
  },
  {
    label: "May 5 – May 11, 2025",
    boost: 0.92,
    note: "Previous week",
  },
  {
    label: "Apr 28 – May 4, 2025",
    boost: 0.86,
    note: "Archived standings",
  },
];

export const Route = createFileRoute("/_authenticated/hub/leaderboard")({
  head: () => ({
    meta: [
      { title: "Weekly Ranking — GameHub" },
      {
        name: "description",
        content: "A polished weekly ranking dashboard for GameHub.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState(4);
  const [notice, setNotice] = useState("Leaderboard mode is active");
  const selectedRange = dateRanges[selectedRangeIndex] ?? dateRanges[0];

  const adjustedWinners = useMemo(
    () =>
      winners.map((winner) => ({
        ...winner,
        points: applyRangeBoost(winner.points, selectedRange.boost),
      })),
    [selectedRange.boost],
  );

  const adjustedRows = useMemo(
    () =>
      leaderboardRows.map((row) => ({
        ...row,
        points: applyRangeBoost(row.points, selectedRange.boost),
      })),
    [selectedRange.boost],
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#fffaf6] text-[#201447]">
      <LeaderboardMotionStyles />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(207,180,255,0.34),transparent_30%),radial-gradient(circle_at_88%_32%,rgba(255,188,219,0.28),transparent_24%),radial-gradient(circle_at_32%_96%,rgba(255,220,238,0.38),transparent_28%)]" />
      <div className="relative mx-auto flex w-full max-w-[1120px] gap-5 px-4 py-6 sm:px-6 lg:min-h-[1280px] lg:py-8">
        <DashboardSidebar onNotice={setNotice} />

        <section className="leaderboard-reveal relative flex-1 overflow-hidden rounded-[34px] border border-white/80 bg-white/55 px-5 py-6 shadow-[0_28px_80px_rgba(109,88,155,0.16)] backdrop-blur-xl sm:px-7 md:px-9">
          <DecorativeTrophy />
          <Header
            notice={notice}
            rangeMenuOpen={rangeMenuOpen}
            selectedRange={selectedRange}
            selectedRangeIndex={selectedRangeIndex}
            onRangeMenuOpenChange={setRangeMenuOpen}
            onRangeSelect={(index) => {
              setSelectedRangeIndex(index);
              setRangeMenuOpen(false);
              setNotice(`${dateRanges[index]?.note ?? "Week"} loaded`);
            }}
          />
          <Podium winners={adjustedWinners} />
          <LeaderboardTable
            rows={adjustedRows}
            selectedRank={selectedRank}
            selectedRange={selectedRange}
            onSelectRow={(rank) => {
              setSelectedRank(rank);
              const selected = adjustedRows.find((row) => row.rank === rank);
              if (selected) setNotice(`${selected.name} selected`);
            }}
          />
          <FooterBanner selectedRange={selectedRange} />
        </section>
      </div>
    </div>
  );
}

function DashboardSidebar({ onNotice }: { onNotice: (message: string) => void }) {
  return (
    <aside className="leaderboard-reveal hidden w-[128px] shrink-0 rounded-[32px] border border-white/80 bg-white/62 px-3 py-6 shadow-[0_24px_60px_rgba(118,97,160,0.16)] backdrop-blur-xl sm:flex sm:flex-col sm:items-center">
      <nav className="flex w-full flex-1 flex-col items-center gap-5">
        {navItems.map((item) => (
          <NavButton key={item.label} item={item} onNotice={onNotice} />
        ))}
      </nav>

      <div className="mb-8 w-full rounded-[24px] border border-[#eadcff] bg-white/65 px-3 py-4 text-center shadow-[0_16px_32px_rgba(138,112,199,0.18)] transition-transform duration-300 hover:-translate-y-1">
        <div className="leaderboard-glow mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(145deg,#fff1a9,#ffc94c)] shadow-[0_10px_22px_rgba(255,194,58,0.28)]">
          <Star className="h-7 w-7 fill-white text-white" />
        </div>
        <p className="text-2xl font-black text-[#6741d9]">
          <AnimatedPoints value={2450} />
        </p>
        <p className="text-sm font-medium text-[#4c4280]">Your Points</p>
      </div>

      <div className="relative h-16 w-16 rounded-full border-4 border-white bg-[#f5ecff] shadow-[0_14px_28px_rgba(92,71,152,0.2)]">
        <img
          src={getDiceBearAvatarUrlFromSeed("current-player")}
          alt="Player avatar"
          className="h-full w-full rounded-full object-cover"
        />
        <span className="absolute bottom-1 right-0 h-4 w-4 rounded-full border-2 border-white bg-[#42d85b] shadow-[0_0_0_5px_rgba(66,216,91,0.18)]" />
      </div>
    </aside>
  );
}

function NavButton({ item, onNotice }: { item: NavItem; onNotice: (message: string) => void }) {
  const content = (
    <>
      <span
        className={`grid h-14 w-14 place-items-center rounded-[20px] border transition ${
          item.active
            ? "border-[#8d65ef] bg-[linear-gradient(145deg,#a779ff,#7650df)] text-white shadow-[0_16px_28px_rgba(112,75,214,0.34)]"
            : "border-[#eee8fb] bg-white/78 text-[#5d5a91] shadow-[0_10px_24px_rgba(118,107,164,0.12)] group-hover:-translate-y-1 group-hover:text-[#7650df]"
        }`}
      >
        <item.icon className="h-7 w-7" />
      </span>
      <span className={`text-sm font-medium ${item.active ? "text-[#6741d9]" : "text-[#4e4a7d]"}`}>
        {item.label}
      </span>
    </>
  );

  const className = "group flex w-full flex-col items-center gap-2";

  if (item.to) {
    return (
      <Link to={item.to} className={className} onClick={() => onNotice(`${item.label} opened`)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={item.label}
      onClick={() => onNotice(`${item.label} is coming soon`)}
    >
      {content}
    </button>
  );
}

function Header({
  notice,
  rangeMenuOpen,
  selectedRange,
  selectedRangeIndex,
  onRangeMenuOpenChange,
  onRangeSelect,
}: {
  notice: string;
  rangeMenuOpen: boolean;
  selectedRange: DateRange;
  selectedRangeIndex: number;
  onRangeMenuOpenChange: (open: boolean) => void;
  onRangeSelect: (index: number) => void;
}) {
  return (
    <header className="relative z-10 mb-8 pr-0 md:mb-10 md:pr-80">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-bold text-[#7254d4] shadow-[0_10px_24px_rgba(114,84,212,0.12)] backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-[#42d85b] shadow-[0_0_0_5px_rgba(66,216,91,0.18)]" />
        {notice}
      </div>
      <h1 className="leaderboard-title text-5xl font-black leading-tight text-[#171042] sm:text-6xl">
        Weekly Ranking
      </h1>
      <p className="mt-2 text-xl font-medium text-[#625b92]">Compete, climb, and shine! ✨</p>
      <div className="relative mt-7 inline-block">
        <button
          type="button"
          className="inline-flex items-center gap-3 rounded-[20px] border border-[#ded6fb] bg-white/78 px-6 py-3 text-lg font-semibold text-[#423d78] shadow-[0_12px_28px_rgba(108,93,170,0.14)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#bfaeff] hover:shadow-[0_16px_34px_rgba(108,93,170,0.18)]"
          aria-expanded={rangeMenuOpen}
          aria-haspopup="menu"
          onClick={() => onRangeMenuOpenChange(!rangeMenuOpen)}
        >
          <CalendarDays className="h-5 w-5 text-[#6f5ad8]" />
          <span>{selectedRange.label}</span>
          <ChevronDown
            className={`h-5 w-5 text-[#6f5ad8] transition-transform ${
              rangeMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {rangeMenuOpen ? (
          <div
            className="leaderboard-pop absolute left-0 top-[calc(100%+10px)] z-40 w-[310px] rounded-[24px] border border-white/80 bg-white/90 p-2 shadow-[0_24px_54px_rgba(99,75,157,0.2)] backdrop-blur-xl"
            role="menu"
          >
            {dateRanges.map((range, index) => (
              <button
                key={range.label}
                type="button"
                className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left transition ${
                  index === selectedRangeIndex
                    ? "bg-[#f1ebff] text-[#6245d2]"
                    : "text-[#50497d] hover:bg-[#faf7ff]"
                }`}
                role="menuitem"
                onClick={() => onRangeSelect(index)}
              >
                <span>
                  <span className="block text-sm font-black">{range.label}</span>
                  <span className="block text-xs font-semibold opacity-70">{range.note}</span>
                </span>
                {index === selectedRangeIndex ? (
                  <Star className="h-5 w-5 fill-[#ffc83f] text-[#f5a914]" />
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function DecorativeTrophy() {
  return (
    <div className="pointer-events-none absolute right-5 top-5 z-0 hidden h-72 w-80 md:block">
      {confetti.map((piece, index) => (
        <span
          key={`${piece.left}-${piece.top}`}
          className="leaderboard-confetti absolute h-3 w-7 rounded-full opacity-80 shadow-sm"
          style={{
            left: piece.left,
            top: piece.top,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotate})`,
            animationDelay: `${index * 180}ms`,
          }}
        />
      ))}
      <Sparkles className="leaderboard-sparkle absolute left-8 top-14 h-8 w-8 fill-[#ffd15a] text-[#ffd15a]" />
      <Sparkles className="leaderboard-sparkle absolute right-2 top-8 h-9 w-9 fill-[#ffe071] text-[#ffe071]" />
      <Sparkles className="leaderboard-sparkle absolute bottom-20 left-1 h-7 w-7 fill-[#ffcf5d] text-[#ffcf5d]" />

      <div className="absolute bottom-0 right-2 h-16 w-56 rounded-[50%] bg-[#c7b1ff] opacity-55 blur-sm" />
      <div className="absolute bottom-3 right-12 h-12 w-44 rounded-[50%] bg-[linear-gradient(180deg,#dcccff,#b99ef2)] shadow-[0_14px_30px_rgba(132,99,209,0.24)]" />
      <div className="absolute bottom-11 right-24 h-10 w-20 rounded-b-[22px] bg-[linear-gradient(180deg,#b99cf1,#9572db)]" />
      <div className="leaderboard-trophy absolute right-[68px] top-[68px] grid h-36 w-40 place-items-center rounded-b-[48px] rounded-t-[62px] bg-[linear-gradient(145deg,#e6d5ff,#9d7be6_72%)] shadow-[inset_12px_10px_18px_rgba(255,255,255,0.35),0_22px_42px_rgba(109,79,190,0.32)]">
        <Star className="h-16 w-16 fill-[#ffc94f] text-[#f3a922] drop-shadow-[0_5px_7px_rgba(155,99,0,0.22)]" />
      </div>
      <div className="absolute right-8 top-24 h-20 w-14 rounded-r-full border-[12px] border-l-0 border-[#a386e7]" />
      <div className="absolute right-[236px] top-24 h-20 w-14 rounded-l-full border-[12px] border-r-0 border-[#b99ff0]" />
    </div>
  );
}

function Podium({ winners }: { winners: Winner[] }) {
  return (
    <section className="relative z-10 mb-7 grid grid-cols-1 gap-5 md:grid-cols-3 md:items-start">
      {winners.map((winner, index) => (
        <WinnerCard key={winner.rank} winner={winner} index={index} />
      ))}
    </section>
  );
}

function WinnerCard({ winner, index }: { winner: Winner; index: number }) {
  return (
    <article
      className={`${winner.orderClass} ${winner.cardClass} leaderboard-card group relative rounded-[32px] border p-5 text-center transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(95,72,140,0.24)] ${
        winner.elevated ? "min-h-[430px] md:scale-[1.04]" : "min-h-[360px]"
      }`}
      style={{ animationDelay: `${160 + index * 90}ms` }}
    >
      {winner.rank === 1 ? (
        <Crown className="leaderboard-crown absolute left-1/2 top-[-30px] h-16 w-24 -translate-x-1/2" />
      ) : null}

      <div
        className={`${winner.medalClass} leaderboard-medal absolute left-5 top-5 grid h-16 w-16 place-items-center rounded-full border-2 text-3xl font-black shadow-[0_10px_20px_rgba(102,73,151,0.18)]`}
      >
        {winner.rank}
      </div>

      <div
        className={`${winner.frameClass} mx-auto mt-8 grid ${
          winner.elevated ? "h-44 w-44" : "h-36 w-36"
        } place-items-center rounded-full border-4 p-2 shadow-[inset_0_0_0_6px_rgba(255,255,255,0.52),0_16px_32px_rgba(99,76,139,0.18)]`}
      >
        <img
          src={getDiceBearAvatarUrlFromSeed(winner.seed)}
          alt={`${winner.name} avatar`}
          className="h-full w-full rounded-full object-cover drop-shadow-[0_14px_18px_rgba(75,55,111,0.18)] transition duration-500 group-hover:scale-105"
        />
      </div>

      <h2 className="mt-6 text-2xl font-black text-[#16113b]">{winner.name}</h2>
      <div className="mt-3 flex items-center justify-center gap-2 text-xl font-black text-[#1f1a4d]">
        <Star className="h-7 w-7 fill-[#ffc83f] text-[#f5a914]" />
        <span>
          <AnimatedPoints value={winner.points} /> pts
        </span>
      </div>
      <div
        className={`${winner.labelClass} mx-auto mt-6 inline-flex rounded-[18px] border px-7 py-3 text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`}
      >
        {winner.label}
      </div>
    </article>
  );
}

function LeaderboardTable({
  rows,
  selectedRank,
  selectedRange,
  onSelectRow,
}: {
  rows: LeaderboardRow[];
  selectedRank: number;
  selectedRange: DateRange;
  onSelectRow: (rank: number) => void;
}) {
  const selectedRow = rows.find((row) => row.rank === selectedRank) ?? rows[0];

  return (
    <section className="leaderboard-table relative z-10 rounded-[30px] border border-white bg-white/88 px-5 py-5 shadow-[0_24px_54px_rgba(94,79,139,0.14)]">
      <div className="mb-4 flex flex-col gap-3 rounded-[22px] border border-[#eee7ff] bg-[linear-gradient(105deg,#faf7ff,#fff7fb)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8b78d8]">
            Selected player
          </p>
          <p className="mt-1 text-xl font-black text-[#17123d]">
            {selectedRow?.name ?? "Ava Johnson"} · Rank {selectedRow?.rank ?? 4}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm font-bold text-[#615a91]">
          <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">{selectedRange.note}</span>
          <span className="rounded-full bg-[#fff0ba] px-3 py-2 text-[#9a4e08] shadow-sm">
            🔥 {selectedRow?.streak ?? 12} streak
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[76px_minmax(0,1fr)_150px_34px] items-center border-b border-[#e9e3f5] px-3 pb-4 text-base font-bold text-[#4b467d]">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">Points</span>
            <span />
          </div>

          <div className="relative">
            <div
              className="max-h-[560px] divide-y divide-[#eee8f5] overflow-y-auto pr-3"
              style={{
                scrollbarColor: "#b9aae7 #ece7f8",
                scrollbarWidth: "thin",
              }}
            >
              {rows.map((row, index) => (
                <LeaderboardTableRow
                  key={row.rank}
                  index={index}
                  row={row}
                  selected={row.rank === selectedRank}
                  onSelect={() => onSelectRow(row.rank)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderboardTableRow({
  row,
  index,
  selected,
  onSelect,
}: {
  row: LeaderboardRow;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`leaderboard-row grid w-full grid-cols-[76px_minmax(0,1fr)_150px_34px] items-center gap-0 rounded-[22px] px-3 py-4 text-left transition duration-300 hover:bg-[#faf7ff] ${
        selected ? "bg-[#f4efff] shadow-[inset_0_0_0_1px_rgba(130,94,226,0.16)]" : ""
      }`}
      style={{ animationDelay: `${360 + index * 55}ms` }}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="text-3xl font-black text-[#655fba]">{row.rank}</span>
      <div className="flex min-w-0 items-center gap-4">
        <div
          className={`${row.avatarClass} h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-[0_10px_20px_rgba(82,67,125,0.15)] transition duration-300 ${
            selected ? "scale-110" : ""
          }`}
        >
          <img
            src={getDiceBearAvatarUrlFromSeed(row.seed)}
            alt={`${row.name} avatar`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-black text-[#17123d]">{row.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#514c7d]">
            {row.achievement ? (
              <span className="rounded-full bg-[#ebe6ff] px-3 py-1 text-[#6554cb]">
                {row.achievement}
              </span>
            ) : null}
            <span>🔥 {row.streak}</span>
          </div>
        </div>
      </div>
      <span className="text-right text-xl font-bold text-[#39336f]">
        <AnimatedPoints value={row.points} /> pts
      </span>
      <span
        className={`ml-auto grid h-9 w-9 place-items-center rounded-full text-[#6d57d7] transition ${
          selected ? "bg-white shadow-sm" : "hover:bg-[#f0ebff]"
        }`}
        aria-hidden="true"
      >
        <ChevronRight className={`h-7 w-7 transition ${selected ? "translate-x-0.5" : ""}`} />
      </span>
    </button>
  );
}

function FooterBanner({ selectedRange }: { selectedRange: DateRange }) {
  return (
    <div className="leaderboard-footer relative z-10 mt-7 flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[#dbcaf9] bg-[linear-gradient(100deg,#ffe8f0,#f4e9ff_48%,#eef1ff)] bg-[length:180%_180%] px-6 py-7 text-center text-2xl font-black text-[#694fc0] shadow-[0_18px_44px_rgba(148,112,197,0.16)] sm:flex-row sm:gap-5">
      <Star className="leaderboard-spin h-10 w-10 text-[#7c55d8]" />
      <span>☆ Climb the ranks and become a legend! 🌟</span>
      <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-[#6d5bb4]">
        {selectedRange.label}
      </span>
      <Star className="leaderboard-spin h-10 w-10 fill-[#ffd257] text-[#f3ad22]" />
      <Sparkles className="absolute right-8 top-4 h-5 w-5 fill-white text-white" />
      <Sparkles className="absolute left-8 bottom-5 h-4 w-4 fill-white text-white" />
    </div>
  );
}

function AnimatedPoints({ value }: { value: number }) {
  return (
    <span key={value} className="leaderboard-number tabular-nums">
      {formatPoints(value)}
    </span>
  );
}

function applyRangeBoost(points: number, boost: number) {
  return Math.round(points * boost);
}

function formatPoints(points: number) {
  return points.toLocaleString("en-US");
}

function LeaderboardMotionStyles() {
  return (
    <style>
      {`
        @keyframes leaderboard-fade-up {
          from {
            opacity: 0;
            translate: 0 18px;
            scale: 0.98;
          }
          to {
            opacity: 1;
            translate: 0 0;
            scale: 1;
          }
        }

        @keyframes leaderboard-pop {
          from {
            opacity: 0;
            translate: 0 -8px;
            scale: 0.96;
          }
          to {
            opacity: 1;
            translate: 0 0;
            scale: 1;
          }
        }

        @keyframes leaderboard-float {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }

        @keyframes leaderboard-crown-float {
          0%, 100% {
            transform: translateX(-50%) translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateX(-50%) translateY(-8px) rotate(1deg);
          }
        }

        @keyframes leaderboard-sparkle {
          0%, 100% {
            opacity: 0.72;
            transform: scale(0.92) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.14) rotate(12deg);
          }
        }

        @keyframes leaderboard-confetti {
          0%, 100% {
            translate: 0 0;
          }
          50% {
            translate: 0 -8px;
          }
        }

        @keyframes leaderboard-glow {
          0%, 100% {
            box-shadow: 0 10px 22px rgba(255, 194, 58, 0.28);
          }
          50% {
            box-shadow: 0 10px 30px rgba(255, 194, 58, 0.46);
          }
        }

        @keyframes leaderboard-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes leaderboard-number {
          from {
            translate: 0 6px;
            opacity: 0;
          }
          to {
            translate: 0 0;
            opacity: 1;
          }
        }

        .leaderboard-reveal,
        .leaderboard-card,
        .leaderboard-table,
        .leaderboard-row {
          animation: leaderboard-fade-up 620ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .leaderboard-pop {
          animation: leaderboard-pop 180ms ease-out both;
        }

        .leaderboard-trophy {
          animation: leaderboard-float 4.6s ease-in-out infinite;
        }

        .leaderboard-crown {
          animation: leaderboard-crown-float 4.2s ease-in-out infinite;
        }

        .leaderboard-sparkle {
          animation: leaderboard-sparkle 2.5s ease-in-out infinite;
        }

        .leaderboard-confetti {
          animation: leaderboard-confetti 3.2s ease-in-out infinite;
        }

        .leaderboard-glow,
        .leaderboard-medal {
          animation: leaderboard-glow 2.8s ease-in-out infinite;
        }

        .leaderboard-footer {
          animation: leaderboard-shimmer 7s ease-in-out infinite;
        }

        .leaderboard-number {
          display: inline-block;
          animation: leaderboard-number 260ms ease-out both;
        }

        .leaderboard-spin {
          transition: transform 360ms ease;
        }

        .leaderboard-footer:hover .leaderboard-spin {
          transform: rotate(18deg) scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .leaderboard-reveal,
          .leaderboard-card,
          .leaderboard-table,
          .leaderboard-row,
          .leaderboard-pop,
          .leaderboard-trophy,
          .leaderboard-crown,
          .leaderboard-sparkle,
          .leaderboard-confetti,
          .leaderboard-glow,
          .leaderboard-medal,
          .leaderboard-footer,
          .leaderboard-number {
            animation: none;
          }
        }
      `}
    </style>
  );
}

function Crown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" className={className} role="img">
      <path
        d="M16 58L28 24l24 24 18-34 19 34 24-24 11 34H16z"
        fill="url(#crownGradient)"
        stroke="#e4a321"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect
        x="20"
        y="56"
        width="80"
        height="14"
        rx="7"
        fill="#ffc946"
        stroke="#e4a321"
        strokeWidth="4"
      />
      <defs>
        <linearGradient id="crownGradient" x1="22" x2="92" y1="18" y2="68">
          <stop stopColor="#fff39b" />
          <stop offset="0.54" stopColor="#ffc94b" />
          <stop offset="1" stopColor="#f4a51d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
