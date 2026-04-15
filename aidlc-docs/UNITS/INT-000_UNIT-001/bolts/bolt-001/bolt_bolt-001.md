# Bolt: UNIT-001 bolt-001

## 0. Bolt 目的
- 対象Intent: INT-000
- 対象Unit: INT-000_UNIT-001
- 対象User Stories: US-001, US-002, US-004, US-005, US-006
- Goal (Definition of Done): items / members / loans の3テーブルが Neon PostgreSQL に作成され、Drizzle スキーマが定義済みであること

## 1. スコープ
### In Scope
- `src/schema.ts` への items / members / loans テーブル定義の追加
- `drizzle-kit generate` + `drizzle-kit migrate` によるマイグレーション実行
- 既存の comments テーブルは維持する

### Out of Scope
- UI実装
- Server Actions実装

## 2. 依存関係・前提条件
- 依存: Neon PostgreSQL 接続設定済み（DATABASE_URL または NETLIFY_DATABASE_URL）
- 前提: drizzle-kit がインストール済み

## 3. Design Diff
- 更新対象: 論理設計（DBスキーマ）
- 変更内容:
  - items テーブル追加（id, name, description, default_loan_days, created_at）
  - members テーブル追加（id, name, created_at）
  - loans テーブル追加（id, item_id FK, borrower_name, loaned_at, due_date, returned_at, created_at）

## 4. 実装・テスト
- 対象パス: `src/schema.ts`
- 確認観点: マイグレーション完了後、テーブルが作成されていること

## 5. Deployment Units
- `drizzle-kit migrate` をローカルおよびNetlifyのpostinstallフックで実行

## 6. Approval Gate
- [ ] スコープ合意済み
- [ ] DBスキーマが要件を満たしている
- [ ] マイグレーション実行確認済み

## Outcome
- 完了内容: (実装後に記載)
- 未完了: (実装後に記載)

## Open Issues
- なし

## Next Bolt
- bolt-002: 備品マスタCRUD + QRコード表示
