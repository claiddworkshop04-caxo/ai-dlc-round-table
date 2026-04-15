import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { members } from "@/src/schema";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { db } = await import("@/src/db");
  const [member] = await db.select().from(members).where(eq(members.id, Number(id)));
  if (!member) notFound();

  async function updateMember(formData: FormData) {
    "use server";
    const name = formData.get("name");
    if (typeof name !== "string" || name.trim() === "") return;
    const { db } = await import("@/src/db");
    await db
      .update(members)
      .set({ name: name.trim() })
      .where(eq(members.id, Number(id)));
    redirect("/members");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>メンバー 編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateMember} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">氏名 *</Label>
              <Input id="name" name="name" required defaultValue={member.name} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">更新</Button>
              <a
                href="/members"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
              >
                キャンセル
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
