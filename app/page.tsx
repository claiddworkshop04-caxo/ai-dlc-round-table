import { eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loans, items } from "@/src/schema";

export const dynamic = "force-dynamic";

async function getActiveLoans() {
  const { db } = await import("@/src/db");
  return db
    .select({
      loanId: loans.id,
      itemId: loans.itemId,
      itemName: items.name,
      borrowerName: loans.borrowerName,
      loanedAt: loans.loanedAt,
      dueDate: loans.dueDate,
    })
    .from(loans)
    .innerJoin(items, eq(loans.itemId, items.id))
    .where(isNull(loans.returnedAt))
    .orderBy(loans.dueDate);
}

export default async function DashboardPage() {
  const activeLoans = await getActiveLoans();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">貸出中一覧</h1>
        <Link href="/scan" className={cn(buttonVariants())}>
          QRスキャン
        </Link>
      </div>

      {activeLoans.length === 0 ? (
        <p className="text-sm text-muted-foreground">現在貸出中の備品はありません。</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">備品名</th>
                <th className="px-4 py-3 font-medium">借用者</th>
                <th className="px-4 py-3 font-medium">貸出日</th>
                <th className="px-4 py-3 font-medium">返却期限</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeLoans.map((loan) => {
                const isOverdue = loan.dueDate < today;
                return (
                  <tr key={loan.loanId} className={isOverdue ? "bg-red-50" : "bg-background"}>
                    <td className="px-4 py-3 font-medium">{loan.itemName}</td>
                    <td className="px-4 py-3">{loan.borrowerName}</td>
                    <td className="px-4 py-3">{loan.loanedAt}</td>
                    <td className="px-4 py-3">
                      <span className={isOverdue ? "font-semibold text-red-600" : ""}>
                        {loan.dueDate}
                        {isOverdue && " ⚠ 期限超過"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/items/${loan.itemId}/loan`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        返却
                      </Link>
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
