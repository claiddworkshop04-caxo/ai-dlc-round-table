import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QrScanner from "./QrScanner";

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">QRスキャン</h1>
        <a href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          戻る
        </a>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        備品に貼られたQRコードをカメラに向けてください。
      </p>
      <QrScanner />
    </div>
  );
}
