import { revalidatePath } from "next/cache";
import { eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { items, loans } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getItems() {
  const { db } = await import("@/src/db");
  return db.select().from(items).orderBy(items.createdAt);
}

async function getActiveLoanItemIds(): Promise<Set<number>> {
  const { db } = await import("@/src/db");
  const activeLoans = await db
    .select({ itemId: loans.itemId })
    .from(loans)
    .where(isNull(loans.returnedAt));
  return new Set(activeLoans.map((l) => l.itemId));
}

export default async function ItemsPage() {
  const [itemList, activeLoanIds] = await Promise.all([
    getItems(),
    getActiveLoanItemIds(),
  ]);

  async function deleteItem(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!id) return;
    const { db } = await import("@/src/db");
    await db.delete(items).where(eq(items.id, id));
    revalidatePath("/items");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">備品マスタ</h1>
        <Link href="/items/new" className={cn(buttonVariants())}>
          + 新規登録
        </Link>
      </div>

      {itemList.length === 0 ? (
        <p className="text-sm text-muted-foreground">備品が登録されていません。</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">備品名</th>
                <th className="px-4 py-3 font-medium">説明</th>
                <th className="px-4 py-3 font-medium">標準返却日数</th>
                <th className="px-4 py-3 font-medium">状態</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {itemList.map((item) => {
                const isLoaned = activeLoanIds.has(item.id);
                return (
                  <tr key={item.id} className="bg-background">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.description ?? "—"}
                    </td>
                    <td className="px-4 py-3">{item.defaultLoanDays} 日</td>
                    <td className="px-4 py-3">
                      {isLoaned ? (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          貸出中
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          空き
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/items/${item.id}/qr`}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        >
                          QR
                        </Link>
                        <Link
                          href={`/items/${item.id}/edit`}
                          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                        >
                          編集
                        </Link>
                        {!isLoaned && (
                          <form action={deleteItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              type="submit"
                            >
                              削除
                            </Button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
