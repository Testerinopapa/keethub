import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Check, Dumbbell, Lock, Star, Trophy, Zap } from "lucide-react";
import type { Tile, TileType } from "../types";
import { useAcademyStore } from "../store";
import { getTileStatus } from "../data/curriculum";
import { cn } from "@/lib/utils";

const tileIcons: Record<TileType, typeof Star> = {
  star: Star,
  book: BookOpen,
  dumbbell: Dumbbell,
  trophy: Trophy,
  treasure: Star,
  "fast-forward": Zap,
};

export function TileNode({ tile }: { tile: Tile }) {
  const completedTiles = useAcademyStore((s) => s.completedTiles);
  const startLesson = useAcademyStore((s) => s.startLesson);
  const navigate = useNavigate();
  const status = getTileStatus(tile.id, completedTiles);
  const Icon = tileIcons[tile.type];
  const isComplete = status === "COMPLETE";
  const isLocked = status === "LOCKED";

  const handleClick = () => {
    if (isLocked) return;
    startLesson("unit-1", tile.id);
    navigate({ to: "/hub/academy/lesson" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLocked}
      className={cn(
        "relative z-10 flex min-h-[98px] w-full items-center rounded-[25px] bg-white px-4 text-left shadow-[0_8px_18px_rgba(16,32,74,0.10)] transition md:w-[290px]",
        !isLocked && "hover:-translate-y-1 hover:shadow-[0_12px_22px_rgba(16,32,74,0.15)]",
        isLocked && "cursor-not-allowed opacity-85",
      )}
    >
      <span
        className={cn(
          "relative -ml-10 mr-5 grid h-[105px] w-[105px] shrink-0 place-items-center rounded-full border-[7px] bg-white shadow-[0_7px_12px_rgba(16,32,74,0.14)]",
          isComplete && "border-[#FFC515] text-white",
          status === "ACTIVE" && "border-[#57C900] text-white",
          isLocked && "border-[#DDE0E7] text-[#65718A]",
        )}
      >
        <span
          className={cn(
            "grid h-[78px] w-[78px] place-items-center rounded-full",
            isComplete && "bg-[#FFC515]",
            status === "ACTIVE" && "bg-[#57C900]",
            isLocked && "bg-[#E9EBF1]",
          )}
        >
          {isComplete ? (
            <Check className="h-10 w-10" strokeWidth={3} />
          ) : isLocked ? (
            <Lock className="h-9 w-9" strokeWidth={2.5} />
          ) : (
            <Icon className="h-10 w-10" strokeWidth={2.5} />
          )}
        </span>
        {status === "ACTIVE" && (
          <span className="absolute -right-1 -top-2 grid h-9 w-9 place-items-center rounded-full bg-[#FF5D91] text-lg font-black text-white shadow-sm">
            1
          </span>
        )}
        {isComplete && (
          <span className="absolute -right-1 -top-2 grid h-8 w-8 place-items-center rounded-full bg-[#55C900] text-white">
            <Check className="h-5 w-5" strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="min-w-0 pr-1">
        <span className="block text-base font-black text-[#10204A]">{tile.title}</span>
        <span
          className={cn(
            "mt-1 block text-sm font-bold",
            isComplete
              ? "text-[#60708D]"
              : status === "ACTIVE"
                ? "text-[#51B900]"
                : "text-[#60708D]",
          )}
        >
          {isComplete ? "Completed" : status === "ACTIVE" ? "In Progress" : "Locked"}
        </span>
      </span>
    </button>
  );
}
