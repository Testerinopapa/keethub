import { useRef, useCallback, useState } from "react";
import { useCanvasLifecycle } from "@/games/paint-and-guess/components/canvas/useCanvasLifecycle";
import { useCanvasDrawing } from "@/games/paint-and-guess/components/canvas/useCanvasDrawing";
import { useCanvasSync } from "@/games/paint-and-guess/components/canvas/useCanvasSync";
import { Toolbar } from "@/games/paint-and-guess/components/Toolbar";
import type { Canvas as FabricCanvas } from "fabric";

interface TeamCanvasProps {
  team: 1 | 2;
  isDrawer: boolean;
  isGameActive: boolean;
  sendDrawingEvent: (event: any) => void;
  clearCanvas: () => void;
}

export function TeamCanvas({
  team,
  isDrawer,
  isGameActive,
  sendDrawingEvent,
  clearCanvas: notifyClearCanvas,
}: TeamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const isReceivingRef = useRef(false);

  const [activeTool, setActiveTool] = useState<"draw" | "erase">("draw");
  const [activeColor, setActiveColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushHardness, setBrushHardness] = useState(1);
  const [hasCanvasContent, setHasCanvasContent] = useState(false);

  const isCanvasValid = useCallback(
    (c: FabricCanvas | null): c is FabricCanvas => c !== null && c.getContext() !== null,
    [],
  );

  const { fabricCanvas } = useCanvasLifecycle({
    canvasRef,
    innerContainerRef,
    isDrawer,
    isGameActive,
    activeColor,
    brushSize,
    brushOpacity,
    brushHardness,
    activeTool,
    roomId: `sb-team-${team}`,
  });

  const { handleUndo, handleClear } = useCanvasDrawing({
    fabricCanvas,
    isDrawer,
    isGameActive,
    activeTool,
    activeColor,
    brushSize,
    brushOpacity,
    brushHardness,
    sendDrawingEvent,
    isCanvasValid,
    isReceivingRef,
  });

  useCanvasSync({
    fabricCanvas,
    isDrawer,
    isGameActive,
    roundNumber: 0,
    isCanvasValid,
    isReceivingRef,
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Canvas area */}
      <div ref={innerContainerRef} className="relative flex-1 bg-white">
        <canvas ref={canvasRef} className="h-full w-full" />
        {!isGameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <p className="text-lg font-semibold text-muted-foreground">
              Waiting for game to start...
            </p>
          </div>
        )}
      </div>

      {/* Toolbar (only for drawer) */}
      {isDrawer && isGameActive && (
        <div className="shrink-0 border-t bg-white">
          <Toolbar
            activeTool={activeTool}
            activeColor={activeColor}
            brushSize={brushSize}
            brushOpacity={brushOpacity}
            brushHardness={brushHardness}
            hasCanvasContent={hasCanvasContent}
            onToolChange={setActiveTool}
            onColorChange={setActiveColor}
            onBrushSizeChange={setBrushSize}
            onBrushOpacityChange={setBrushOpacity}
            onBrushHardnessChange={setBrushHardness}
            onUndo={handleUndo}
            onClear={() => {
              handleClear(notifyClearCanvas);
            }}
          />
        </div>
      )}
    </div>
  );
}
