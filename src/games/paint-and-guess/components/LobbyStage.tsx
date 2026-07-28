import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlayerList } from "./PlayerList";
import { Chat } from "./Chat";
import { LogOut, Play, Users } from "lucide-react";

interface LobbyStageProps {
  isHost: boolean;
  isReady: boolean;
  allPlayersReady: boolean;
  playerCount: number;
  maxRounds: number;
  onReadyToggle: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

/**
 * Lobby stage - players ready up before game starts
 * No canvas shown here, giving more room for players and chat
 */
export function LobbyStage({
  isHost,
  isReady,
  allPlayersReady,
  playerCount,
  maxRounds,
  onReadyToggle,
  onStartGame,
  onLeaveRoom,
}: LobbyStageProps) {
  // Keyboard shortcut: Space/Enter toggles ready state when no input is focused
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.target instanceof HTMLButtonElement && e.target.type === "submit") return;
      onReadyToggle();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onReadyToggle]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[260px_minmax(0,1fr)_300px] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Left Sidebar - Players */}
        <div className="flex min-h-0 flex-col gap-3">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <PlayerList />
          </div>

          {/* Ready Up Section */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-sm sm:text-base">
                <Users className="h-4 w-4" />
                Ready Up
              </CardTitle>
              <CardDescription className="text-xs">
                {playerCount < 2
                  ? "Waiting for more players..."
                  : allPlayersReady
                  ? "All players ready!"
                  : "Get ready to start"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={onReadyToggle}
                className="w-full text-sm"
                variant={isReady ? "secondary" : "default"}
                size="sm"
              >
                {isReady ? "Not Ready" : "Ready Up"}
              </Button>

              {isHost && (
                <Button
                  onClick={onStartGame}
                  className="w-full text-sm"
                  disabled={!allPlayersReady}
                  size="sm"
                >
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                  Start Game
                </Button>
              )}

              {!isHost && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {allPlayersReady
                      ? "Ready! Waiting for host to start."
                      : "Waiting for all players to ready up."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full flex-shrink-0 text-sm" size="sm">
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Leave Room
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave this room?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll need to rejoin with the PIN to come back.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction onClick={onLeaveRoom}>Leave</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Main Area - Game Info */}
        <div className="flex min-h-0 flex-col">
          <Card className="flex min-h-0 flex-1 flex-col">
            <CardHeader className="flex-shrink-0 pb-2">
              <CardTitle className="text-sm sm:text-base">Game Rules</CardTitle>
              <CardDescription className="text-xs">How to play</CardDescription>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto space-y-2 sm:space-y-3">
              <div>
                <h3 className="mb-0.5 text-xs font-semibold sm:text-sm">Drawing Phase</h3>
                <p className="text-xs text-muted-foreground">
                  One player draws while others guess the word. You have 60 seconds per round.
                </p>
              </div>
              <div>
                <h3 className="mb-0.5 text-xs font-semibold sm:text-sm">Guessing</h3>
                <p className="text-xs text-muted-foreground">
                  Type your guesses in the chat. First correct guess wins points!
                </p>
              </div>
              <div>
                <h3 className="mb-0.5 text-xs font-semibold sm:text-sm">Scoring</h3>
                <p className="text-xs text-muted-foreground">
                  Correct guesses earn points. The player with the most points at the end wins!
                </p>
              </div>
              <div>
                <h3 className="mb-0.5 text-xs font-semibold sm:text-sm">Rounds</h3>
                <p className="text-xs text-muted-foreground">
                  Each player gets a turn to draw. The game continues for {maxRounds} rounds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Chat */}
        <div className="flex min-h-0 flex-col">
          <Chat />
        </div>
      </div>
    </div>
  );
}

