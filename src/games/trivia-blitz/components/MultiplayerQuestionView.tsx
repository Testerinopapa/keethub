import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { TriviaRoomState, TriviaQuestion } from "../hooks/useTriviaMultiplayer";

interface Props {
  state: TriviaRoomState;
  action: string | null;
  onSubmitAnswer: (optionId: string, timeMs: number) => Promise<void>;
  onAdvanceQuestion: () => Promise<void>;
}

export default function MultiplayerQuestionView({
  state,
  action,
  onSubmitAnswer,
  onAdvanceQuestion,
}: Props) {
  const question: TriviaQuestion | null = state.currentQuestion;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const questionStartRef = useRef(Date.now());
  const advanceCalledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasAnswered = state.self.hasAnswered || selectedId !== null;
  const answeredCount = state.answers?.length ?? 0;
  const totalPlayers = state.players.filter((p) => p.isConnected).length;

  // Timer from server deadline
  useEffect(() => {
    if (!question) return;

    const deadline = state.room.roundDeadlineAt;
    if (!deadline) return;

    questionStartRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 && !advanceCalledRef.current) {
        advanceCalledRef.current = true;
        void onAdvanceQuestion();
      }
    };

    tick();
    timerRef.current = setInterval(tick, 200);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [question, state.room.roundDeadlineAt, onAdvanceQuestion]);

  // Reset per-question state
  useEffect(() => {
    setSelectedId(null);
    advanceCalledRef.current = false;
  }, [question?.id]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (hasAnswered || !question) return;
      setSelectedId(optionId);
      const elapsedMs = Date.now() - questionStartRef.current;
      void onSubmitAnswer(optionId, elapsedMs);
    },
    [hasAnswered, question, onSubmitAnswer],
  );

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading question...</p>
        </Card>
      </div>
    );
  }

  const progress = question.timeLimit > 0 ? (timeLeft / question.timeLimit) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">
          Question {state.room.roundNumber} of {state.room.maxRounds}
        </span>
        <span className="text-sm text-muted-foreground">
          Answered: {answeredCount}/{totalPlayers}
        </span>
      </div>

      {/* Timer bar */}
      <div className="mb-6">
        <span
          className={cn(
            "text-3xl font-bold tabular-nums transition-colors",
            timeLeft <= 5 ? "text-destructive" : "text-foreground",
          )}
        >
          {timeLeft}s
        </span>
        <Progress
          value={progress}
          className={cn("h-2 mt-2", timeLeft <= 5 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary")}
        />
      </div>

      {/* Question text */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center">{question.text}</CardTitle>
        </CardHeader>
      </Card>

      {/* Answer buttons */}
      {hasAnswered ? (
        <Card className="p-6 text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            {action === "answer" ? "Submitting..." : "Waiting for other players..."}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {answeredCount} of {totalPlayers} have answered
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={hasAnswered || action !== null}
              className="group relative rounded-xl border-2 border-border bg-card p-4 md:p-6 text-left transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 border-2 border-white/20 shadow-inner"
                  style={{ backgroundColor: option.color }}
                />
                <span className="font-semibold text-base md:text-lg">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
