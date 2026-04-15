# Bolt: UNIT-003 bolt-001

## 0. Bolt 目的
- 対象Intent: INT-000
- 対象Unit: INT-000_UNIT-003
- 対象User Stories: US-006, US-007
- Goal (Definition of Done): トップページに貸出中一覧が表示され、期限超過行が強調表示されること

## 1. スコープ
### In Scope
- `app/page.tsx` のダッシュボード実装（既存の Comments ページを置き換え）
- 貸出中の loans を items JOIN で取得・表示
- 返却期限超過（due_date < 今日 かつ returned_at IS NULL）の行を赤色ハイライト
- 全貸出履歴の切り替え表示（返却済み含む）
- `app/loans/page.tsx` 貸出履歴一覧ページ（オプション）
- ナビゲーションの整備（備品管理・メンバー管理・スキャン へのリンク）

### Out of Scope
- 貸出・返却操作（UNIT-002で実装済み）

## 2. 依存関係・前提条件
- 依存: UNIT-001, UNIT-002 完了

## 3. Design Diff
- 更新対象: コンポーネント設計
- 変更内容: app/page.tsx を ダッシュボードに刷新、ナビゲーション追加

## 4. 実装・テスト
- 対象パス:
  - `app/page.tsx`
  - `app/layout.tsx`（ナビゲーション追加）
  - `app/loans/page.tsx`
  - `components/LoanStatusBadge.tsx`
- 確認観点:
  - 貸出中の備品が一覧に表示される（備品名・借用者・貸出日・返却期限）
  - 期限超過の行が赤色でハイライトされる
  - 全履歴の切り替えが動作する

## 5. Deployment Units
- 特記なし

## 6. Approval Gate
- [ ] 貸出中一覧が正しく表示される
- [ ] 期限超過ハイライトが正確に動作する
- [ ] ナビゲーションが整備されている

## Outcome
- 完了内容: (実装後に記載)

## Next Bolt
- なし（本Boltで全US完了）
