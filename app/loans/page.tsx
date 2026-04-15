import { eq, desc, isNull } from "drizzle-orm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loans, items } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getAllLoans() {
  const { db } = await import("@/src/db");
  return db
    .select({
      loanId: loans.id,
      itemId: loans.itemId,
      itemName: items.name,
      borrowerName: loans.borrowerName,
      loanedAt: loans.loanedAt,
      dueDate: loans.dueDate,
      returnedAt: loans.returnedAt,
    })
    .from(loans)
    .innerJoin(items, eq(loans.itemId, items.id))
    .orderBy(desc(loans.createdAt));
}

export default async function LoansPage() {
  const allLoans = await getAllLoans();
  const today = new Date().toISOString().slice(0, 10);

  const activeCount = allLoans.filter((l) => !l.returnedAt).length;
  const overdueCount = allLoans.filter(
    (l) => !l.returnedAt && l.dueDate < today,
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">貸出履歴</h1>
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          ダッシュボード
        </Link>
      </div>

      {/* サマリー */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">総件数</p>
          <p className="mt-1 text-2xl font-bold">{allLoans.length}</p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs text-orange-600">貸出中</p>
          <p className="mt-1 text-2xl font-bold text-orange-700">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-xs text-red-600">期限超過</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{overdueCount}</p>
        </div>
      </div>

      {allLoans.length === 0 ? (
        <p className="text-sm text-muted-foreground">貸出履歴がありません。</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">備品名</th>
                <th className="px-4 py-3 font-medium">借用者</th>
                <th className="px-4 py-3 font-medium">貸出日</th>
                <th className="px-4 py-3 font-medium">返却期限</th>
                <th className="px-4 py-3 font-medium">返却日</th>
                <th className="px-4 py-3 font-medium">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allLoans.map((loan) => {
                const isActive = !loan.returnedAt;
                const isOverdue = isActive && loan.dueDate < today;
                return (
                  <tr
                    key={loan.loanId}
                    className={isOverdue ? "bg-red-50" : "bg-background"}
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/items/${loan.itemId}/loan`}
                        className="hover:underline"
                      >
                        {loan.itemName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{loan.borrowerName}</td>
                    <td className="px-4 py-3">{loan.loanedAt}</td>
                    <td className="px-4 py-3">
                      <span className={isOverdue ? "font-semibold text-red-600" : ""}>
                        {loan.dueDate}
                        {isOverdue && " ⚠"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {loan.returnedAt
                        ? loan.returnedAt.toLocaleDateString("ja-JP")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isOverdue ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          期限超過
                        </span>
                      ) : isActive ? (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          貸出中
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          返却済
                        </span>
                      )}
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
