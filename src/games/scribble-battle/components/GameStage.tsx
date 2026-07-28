import { useSBGame } from "@/games/scribble-battle";
import { TeamChat } from "@/games/scribble-battle/components/TeamChat";
import { TeamCanvas } from "@/games/scribble-battle/components/TeamCanvas";
import { Card } from "@/components/ui/card";

interface GameStageProps {
  onLeaveRoom: () => void;
}

export function GameStage({ onLeaveRoom }: GameStageProps) {
  const { gameState, isDrawer, sendDrawingEvent, clearCanvas, sendGuess, sendChatMessage, chatMessages } = useSBGame();

  const playerTeam = gameState.team;

  if (!playerTeam) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="p-6 text-center">
          <p className="font-semibold">You are not on a team</p>
          <p className="text-sm text-muted-foreground">Wait for the host to assign you</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Team canvas area */}
      <div className="flex flex-1 flex-col">
        <TeamCanvas
          team={playerTeam}
          isDrawer={isDrawer}
          isGameActive
          sendDrawingEvent={sendDrawingEvent}
          clearCanvas={clearCanvas}
        />
      </div>

      {/* Team chat sidebar */}
      <div className="w-80 shrink-0 border-l">
        <TeamChat
          messages={chatMessages}
          onSendGuess={sendGuess}
          onSendChat={sendChatMessage}
          isDrawer={isDrawer}
          isGameActive
        />
      </div>
    </div>
  );
}
