import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { members } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getMembers() {
  const { db } = await import("@/src/db");
  return db.select().from(members).orderBy(members.name);
}

export default async function MembersPage() {
  const memberList = await getMembers();

  async function deleteMember(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;
    const { db } = await import("@/src/db");
    await db.delete(members).where(eq(members.id, id));
    revalidatePath("/members");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">メンバー</h1>
        <Link href="/members/new" className={cn(buttonVariants())}>
          + 新規登録
        </Link>
      </div>

      {memberList.length === 0 ? (
        <p className="text-sm text-muted-foreground">メンバーが登録されていません。</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">氏名</th>
                <th className="px-4 py-3 font-medium">登録日</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {memberList.map((member) => (
                <tr key={member.id} className="bg-background">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.createdAt.toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/members/${member.id}/edit`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        編集
                      </Link>
                      <form action={deleteMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          type="submit"
                        >
                          削除
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
