import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Chess } from "chess.js";
import type { GameState, GameMode, ChessMove, GameStatus, AIConfig, Side, ChessContextType } from "./types";
import { stockfishEngine } from "./StockfishEngine";

function getGameStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) return "checkmate";
  if (game.isStalemate()) return "stalemate";
  if (game.isDraw()) return "draw";
  return "playing";
}

function buildGameState(game: Chess, mode: GameMode, lastMove?: { from: string; to: string }): GameState {
  const history = game.history({ verbose: true });
  return {
    fen: game.fen(),
    pgn: game.pgn(),
    moves: history.map((m) => ({ from: m.from, to: m.to, promotion: m.promotion, san: m.san, timestamp: Date.now() })),
    status: getGameStatus(game),
    turn: game.turn() === "w" ? "white" : "black",
    inCheck: game.inCheck(),
    inCheckmate: game.isCheckmate(),
    inStalemate: game.isStalemate(),
    inDraw: game.isDraw(),
    gameMode: mode,
    lastMove,
  };
}

const DIFFICULTY_DEPTH: Record<string, number> = { easy: 5, medium: 10, hard: 15 };
const DIFFICULTY_ELO: Record<string, number> = { easy: 1350, medium: 1850, hard: 2850 };

// ── Context ───────────────────────────────────────────────────────

const ChessContext = createContext<ChessContextType | undefined>(undefined);

export function ChessProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState(() => new Chess());
  const [gameState, setGameState] = useState<GameState>(() => buildGameState(new Chess(), "local"));
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    enabled: false,
    color: "black",
    difficulty: "medium",
    depth: 10,
  });
  const [isAIThinking, setIsAIThinking] = useState(false);
  const mountedRef = useRef(true);
  const gameRef = useRef(game);
  gameRef.current = game;

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // Clone the game so React always sees a new reference on state updates
  const updateState = useCallback(
    (g: Chess, mode: GameMode, lastMove?: { from: string; to: string }) => {
      const clone = new Chess(g.fen());
      setGameState(buildGameState(clone, mode, lastMove));
      setGame(clone);
    },
    [],
  );

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      try {
        const g = gameRef.current;
        const move = g.move({ from, to, promotion: promotion as "q" | "r" | "b" | "n" | undefined });
        if (!move) return false;
        updateState(g, aiConfig.enabled ? "ai" : "local", { from, to });
        return true;
      } catch {
        return false;
      }
    },
    [aiConfig.enabled, updateState],
  );

  const resetGame = useCallback(() => {
    const g = new Chess();
    setGame(g);
    setGameState(buildGameState(g, aiConfig.enabled ? "ai" : "local"));
  }, [aiConfig.enabled]);

  const loadFromFen = useCallback(
    (fen: string) => {
      try {
        const g = new Chess(fen);
        setGame(g);
        setGameState(buildGameState(g, aiConfig.enabled ? "ai" : "local"));
      } catch {}
    },
    [aiConfig.enabled],
  );

  const undoMove = useCallback((): boolean => {
    try {
      const g = gameRef.current;
      if (g.history().length === 0) return false;
      g.undo();
      updateState(g, aiConfig.enabled ? "ai" : "local");
      return true;
    } catch {
      return false;
    }
  }, [aiConfig.enabled, updateState]);

  const getLegalMoves = useCallback(
    (square?: string): string[] => {
      try {
        return gameRef.current.moves({ square, verbose: true }).map((m) => m.to);
      } catch {
        return [];
      }
    },
    [],
  );

  const isGameOver = useCallback((): boolean => gameRef.current.isGameOver(), []);

  const setGameMode = useCallback((_mode: GameMode) => {}, []);

  const isAITurn = useCallback((): boolean => {
    if (!aiConfig.enabled || isGameOver()) return false;
    return gameState.turn === aiConfig.color;
  }, [aiConfig, gameState.turn, isGameOver]);

  const makeAIMove = useCallback(async () => {
    const g = gameRef.current;
    console.log("[AI] makeAIMove called — turn:", g.turn(), "ai color:", aiConfig.color);
    if (isAIThinking || g.isGameOver() || !aiConfig.enabled) return;
    if (g.turn() !== (aiConfig.color === "white" ? "w" : "b")) return;

    console.log("[AI] Requesting best move from Stockfish...");
    setIsAIThinking(true);

    try {
      const depth = DIFFICULTY_DEPTH[aiConfig.difficulty] ?? 10;
      const elo = DIFFICULTY_ELO[aiConfig.difficulty];
      const fen = g.fen();
      console.log("[AI] FEN:", fen);
      const uci = await stockfishEngine.getBestMove(fen, depth, elo);

      if (!mountedRef.current) return;
      console.log("[AI] Engine returned UCI:", uci);

      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;

      // Re-read game from ref (may have been replaced by a clone after render)
      const currentGame = gameRef.current;
      const legal = currentGame.moves({ verbose: true });
      console.log("[AI] Legal moves count:", legal.length, "checking", from, to);

      const isValid = legal.some((m) => m.from === from && m.to === to);
      console.log("[AI] Move valid?", isValid);
      if (isValid) {
        console.log("[AI] Applying move:", from, to, promotion || "");
        currentGame.move({ from, to, promotion: promotion as "q" | "r" | "b" | "n" | undefined });
        updateState(currentGame, "ai", { from, to });
        console.log("[AI] Move applied — new FEN:", currentGame.fen());
      } else if (legal.length > 0) {
        console.warn("[AI] Invalid move, using fallback:", legal[0].from, legal[0].to);
        const fb = legal[0];
        currentGame.move({ from: fb.from, to: fb.to, promotion: fb.promotion });
        updateState(currentGame, "ai", { from: fb.from, to: fb.to });
      } else {
        console.warn("[AI] No legal moves available — game likely over");
      }
    } catch (e) {
      console.error("[AI] Engine error:", e);
      if (!mountedRef.current) return;
      const g2 = gameRef.current;
      const legal = g2.moves({ verbose: true });
      if (legal.length > 0) {
        const fb = legal[Math.floor(Math.random() * legal.length)];
        g2.move({ from: fb.from, to: fb.to, promotion: fb.promotion });
        updateState(g2, "ai", { from: fb.from, to: fb.to });
      }
    } finally {
      if (mountedRef.current) {
        console.log("[AI] Setting isAIThinking = false");
        setIsAIThinking(false);
      }
    }
  }, [aiConfig, updateState, isGameOver, isAIThinking]);

  const value = useMemo<ChessContextType>(
    () => ({
      game: gameState,
      makeMove,
      resetGame,
      loadFromFen,
      undoMove,
      getLegalMoves,
      isGameOver,
      setGameMode,
      aiConfig,
      setAIConfig: (c) => setAIConfig(c),
      isAITurn,
      isAIThinking,
      makeAIMove,
    }),
    [gameState, makeMove, resetGame, loadFromFen, undoMove, getLegalMoves, isGameOver, aiConfig, isAITurn, isAIThinking, makeAIMove],
  );

  return <ChessContext.Provider value={value}>{children}</ChessContext.Provider>;
}

export function useChess() {
  const ctx = useContext(ChessContext);
  if (!ctx) throw new Error("useChess must be used within a ChessProvider");
  return ctx;
}
