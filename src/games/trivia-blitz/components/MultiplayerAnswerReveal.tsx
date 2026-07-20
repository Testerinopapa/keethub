import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TriviaRoomState, TriviaOption } from "../hooks/useTriviaMultiplayer";

interface Props {
  state: TriviaRoomState;
}

export default function MultiplayerAnswerReveal({ state }: Props) {
  const question = state.currentQuestion;
  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Revealing answer...</p>
        </Card>
      </div>
    );
  }

  const correctId = question.correctOptionId;
  const correctOption = question.options.find((o) => o.id === correctId);
  const answers = state.answers ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
      <div className="text-center mb-4">
        <span className="text-sm text-muted-foreground font-medium">
          Question {state.room.roundNumber} of {state.room.maxRounds}
        </span>
      </div>

      {/* Question text */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-center">{question.text}</CardTitle>
        </CardHeader>
      </Card>

      {/* Options with correct/wrong highlighting */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {question.options.map((option) => {
          const isCorrect = option.id === correctId;
          return (
            <div
              key={option.id}
              className={cn(
                "rounded-xl border-2 p-3 md:p-4",
                isCorrect
                  ? "border-success/60 bg-success/10"
                  : "border-border bg-card opacity-60",
              )}
            >
              <div className="flex items-center gap-2">
                {isCorrect && <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />}
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 border border-white/20"
                  style={{ backgroundColor: option.color }}
                />
                <span className="text-sm font-medium">{option.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-player results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Player Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {answers.map((answer) => {
            const player = state.players.find((p) => p.id === answer.playerId);
            const playerName = answer.playerName || player?.name || "Unknown";
            const isTimedOut = answer.selectedOptionId === null;

            return (
              <div
                key={answer.playerId}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                  answer.isCorrect
                    ? "bg-success/10"
                    : isTimedOut
                      ? "bg-warning/5"
                      : "bg-destructive/10",
                )}
              >
                <div className="flex items-center gap-2">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  ) : isTimedOut ? (
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  )}
                  <span className="font-medium">{playerName}</span>
                </div>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    answer.isCorrect ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {answer.isCorrect ? `+${answer.points.toLocaleString()}` : isTimedOut ? "Time's up" : "+0"}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
