import { notFound, redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { items, loans, members } from "@/src/schema";

export const dynamic = "force-dynamic";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function LoanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  const { db } = await import("@/src/db");

  const [item] = await db.select().from(items).where(eq(items.id, itemId));
  if (!item) notFound();

  // 現在貸出中か確認
  const [activeLoan] = await db
    .select()
    .from(loans)
    .where(and(eq(loans.itemId, itemId), isNull(loans.returnedAt)));

  const memberList = await db.select().from(members).orderBy(members.name);

  const today = new Date().toISOString().slice(0, 10);
  const dueDate = addDays(today, item.defaultLoanDays);

  // 返却処理
  async function returnItem() {
    "use server";
    if (!activeLoan) return;
    const { db } = await import("@/src/db");
    await db
      .update(loans)
      .set({ returnedAt: new Date() })
      .where(eq(loans.id, activeLoan.id));
    redirect("/");
  }

  // 貸出処理
  async function createLoan(formData: FormData) {
    "use server";
    const memberSelect = formData.get("memberSelect") as string | null;
    const borrowerNameFree = formData.get("borrowerNameFree") as string | null;
    const borrowerName =
      memberSelect && memberSelect !== "__free__"
        ? memberSelect
        : borrowerNameFree;
    const due = formData.get("dueDate");
    if (typeof borrowerName !== "string" || borrowerName.trim() === "") return;
    if (typeof due !== "string" || due === "") return;

    const { db } = await import("@/src/db");
    // 同時貸出チェック（再確認）
    const [existing] = await db
      .select()
      .from(loans)
      .where(and(eq(loans.itemId, itemId), isNull(loans.returnedAt)));
    if (existing) redirect(`/items/${itemId}/loan`);

    await db.insert(loans).values({
      itemId,
      borrowerName: borrowerName.trim(),
      loanedAt: today,
      dueDate: due,
    });
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeLoan ? (
            /* 返却フォーム */
            <div className="space-y-4">
              <div className="rounded-lg bg-orange-50 p-4 text-sm">
                <p className="font-medium text-orange-800">貸出中</p>
                <p className="mt-1 text-orange-700">
                  借用者: <span className="font-semibold">{activeLoan.borrowerName}</span>
                </p>
                <p className="text-orange-700">
                  貸出日: {activeLoan.loanedAt} ／ 返却期限:{" "}
                  <span
                    className={
                      activeLoan.dueDate < today ? "font-semibold text-red-600" : ""
                    }
                  >
                    {activeLoan.dueDate}
                    {activeLoan.dueDate < today && " ⚠ 期限超過"}
                  </span>
                </p>
              </div>
              <form action={returnItem}>
                <Button type="submit" className="w-full">
                  返却する
                </Button>
              </form>
            </div>
          ) : (
            /* 貸出フォーム */
            <form action={createLoan} className="space-y-4">
              <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 font-medium">
                空き — 貸出可能
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="memberSelect">借用者 *</Label>
                {memberList.length > 0 ? (
                  <>
                    <select
                      name="memberSelect"
                      id="memberSelect"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      defaultValue=""
                    >
                      <option value="" disabled>メンバーを選択...</option>
                      {memberList.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                      <option value="__free__">その他（直接入力）</option>
                    </select>
                    <Input
                      id="borrowerNameFree"
                      name="borrowerNameFree"
                      placeholder="その他の場合: 氏名を入力"
                      className="mt-1"
                    />
                  </>
                ) : (
                  <Input
                    id="borrowerNameFree"
                    name="borrowerNameFree"
                    placeholder="氏名を入力してください"
                    required
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dueDate">
                  返却期限（標準: {item.defaultLoanDays}日後）
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  defaultValue={dueDate}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                貸出する
              </Button>
            </form>
          )}

          <Separator />
          <a
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-center",
            )}
          >
            ダッシュボードへ戻る
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
