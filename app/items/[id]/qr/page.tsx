import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { items } from "@/src/schema";

export const dynamic = "force-dynamic";

export default async function QrPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { db } = await import("@/src/db");
  const [item] = await db.select().from(items).where(eq(items.id, Number(id)));
  if (!item) notFound();

  const host =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.URL ??
    "http://localhost:3000";
  const loanUrl = `${host}/items/${item.id}/loan`;
  const qrDataUrl = await QRCode.toDataURL(loanUrl, { width: 300, margin: 2 });

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <img
            src={qrDataUrl}
            alt={`QR code for ${item.name}`}
            className="rounded-lg border border-border"
          />
          <p className="break-all text-center text-xs text-muted-foreground">
            {loanUrl}
          </p>
          <div className="flex w-full gap-2">
            <a
              href={qrDataUrl}
              download={`${item.name}_qr.png`}
              className={cn(buttonVariants(), "flex-1 justify-center")}
            >
              ダウンロード
            </a>
            <a
              href="/items"
              className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
            >
              戻る
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
