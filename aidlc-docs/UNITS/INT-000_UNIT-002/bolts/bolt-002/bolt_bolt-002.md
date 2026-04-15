# Bolt: UNIT-002 bolt-002

## 0. Bolt 目的
- 対象Intent: INT-000
- 対象Unit: INT-000_UNIT-002
- 対象User Stories: US-005
- Goal (Definition of Done): 貸出中備品のQRスキャン後に返却確認画面が表示され、返却が記録されること

## 1. スコープ
### In Scope
- `/items/[id]/loan` への返却フォーム追加（貸出中の場合に表示）
- `src/actions/loans.ts` returnLoan Server Action
- 返却後のリダイレクト（ダッシュボードまたは元のページ）

### Out of Scope
- 新規貸出操作（bolt-001で実装済み）

## 2. 依存関係・前提条件
- 依存: bolt-001 完了（/items/[id]/loan の基本構造）

## 3. Design Diff
- 更新対象: コンポーネント設計
- 変更内容: /items/[id]/loan の返却分岐実装

## 4. 実装・テスト
- 対象パス:
  - `app/items/[id]/loan/page.tsx`（返却フォーム追加）
  - `src/actions/loans.ts`（returnLoan追加）
- 確認観点:
  - 貸出中備品のQRスキャン後に返却確認ボタンが表示される
  - 返却後に returned_at が記録される
  - 返却後にその備品が再び貸出可能になる

## 5. Deployment Units
- 特記なし

## 6. Approval Gate
- [ ] 返却操作が正しく動作する
- [ ] 返却後に再貸出可能になる

## Outcome
- 完了内容: (実装後に記載)

## Next Bolt
- UNIT-003 bolt-001: ダッシュボード
