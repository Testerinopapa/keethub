import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  player: { id: string; name: string; team: 1 | 2 };
  message: string;
  timestamp: number;
  type: "message" | "correct-guess" | "wrong-guess" | "system";
}

interface TeamChatProps {
  messages: ChatMessage[];
  onSendGuess: (guess: string) => void;
  onSendChat: (message: string) => void;
  isDrawer: boolean;
  isGameActive: boolean;
}

export function TeamChat({
  messages,
  onSendGuess,
  onSendChat,
  isDrawer,
  isGameActive,
}: TeamChatProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when game is active and player is not drawer
  useEffect(() => {
    if (isGameActive && !isDrawer) {
      inputRef.current?.focus();
    }
  }, [isGameActive, isDrawer]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (isGameActive && !isDrawer) {
      onSendGuess(trimmed);
    } else {
      onSendChat(trimmed);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="border-b px-3 py-2">
        <p className="text-sm font-semibold">Team Chat</p>
        {isGameActive && (
          <p className="text-xs text-muted-foreground">
            {isDrawer ? "You are drawing — chat only" : "Type your guess!"}
          </p>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            {isGameActive ? "No guesses yet..." : "Chat is empty"}
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "mb-1 rounded px-2 py-1 text-sm",
              msg.type === "correct-guess" && "bg-green-100 text-green-800",
              msg.type === "wrong-guess" && "bg-muted/50",
              msg.type === "system" && "bg-blue-50 text-blue-700",
            )}
          >
            {msg.type === "correct-guess" ? (
              <span>
                <span className="font-medium">{msg.player.name}</span> {msg.message}
              </span>
            ) : msg.type === "message" ? (
              <span>
                <span className="font-medium">{msg.player.name}:</span> {msg.message}
              </span>
            ) : (
              <span className="text-xs italic">{msg.message}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t p-2">
        <Input
          ref={inputRef}
          placeholder={
            isGameActive && !isDrawer ? "Type your guess..." : "Type a message..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDrawer && isGameActive}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
