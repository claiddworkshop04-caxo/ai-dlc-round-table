import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { members } from "@/src/schema";

export default function NewMemberPage() {
  async function createMember(formData: FormData) {
    "use server";
    const name = formData.get("name");
    if (typeof name !== "string" || name.trim() === "") return;
    const { db } = await import("@/src/db");
    await db.insert(members).values({ name: name.trim() });
    redirect("/members");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>メンバー 新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMember} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">氏名 *</Label>
              <Input id="name" name="name" required placeholder="例: 山田 太郎" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">登録</Button>
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
