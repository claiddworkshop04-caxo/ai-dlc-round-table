"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function QrScanner() {
  const regionId = "qr-reader";
  const scannerRef = useRef<unknown>(null);
  const router = useRouter();

  useEffect(() => {
    let stopped = false;

    async function start() {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      const scanner = new Html5QrcodeScanner(
        regionId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );
      scannerRef.current = scanner;

      scanner.render(
        (decodedText: string) => {
          if (stopped) return;
          stopped = true;
          scanner.clear().catch(() => {});

          // QRコードに含まれる URL から /items/[id]/loan を抽出
          try {
            const url = new URL(decodedText);
            const match = url.pathname.match(/^\/items\/(\d+)\/loan/);
            if (match) {
              router.push(`/items/${match[1]}/loan`);
              return;
            }
          } catch {
            // URL でない場合はそのまま使う
          }
          // フォールバック: テキストが数字だけなら itemId として扱う
          if (/^\d+$/.test(decodedText.trim())) {
            router.push(`/items/${decodedText.trim()}/loan`);
          } else {
            alert(`認識できないQRコードです:\n${decodedText}`);
            stopped = false;
          }
        },
        () => {}, // error callback (毎フレーム呼ばれるので無視)
      );
    }

    start();

    return () => {
      stopped = true;
      const s = scannerRef.current as { clear?: () => Promise<void> } | null;
      s?.clear?.().catch(() => {});
    };
  }, [router]);

  return (
    <div className="w-full">
      <div id={regionId} className="w-full" />
    </div>
  );
}
