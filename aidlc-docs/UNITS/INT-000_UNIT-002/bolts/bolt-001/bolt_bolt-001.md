# Bolt: UNIT-002 bolt-001

## 0. Bolt 目的
- 対象Intent: INT-000
- 対象Unit: INT-000_UNIT-002
- 対象User Stories: US-004
- Goal (Definition of Done): QRスキャン画面が動作し、スキャン後に貸出フォームが表示・送信できること

## 1. スコープ
### In Scope
- `/scan` QRスキャン画面（html5-qrcode 使用、Client Component）
- `components/QrScanner.tsx` QRスキャンコンポーネント
- `/items/[id]/loan` 貸出/返却分岐ページ（貸出中でなければ貸出フォームを表示）
- 貸出フォーム: メンバーリスト選択 + フリー入力切り替え
- 返却期限の自動計算・表示（貸出日 + default_loan_days）
- `src/actions/loans.ts` createLoan Server Action
- `html5-qrcode` npm パッケージのインストール

### Out of Scope
- 返却操作（bolt-002）

## 2. 依存関係・前提条件
- 依存: UNIT-001 bolt-001/002/003 完了
- 前提: `html5-qrcode` インストール済み

## 3. Design Diff
- 更新対象: コンポーネント設計
- 変更内容:
  - QrScanner.tsx の実装
  - /items/[id]/loan の貸出分岐実装

## 4. 実装・テスト
- 対象パス:
  - `app/scan/page.tsx`
  - `app/items/[id]/loan/page.tsx`
  - `components/QrScanner.tsx`
  - `src/actions/loans.ts`
- 確認観点:
  - QRスキャン後に正しいURLへ遷移する
  - 未貸出備品に対して貸出フォームが表示される
  - メンバー選択とフリー入力が切り替えられる
  - 返却期限が正しく計算・表示される
  - 貸出送信後にloansレコードが作成される

## 5. Deployment Units
- Netlify ビルド時に html5-qrcode が含まれること

## 6. Approval Gate
- [ ] QRスキャンが動作する
- [ ] 貸出フォームが正しく動作する
- [ ] 返却期限の自動計算が正確

## Outcome
- 完了内容: (実装後に記載)

## Next Bolt
- bolt-002: 返却操作フォーム
