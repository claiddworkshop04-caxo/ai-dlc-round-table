# Bolt: UNIT-001 bolt-003

## 0. Bolt 目的
- 対象Intent: INT-000
- 対象Unit: INT-000_UNIT-001
- 対象User Stories: US-002
- Goal (Definition of Done): メンバーマスタのCRUD画面が動作すること

## 1. スコープ
### In Scope
- `/members` メンバー一覧ページ
- `/members/new` メンバー新規登録フォーム
- `/members/[id]/edit` メンバー編集フォーム
- メンバー削除アクション
- `src/actions/members.ts` Server Actions

### Out of Scope
- 貸出・返却操作での選択UI（UNIT-002で実装）

## 2. 依存関係・前提条件
- 依存: bolt-001 完了（membersテーブル存在）

## 3. Design Diff
- 更新対象: コンポーネント設計
- 変更内容: /members ルート群の実装

## 4. 実装・テスト
- 対象パス:
  - `app/members/page.tsx`
  - `app/members/new/page.tsx`
  - `app/members/[id]/edit/page.tsx`
  - `src/actions/members.ts`
- 確認観点: メンバー登録→一覧表示→編集→削除 が動作すること

## 5. Deployment Units
- 特記なし

## 6. Approval Gate
- [ ] メンバーCRUD が動作する

## Outcome
- 完了内容: (実装後に記載)

## Next Bolt
- UNIT-002 bolt-001: QRスキャン + 貸出フォーム
