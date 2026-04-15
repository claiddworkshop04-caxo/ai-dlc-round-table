# Bolt: UNIT-001 bolt-002

## 0. Bolt 目的
- 対象Intent: INT-000
- 対象Unit: INT-000_UNIT-001
- 対象User Stories: US-001, US-003
- Goal (Definition of Done): 備品マスタのCRUD画面が動作し、QRコードを表示・ダウンロードできること

## 1. スコープ
### In Scope
- `/items` 備品一覧ページ（shadcn/ui Table or Card）
- `/items/new` 備品新規登録フォーム
- `/items/[id]/edit` 備品編集フォーム
- 備品削除アクション（貸出中チェック）
- `/items/[id]/qr` QRコード表示・ダウンロードページ
- `src/actions/items.ts` Server Actions
- `components/QrCodeDisplay.tsx` コンポーネント
- `qrcode` npm パッケージのインストール

### Out of Scope
- メンバー管理
- 貸出・返却操作

## 2. 依存関係・前提条件
- 依存: bolt-001 完了（itemsテーブル存在）
- 前提: `qrcode` + `@types/qrcode` インストール済み

## 3. Design Diff
- 更新対象: コンポーネント設計
- 変更内容:
  - QrCodeDisplay.tsx の実装
  - /items ルート群の実装

## 4. 実装・テスト
- 対象パス:
  - `app/items/page.tsx`
  - `app/items/new/page.tsx`
  - `app/items/[id]/edit/page.tsx`
  - `app/items/[id]/qr/page.tsx`
  - `src/actions/items.ts`
  - `components/QrCodeDisplay.tsx`
- 確認観点: 備品登録→一覧表示→QR表示→DL が動作すること

## 5. Deployment Units
- Netlify ビルド時に `npm install` で qrcode パッケージが含まれること

## 6. Approval Gate
- [ ] 備品CRUD が動作する
- [ ] QRコードが表示・ダウンロードできる
- [ ] 貸出中備品の削除が拒否される

## Outcome
- 完了内容: (実装後に記載)

## Next Bolt
- bolt-003: メンバーマスタCRUD
