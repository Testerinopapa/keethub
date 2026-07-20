import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarPreview } from "./AvatarPreview";
import type { AvatarConfig } from "@/lib/avatar/config";
import {
  createDefaultAvatarConfig,
  cloneAvatarConfig,
  generateAvatarId,
} from "@/lib/avatar/config";
import { validateAvatarConfig, sanitizeAvatarConfig } from "@/lib/avatar/validation";
import {
  SkinToneSelector,
  HairSelector,
  ClothesSelector,
  AccessoriesSelector,
  FaceSelector,
  StyleSelector,
} from "./categories";
import { Shuffle, RotateCcw, Upload, X } from "lucide-react";
import { getAssetsByCategory } from "@/lib/avatar/categories/assets";
import { compressImage } from "@/lib/avatar/image";
import { toast } from "sonner";
import { useRef } from "react";

interface AvatarCustomizerProps {
  onSave: (config: AvatarConfig) => void | Promise<void>;
  initialConfig?: AvatarConfig | null;
}

export function AvatarCustomizer({
  onSave,
  initialConfig,
}: AvatarCustomizerProps) {
  const [config, setConfig] = useState<AvatarConfig>(() => {
    const loaded = initialConfig || createDefaultAvatarConfig();
    if (validateAvatarConfig(loaded)) return loaded;
    return sanitizeAvatarConfig(loaded as Record<string, any>);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialConfig) {
      const cloned = cloneAvatarConfig(initialConfig);
      if (validateAvatarConfig(cloned)) {
        setConfig(cloned);
      } else {
        setConfig(sanitizeAvatarConfig(cloned as Record<string, any>));
      }
    }
  }, [initialConfig]);

  const updateConfig = useCallback(
    (updates: Partial<AvatarConfig> | ((prev: AvatarConfig) => Partial<AvatarConfig>)) => {
      setConfig((prev) => {
        const updateData = typeof updates === "function" ? updates(prev) : updates;
        const updated = { ...prev, ...updateData };
        if (!validateAvatarConfig(updated)) {
          const sanitized = sanitizeAvatarConfig(updated as Record<string, any>);
          sanitized.id = generateAvatarId(sanitized);
          return sanitized;
        }
        updated.id = generateAvatarId(updated);
        return updated;
      });
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!validateAvatarConfig(config)) {
      toast.error("Invalid avatar configuration. Please check your selections.");
      const sanitized = sanitizeAvatarConfig(config as Record<string, any>);
      setConfig(sanitized);
      return;
    }
    try {
      await onSave(config);
      toast.success("Avatar saved successfully!");
    } catch {
      toast.error("Failed to save avatar. Please try again.");
    }
  }, [config, onSave]);

  const handleReset = () => {
    setConfig(createDefaultAvatarConfig(config.name));
  };

  const handleRandomize = () => {
    const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomOrNull = <T,>(arr: T[]): T | null =>
      Math.random() > 0.5 ? random(arr) : null;

    const skinTones = getAssetsByCategory("skin-tone");
    const hairStyles = getAssetsByCategory("hair-style");
    const hairColors = getAssetsByCategory("hair-color");
    const tops = getAssetsByCategory("clothing-top");
    const bottoms = getAssetsByCategory("clothing-bottom");
    const outfits = getAssetsByCategory("clothing-outfit");
    const hats = getAssetsByCategory("accessory-hat");
    const glasses = getAssetsByCategory("accessory-glasses");
    const eyes = getAssetsByCategory("face-eyes");
    const eyebrows = getAssetsByCategory("face-eyebrows");
    const mouths = getAssetsByCategory("face-mouth");
    const facialHair = getAssetsByCategory("face-facial-hair");
    const bodyShapes = getAssetsByCategory("body-shape");

    const randomConfig: AvatarConfig = {
      ...config,
      skinTone: random(skinTones).id,
      hair: { style: random(hairStyles).id, color: random(hairColors).id },
      clothes: {
        top: randomOrNull(tops)?.id || null,
        bottom: randomOrNull(bottoms)?.id || null,
        outfit: randomOrNull(outfits)?.id || null,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      },
      accessories: {
        hat: randomOrNull(hats)?.id || null,
        glasses: randomOrNull(glasses)?.id || null,
        jewelry: [],
        other: [],
      },
      face: {
        eyes: random(eyes).id,
        eyebrows: random(eyebrows).id,
        mouth: random(mouths).id,
        facialHair: randomOrNull(facialHair)?.id || null,
      },
      body: {
        shape: random(bodyShapes).id,
        size: random(["small", "medium", "large"] as const),
      },
    };
    randomConfig.id = generateAvatarId(randomConfig);
    setConfig(randomConfig);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      const dataUrl = await compressImage(file);
      updateConfig({ customImageUrl: dataUrl });
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to process image");
    }
  };

  const handleRemoveImage = () => {
    updateConfig({ customImageUrl: undefined });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#E4EAF4] bg-white p-5 shadow-[0_12px_30px_rgba(40,69,120,0.08)] lg:p-6" aria-labelledby="avatar-studio-heading">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF0F6] text-xl">🧑‍🎨</span>
        <div>
          <h2 id="avatar-studio-heading" className="text-lg font-extrabold text-[#10204A]">Avatar Studio</h2>
          <p className="text-sm font-medium text-[#73809A]">Create your unique look</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Side - Preview */}
          <div className="flex flex-col items-center gap-4 lg:w-[270px] lg:flex-shrink-0">
            <div className="relative flex h-[230px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_50%_55%,#F4E7FF_0%,#FFF_62%)]">
              <div className="absolute bottom-5 h-8 w-44 rounded-[100%] bg-[#EBD8FF] blur-sm" />
              <div className="relative rounded-full border-4 border-white shadow-[0_10px_28px_rgba(178,105,255,0.28)]">
                <AvatarPreview config={config} size={170} />
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleRandomize} className="border-[#CDB6FF] text-[#7946E8] hover:bg-[#F7F1FF]">
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button variant="outline" onClick={handleReset} className="border-[#9EDDE0] text-[#08AAA7] hover:bg-[#ECFBFA]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            <div className="w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-image-upload"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-[#9EDDE0] text-[#08AAA7] hover:bg-[#ECFBFA]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {config.customImageUrl ? "Change" : "Upload"}
                </Button>
                {config.customImageUrl && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleRemoveImage}
                    size="icon"
                    title="Remove uploaded image"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="mt-2 text-center text-xs font-medium text-[#8190AA]">Use your own image as avatar</p>
            </div>
          </div>

          {/* Right Side - Customization Options */}
          <div className="flex min-w-0 flex-1 flex-col border-t border-[#E8ECF4] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Tabs defaultValue="skin" className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl bg-[#F6F8FC] p-1 md:grid-cols-6">
                <TabsTrigger value="skin">Skin</TabsTrigger>
                <TabsTrigger value="hair">Hair</TabsTrigger>
                <TabsTrigger value="clothes">Clothes</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
                <TabsTrigger value="face">Face</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <div className="min-h-[190px] flex-1 overflow-y-auto pr-2 pt-4">
                <TabsContent value="skin" className="mt-0">
                  <SkinToneSelector
                    selectedTone={config.skinTone}
                    onSelect={(tone) => updateConfig({ skinTone: tone })}
                  />
                </TabsContent>

                <TabsContent value="hair" className="mt-0">
                  <HairSelector
                    config={config}
                    onUpdate={(updates) =>
                      updateConfig((prev) => ({ hair: { ...prev.hair, ...updates } }))
                    }
                  />
                </TabsContent>

                <TabsContent value="clothes" className="mt-0">
                  <ClothesSelector
                    config={config}
                    renderer="dicebear"
                    onUpdate={(updates) =>
                      updateConfig((prev) => ({ clothes: { ...prev.clothes, ...updates } }))
                    }
                  />
                </TabsContent>

                <TabsContent value="accessories" className="mt-0">
                  <AccessoriesSelector
                    config={config}
                    renderer="dicebear"
                    onUpdate={(updates) =>
                      updateConfig((prev) => ({
                        accessories: { ...prev.accessories, ...updates },
                      }))
                    }
                  />
                </TabsContent>

                <TabsContent value="face" className="mt-0">
                  <FaceSelector
                    config={config}
                    onUpdate={(updates) =>
                      updateConfig((prev) => ({ face: { ...prev.face, ...updates } }))
                    }
                  />
                </TabsContent>

                <TabsContent value="style" className="mt-0">
                  <StyleSelector
                    config={config}
                    onUpdate={(updates) =>
                      updateConfig((prev) => ({
                        dicebear: {
                          ...(prev.dicebear || {
                            clothingGraphic: null,
                            backgroundStyle: "default" as const,
                            backgroundColor: null,
                          }),
                          ...updates,
                        },
                      }))
                    }
                  />
                </TabsContent>
              </div>
            </Tabs>

            <div className="mt-4 flex justify-end border-t border-[#E8ECF4] pt-4">
              <Button onClick={handleSave} className="min-w-36 bg-[#FF3B8D] font-bold shadow-[0_7px_16px_rgba(255,59,141,0.25)] hover:bg-[#E92B7B]">
                Save Avatar
              </Button>
            </div>
          </div>
      </div>
    </section>
  );
}
