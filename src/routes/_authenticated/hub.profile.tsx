import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BadgeCheck, CalendarDays, Edit3, Flame, LockKeyhole, Mail, ShieldCheck, Star, UserRoundCheck } from "lucide-react";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarPreview } from "@/components/avatar/AvatarPreview";
import { AvatarCustomizer } from "@/components/avatar/AvatarCustomizer";
import type { AvatarConfig } from "@/lib/avatar/config";
import { encodeAvatarConfig } from "@/lib/avatar/config";
import { parseAvatarConfig } from "@/lib/avatar/url";

const profileQuery = queryOptions({ queryKey: ["me"], queryFn: () => getMyProfile() });

export const Route = createFileRoute("/_authenticated/hub/profile")({
  head: () => ({ meta: [{ title: "Profile — PrimKeet" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: ProfilePage,
});

const schema = z.object({ username: z.string().min(3).max(24).regex(/^[a-z0-9_]+$/, "lowercase, numbers, underscores only") });
const formatDate = (date?: string | null) => date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date)) : "Recently";

function ProfilePage() {
  const { data: profile } = useSuspenseQuery(profileQuery);
  const updateFn = useServerFn(updateMyProfile);
  const queryClient = useQueryClient();
  const avatarConfig = parseAvatarConfig(profile?.avatar_config);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { username: profile?.username ?? "" } });

  useEffect(() => { if (profile?.username) form.reset({ username: profile.username }); }, [profile?.username, form]);

  const mutate = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => updateFn({ data: { username: values.username, avatar_config: profile?.avatar_config != null ? profile.avatar_config as Record<string, unknown> : undefined } }),
    onSuccess: () => { toast.success("Profile updated"); queryClient.invalidateQueries({ queryKey: ["me"] }); },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSaveAvatar = async (config: AvatarConfig) => {
    await updateFn({ data: { username: profile?.username ?? "", avatar_config: JSON.parse(encodeAvatarConfig(config)) as Record<string, unknown> } });
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(135deg,#FBFDFF_0%,#F5F9FF_52%,#FFFDFE_100%)] px-5 py-8 md:px-10 md:py-10">
      <div className="pointer-events-none absolute left-[4%] top-28 text-4xl text-[#9FC5FF]">✦</div>
      <div className="pointer-events-none absolute right-[12%] top-20 text-3xl text-[#FF9BC4]">✦</div>
      <div className="pointer-events-none absolute right-[7%] top-44 text-7xl opacity-50">☁️</div>
      <div className="relative mx-auto max-w-[1410px]">
        <header className="mb-4">
          <div className="flex items-center gap-3">
            <UserRoundCheck className="h-10 w-10 text-[#FF3B8D]" strokeWidth={2.5} />
            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#10204A] md:text-5xl">Profile</h1>
          </div>
          <p className="mt-2 text-lg font-medium text-[#63718D] md:pl-[52px]">Customize your account and avatar</p>
        </header>

        <section className="mb-5 grid gap-6 rounded-[26px] border border-[#E4EAF4] bg-white p-6 shadow-[0_14px_34px_rgba(40,69,120,0.09)] lg:grid-cols-[1fr_1.05fr] lg:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="rounded-full border-4 border-white shadow-[0_10px_26px_rgba(255,59,141,0.2)]"><AvatarPreview config={avatarConfig} size={130} /></div>
              <span className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-[#FF3B8D] text-white"><Edit3 className="h-4 w-4" /></span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#10204A]">{profile?.username}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#73809A]"><CalendarDays className="h-4 w-4" /> Joined {formatDate(profile?.created_at)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-[#FFF0F6] px-4 py-2 text-[#FF3B8D]"><Flame className="h-7 w-7 fill-current" /><span><b className="block text-base leading-none">12</b><small className="font-bold">Day Streak</small></span></div>
                <div className="flex items-center gap-2 rounded-xl bg-[#F5EEFF] px-4 py-2 text-[#7946E8]"><Star className="h-7 w-7 fill-current" /><span><b className="block text-base leading-none">450</b><small className="font-bold">Points</small></span></div>
              </div>
            </div>
          </div>
          <form onSubmit={form.handleSubmit((values) => mutate.mutate(values))} className="border-t border-[#E8ECF4] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <Label htmlFor="username" className="font-bold text-[#344362]">Username</Label>
            <div className="relative mt-2"><Input id="username" {...form.register("username")} className="h-11 border-[#DDE4F0] bg-white pr-11 font-semibold text-[#344362] shadow-sm focus-visible:ring-[#FF3B8D]" /><BadgeCheck className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#11B567]" /></div>
            {form.formState.errors.username && <p className="mt-1 text-xs text-destructive">{form.formState.errors.username.message}</p>}
            <p className="mt-2 text-sm text-[#8190AA]">This is how other players will see you.</p>
            <Button type="submit" disabled={mutate.isPending} className="mt-3 bg-[#FF3B8D] font-bold shadow-[0_7px_16px_rgba(255,59,141,0.25)] hover:bg-[#E92B7B]">{mutate.isPending ? "Saving..." : "Save changes"}</Button>
          </form>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(330px,.9fr)]">
          <AvatarCustomizer onSave={handleSaveAvatar} initialConfig={avatarConfig} />
          <aside className="space-y-5">
            <section className="rounded-[24px] border border-[#E4EAF4] bg-white p-6 shadow-[0_12px_30px_rgba(40,69,120,0.08)]">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#EBF4FF] text-[#438BFF]"><ShieldCheck /></span><div><h2 className="font-extrabold text-[#10204A]">Account Details</h2><p className="text-sm text-[#73809A]">Manage your account preferences.</p></div></div>
              <dl className="mt-5 space-y-4 text-sm"><Detail icon={<CalendarDays />} label="Member Since" value={formatDate(profile?.created_at)} /><Detail icon={<UserRoundCheck />} label="Account Status" value={<span className="rounded-full bg-[#DDF8E8] px-3 py-1 font-bold text-[#169A54]">Active</span>} /><Detail icon={<Mail />} label="Email" value="Your account email" /></dl>
            </section>
            <section className="rounded-[24px] border border-[#E4EAF4] bg-white p-6 shadow-[0_12px_30px_rgba(40,69,120,0.08)]">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF7D8] text-[#FFB90C]"><Star className="fill-current" /></span><div><h2 className="font-extrabold text-[#10204A]">Your Badges</h2><p className="text-sm text-[#73809A]">Keep learning and earn more badges!</p></div></div>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs font-bold text-[#53627E]"><Badge icon="🚀" label="Explorer" /><Badge icon="📖" label="Learner" /><Badge icon="🏆" label="Top Player" /><Badge icon={<LockKeyhole className="mx-auto h-7 w-7" />} label="Coming Soon" muted /></div>
              <button type="button" className="mt-5 flex w-full items-center justify-center gap-2 border-t border-[#E8ECF4] pt-4 font-bold text-[#FF3B8D] hover:underline">View all badges <span>→</span></button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return <div className="grid grid-cols-[22px_minmax(100px,1fr)_auto] items-center gap-2"><span className="text-[#438BFF] [&>svg]:h-4 [&>svg]:w-4">{icon}</span><dt className="font-bold text-[#344362]">{label}</dt><dd className="text-right font-medium text-[#63718D]">{value}</dd></div>;
}

function Badge({ icon, label, muted = false }: { icon: React.ReactNode; label: string; muted?: boolean }) {
  return <div className={muted ? "opacity-45" : ""}><div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-[#F5EEFF] text-3xl shadow-sm">{icon}</div><span>{label}</span></div>;
}
