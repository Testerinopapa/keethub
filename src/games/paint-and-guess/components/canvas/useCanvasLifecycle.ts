import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";

interface CanvasSize {
  width: number;
  height: number;
}

interface UseCanvasLifecycleOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  innerContainerRef: React.RefObject<HTMLDivElement | null>;
  isDrawer: boolean;
  isGameActive: boolean;
  activeColor: string;
  brushSize: number;
  brushOpacity: number;
  brushHardness: number;
  activeTool: "draw" | "erase";
  roomId: string | null;
}

interface UseCanvasLifecycleReturn {
  fabricCanvas: FabricCanvas | null;
  isDisposed: boolean;
  isCanvasValid: (canvas: FabricCanvas | null) => canvas is FabricCanvas;
}

/**
 * Manages Fabric.js canvas lifecycle: initialization, disposal, and resizing
 */
export function useCanvasLifecycle({
  canvasRef,
  innerContainerRef,
  isDrawer,
  isGameActive,
  activeColor,
  brushSize,
  brushOpacity,
  brushHardness,
  activeTool,
  roomId,
}: UseCanvasLifecycleOptions): UseCanvasLifecycleReturn {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const isDisposedRef = useRef(false);
  const canvasReadyRef = useRef(false);
  const lastRoomIdRef = useRef<string | null>(null);

  // Canvas dimensions match the container exactly
  const calculateCanvasSize = useCallback((): CanvasSize => {
    const el = innerContainerRef.current;
    if (!el) return { width: 800, height: 600 };
    const w = el.clientWidth;
    const h = el.clientHeight;
    return {
      width: Math.max(Math.floor(w), 1),
      height: Math.max(Math.floor(h), 1),
    };
  }, []);

  // Helper function to check if canvas is valid and not disposed
  const isCanvasValid = useCallback((canvas: FabricCanvas | null): canvas is FabricCanvas => {
    if (!canvas || isDisposedRef.current) {
      return false;
    }
    try {
      const lowerCanvasEl = (canvas as any).lowerCanvasEl;
      if (!lowerCanvasEl) {
        return false;
      }
      const context = lowerCanvasEl.getContext("2d");
      return !!context;
    } catch (error) {
      return false;
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.debug("[CanvasLifecycle] Initializing new canvas", { roomId });

    isDisposedRef.current = false;
    canvasReadyRef.current = false;

    const { width, height } = calculateCanvasSize();
    const dpr = window.devicePixelRatio || 1;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: width * dpr,
      height: height * dpr,
      backgroundColor: "#ffffff",
      isDrawingMode: false,
      renderOnAddRemove: true,
      skipTargetFind: !isDrawer,
    });

    // Override CSS to fill container at display size; internal buffer stays at width*dpr
    canvas.lowerCanvasEl.style.width = `${width}px`;
    canvas.lowerCanvasEl.style.height = `${height}px`;
    canvas.upperCanvasEl.style.width = `${width}px`;
    canvas.upperCanvasEl.style.height = `${height}px`;

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = activeTool === "erase" ? brushSize * 2 : brushSize;

    if (activeTool !== "erase") {
      const shadowBlur = brushHardness < 1 ? (1 - brushHardness) * brushSize * 2 : 0;
      (canvas.freeDrawingBrush as any).shadow = {
        blur: shadowBlur,
        offsetX: 0,
        offsetY: 0,
        color: activeColor,
      };
    }

    canvas.isDrawingMode = isGameActive && isDrawer;

    if (!isDrawer) {
      canvas.selection = false;
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "default";
      canvas.moveCursor = "default";
      canvas.skipTargetFind = true;
    }

    setFabricCanvas(canvas);

    // Store DPR for resize handling
    let currentDpr = dpr;

    // Verify it's ready - Fabric.js should have lowerCanvasEl ready immediately
    // but we'll check in the next frame to be safe
    // Use a more robust check that doesn't spam warnings
    requestAnimationFrame(() => {
      try {
        const lowerCanvasEl = (canvas as any).lowerCanvasEl;
        if (lowerCanvasEl && lowerCanvasEl.getContext) {
          canvasReadyRef.current = true;
        } else {
          // Only warn if canvas is still valid (not disposed)
          // This can happen during HMR or rapid remounts
          if (!isDisposedRef.current && canvasRef.current) {
            // Try again in next frame - sometimes Fabric needs more time
            requestAnimationFrame(() => {
              const retryLowerCanvasEl = (canvas as any).lowerCanvasEl;
              if (retryLowerCanvasEl && retryLowerCanvasEl.getContext) {
                canvasReadyRef.current = true;
              }
              // Don't warn on retry - it's expected during HMR
            });
          }
        }
      } catch (error) {
        // Silently handle errors during initialization
        // This can happen during HMR or component unmount
      }
    });

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!isCanvasValid(canvas)) return;
        const { width, height } = calculateCanvasSize();
        const dpr = window.devicePixelRatio || 1;
        const targetInternalW = width * dpr;
        const targetInternalH = height * dpr;
        if (canvas.width !== targetInternalW || canvas.height !== targetInternalH) {
          // If DPR changed, scale objects to preserve visual size
          if (currentDpr !== dpr) {
            const scale = dpr / Math.max(currentDpr, 1);
            canvas.getObjects().forEach((obj: any) => {
              if (typeof obj.left === 'number') obj.left *= scale;
              if (typeof obj.top === 'number') obj.top *= scale;
            });
            currentDpr = dpr;
          }
          canvas.setWidth(targetInternalW);
          canvas.setHeight(targetInternalH);
          canvas.lowerCanvasEl.style.width = `${width}px`;
          canvas.lowerCanvasEl.style.height = `${height}px`;
          canvas.upperCanvasEl.style.width = `${width}px`;
          canvas.upperCanvasEl.style.height = `${height}px`;
          canvas.renderAll();
        }
      }, 150);
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (innerContainerRef.current) {
      resizeObserver.observe(innerContainerRef.current);
    }

    const initialResizeTimeout = setTimeout(() => {
      if (!isCanvasValid(canvas)) return;
      const { width: w, height: h } = calculateCanvasSize();
      const dpr = currentDpr;
      canvas.setWidth(w * dpr);
      canvas.setHeight(h * dpr);
      canvas.lowerCanvasEl.style.width = `${w}px`;
      canvas.lowerCanvasEl.style.height = `${h}px`;
      canvas.upperCanvasEl.style.width = `${w}px`;
      canvas.upperCanvasEl.style.height = `${h}px`;
      canvas.renderAll();
    }, 200);

    // Window resize fallback (with debouncing)
    window.addEventListener("resize", handleResize);

    // Also listen for orientation changes on mobile
    const handleOrientationChange = () => {
      setTimeout(() => {
        if (!isCanvasValid(canvas)) return;
        const { width: w, height: h } = calculateCanvasSize();
        const dpr = currentDpr;
        canvas.setWidth(w * dpr);
        canvas.setHeight(h * dpr);
        canvas.lowerCanvasEl.style.width = `${w}px`;
        canvas.lowerCanvasEl.style.height = `${h}px`;
        canvas.upperCanvasEl.style.width = `${w}px`;
        canvas.upperCanvasEl.style.height = `${h}px`;
        canvas.renderAll();
      }, 300);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      console.debug("[CanvasLifecycle] Disposing canvas");
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      clearTimeout(initialResizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      isDisposedRef.current = true;

      setFabricCanvas(null);

      try {
        if (canvas && (canvas as any).lowerCanvasEl) {
          canvas.dispose();
        }
      } catch (error) {
        console.debug("[CanvasLifecycle] Error disposing canvas:", error);
      }
    };
  }, [canvasRef, roomId, calculateCanvasSize, isCanvasValid]);
  // Canvas is now long-lived — initialized once per game (roomId change).
  // isDrawer and isGameActive toggles are handled below without recreation.

  // Toggle drawing mode without recreating the canvas
  useEffect(() => {
    if (!isCanvasValid(fabricCanvas) || !fabricCanvas) return;
    fabricCanvas.isDrawingMode = isGameActive && isDrawer;
    if (!isDrawer) {
      fabricCanvas.selection = false;
      fabricCanvas.defaultCursor = "default";
      fabricCanvas.hoverCursor = "default";
      fabricCanvas.moveCursor = "default";
      fabricCanvas.skipTargetFind = true;
    } else {
      fabricCanvas.skipTargetFind = false;
      fabricCanvas.defaultCursor = "crosshair";
    }
    fabricCanvas.renderAll();
  }, [isGameActive, isDrawer, fabricCanvas, isCanvasValid]);

  // Reset canvas content when roomId changes
  useEffect(() => {
    if (roomId && roomId !== lastRoomIdRef.current) {
      lastRoomIdRef.current = roomId;
      if (isCanvasValid(fabricCanvas) && fabricCanvas) {
        fabricCanvas.clear();
        fabricCanvas.renderAll();
      }
    }
  }, [roomId, fabricCanvas, isCanvasValid]);

  // Update brush properties when they change (without re-initializing canvas)
  useEffect(() => {
    if (!isCanvasValid(fabricCanvas) || !fabricCanvas?.freeDrawingBrush) return;

    if (activeTool === "erase") {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
      fabricCanvas.freeDrawingBrush.width = brushSize * 2;
      (fabricCanvas.freeDrawingBrush as any).shadow = null;
    } else {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;

      // Apply hardness using shadowBlur
      const shadowBlur = brushHardness < 1 ? (1 - brushHardness) * brushSize * 2 : 0;
      (fabricCanvas.freeDrawingBrush as any).shadow =
        shadowBlur > 0
          ? {
              blur: shadowBlur,
              offsetX: 0,
              offsetY: 0,
              color: activeColor,
            }
          : null;
    }
  }, [
    fabricCanvas,
    isCanvasValid,
    activeColor,
    brushSize,
    brushOpacity,
    brushHardness,
    activeTool,
  ]);

  return {
    fabricCanvas,
    isDisposed: isDisposedRef.current,
    isCanvasValid,
  };
}
