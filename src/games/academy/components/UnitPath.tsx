import { BookOpen, CheckSquare, GraduationCap, LayoutGrid } from "lucide-react";
import { UNITS } from "../data/curriculum";
import { useAcademyStore } from "../store";
import { UnitSection } from "./UnitSection";

const decorations = [
  "left-[4%] top-12 text-[#52D4D5]",
  "left-[13%] top-[24%] text-[#FFDB66]",
  "right-[9%] top-20 text-[#FF879F]",
  "right-[20%] top-[29%] text-[#B374F0]",
  "left-[8%] bottom-[24%] text-[#FF89AB]",
  "right-[10%] bottom-[20%] text-[#54D7D5]",
];

export function UnitPath() {
  const completedTiles = useAcademyStore((s) => s.completedTiles);
  const totalLessonsCompleted = useAcademyStore((s) => s.totalLessonsCompleted);

  const stats = [
    {
      label: "Lessons done",
      value: totalLessonsCompleted,
      Icon: CheckSquare,
      tone: "bg-[#E4FAF7] text-[#09B8B2]",
    },
    {
      label: "Tiles complete",
      value: completedTiles.length,
      Icon: LayoutGrid,
      tone: "bg-[#FFF0F6] text-[#FF4E91]",
    },
    { label: "Units", value: UNITS.length, Icon: BookOpen, tone: "bg-[#F2ECFF] text-[#9459EB]" },
  ];

  return (
    <div className="relative isolate min-h-[calc(100vh-88px)] overflow-hidden bg-[#FFFEFC] px-4 py-9 sm:px-8 lg:py-10">
      <div
        aria-hidden
        className="absolute -bottom-16 -left-14 h-48 w-72 rounded-tr-[110px] bg-[#F0E9FF]/75"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -right-10 h-44 w-72 rounded-tl-[120px] bg-[#DFF8F6]/85"
      />
      <div
        aria-hidden
        className="absolute left-0 top-[36%] h-24 w-32 rounded-tr-[80px] bg-[#F4F0FF]/80"
      />
      {decorations.map((position, index) => (
        <span key={position} aria-hidden className={`absolute z-0 text-xl ${position}`}>
          {index % 3 === 0 ? "✦" : index % 3 === 1 ? "●" : "✿"}
        </span>
      ))}

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mx-auto max-w-[850px]">
          <div className="flex items-center justify-center gap-5 text-left">
            <span className="grid h-[94px] w-[94px] shrink-0 place-items-center rounded-full bg-white text-[#08B6B1] shadow-[0_8px_24px_rgba(8,170,167,0.17)] ring-1 ring-[#E3F4F3]">
              <GraduationCap className="h-11 w-11" strokeWidth={2.4} />
            </span>
            <div>
              <h1 className="text-4xl font-black tracking-[-0.045em] text-[#10204A] sm:text-6xl">
                Academy
              </h1>
              <p className="mt-1 text-base font-bold text-[#60708D] sm:text-lg">
                Build skills with structured lessons
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {stats.map(({ label, value, Icon, tone }) => (
              <div
                key={label}
                className="flex min-h-[114px] items-center gap-5 rounded-[25px] border border-[#E9EDF4] bg-white px-6 shadow-[0_9px_20px_rgba(16,32,74,0.08)]"
              >
                <span className={`grid h-[66px] w-[66px] place-items-center rounded-full ${tone}`}>
                  <Icon className="h-8 w-8" strokeWidth={2.6} />
                </span>
                <div>
                  <p className="text-[40px] font-black leading-none tracking-tight text-[#10204A]">
                    {value}
                  </p>
                  <p className="mt-1 text-xs font-extrabold uppercase tracking-wide text-[#60708D]">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="mx-auto mt-7 max-w-[1014px]">
          {UNITS.map((unit) => (
            <UnitSection key={unit.id} unit={unit} />
          ))}
        </div>

        <p className="mt-8 text-center text-base font-bold text-[#60708D] sm:text-lg">
          <span className="mr-4 text-2xl text-[#FF78A6]">‹</span>
          Tap the next tile to keep going!
          <span className="ml-4 text-2xl text-[#FF78A6]">›</span>
        </p>
      </div>
    </div>
  );
}
