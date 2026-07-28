import { Canvas } from "./Canvas";
import { Chat } from "./Chat";
import { PlayerList } from "./PlayerList";
import { Button } from "@/components/ui/button";
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
import { LogOut, Sparkles } from "lucide-react";

interface GameStageProps {
  onLeaveRoom: () => void;
}

export function GameStage({ onLeaveRoom }: GameStageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4 md:px-5">
      <div className="grid min-h-0 flex-1 gap-4 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px] xl:grid-cols-[260px_minmax(0,1fr)_300px] 2xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <div className="order-2 flex min-h-0 flex-col gap-3 lg:order-1">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <PlayerList />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full flex-shrink-0 rounded-lg border-[#D7DDEA] bg-white text-sm font-extrabold text-[#7037E8] shadow-sm hover:bg-[#F6F1FF] hover:text-[#7037E8]"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Leave
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave the game?</AlertDialogTitle>
                <AlertDialogDescription>
                  You won't earn any more points this round. Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay</AlertDialogCancel>
                <AlertDialogAction onClick={onLeaveRoom}>Leave</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="relative hidden flex-shrink-0 rounded-lg border border-[#8BE0DE] bg-white px-4 pb-4 pt-7 text-center shadow-[0_12px_30px_rgba(16,32,74,0.06)] lg:block">
            <div className="absolute -top-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#FFF1F6] text-[#FF2F85] shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-xs font-black text-[#10B8B5]">Tip from Keet!</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#53627D]">
              Big shapes first, then details. Keep it simple and easy to guess.
            </p>
          </div>
        </div>

        <div className="order-1 min-h-[280px] lg:order-2 lg:min-h-0">
          <Canvas />
        </div>

        <div className="order-3 min-h-[260px] lg:order-3 lg:min-h-0">
          <Chat />
        </div>
      </div>
    </div>
  );
}
