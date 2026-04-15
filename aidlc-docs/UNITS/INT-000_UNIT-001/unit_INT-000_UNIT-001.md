# INT-000 UNIT-001: マスタ管理・QR生成

## 目的
備品マスタ・メンバーマスタのCRUD機能と、備品へのQRコード生成機能を実装する。
後続のUnit（QRスキャン・貸出返却・ダッシュボード）が依存するDBスキーマも本Unitで確立する。

## 担当 User Stories
- US-001: 備品マスタを管理する
- US-002: メンバーマスタを管理する
- US-003: 備品のQRコードを生成・表示する

## 境界 (Boundaries)
- IN: items/members/loans テーブル定義、備品CRUD、メンバーCRUD、QR生成・表示
- OUT: 貸出・返却操作、ダッシュボード表示、QRスキャン機能

## 依存関係
- 既存: Drizzle ORM + Neon PostgreSQL 接続（src/db.ts 確立済み）
- 新規依存: `qrcode` npm パッケージ

## Bolt 一覧
| Bolt ID | タイトル |
|---------|----------|
| bolt-001 | DBスキーマ定義 + マイグレーション |
| bolt-002 | 備品マスタCRUD + QRコード表示 |
| bolt-003 | メンバーマスタCRUD |
