import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NormalizedGameEntry } from "@/games/registry/schema";

export function getScribbleBattlePreviewEntry(): NormalizedGameEntry {
  return {
    id: "scribble-battle",
    version: "1.0.0",
    name: { default: "Scribble Battle" },
    description: {
      default: "Team vs team drawing showdown. Two teams, one word — race to guess first!",
    },
    status: "beta",
    supportedPlayers: { min: 4, max: 20, recommended: 8 },
    monetization: "free",
    category: ["party", "drawing"],
    badges: ["new"],
    assets: {
      thumbnail: "/placeholder.svg",
    },
    navigation: {
      category: "featured",
      priority: 90,
    },
    visibleIf: ["public"],
    route: { slug: "scribble-battle" },
    featureFlags: [],
    plugin: {
      previewComponent: "scribbleBattlePreview",
      moduleId: "@/games/scribble-battle",
    },
  };
}

export function ScribbleBattlePreviewCard() {
  return (
    <Card className="border-dashed bg-muted/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="default">New</Badge>
          <CardTitle>Scribble Battle</CardTitle>
        </div>
        <CardDescription>Team-based drawing showdown.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Two teams, one word per round. Race to guess first, then dominate the final relay!
      </CardContent>
    </Card>
  );
}

export function getScribbleBattlePreviewComponent() {
  return ScribbleBattlePreviewCard;
}
