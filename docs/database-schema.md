# Database Schema - Phase 5

Schema version hien tai: `2`.

## Bang chinh

### `contacts`
- PK: `id`
- Muc dich: danh ba doi tac/noi bo cho cac khoan no
- Index: `name`, `updated_at`

### `debts`
- PK: `id`
- FK: `contact_id -> contacts.id`
- Muc dich: khoan cho vay hoac di vay
- Cot quan trong:
  - `direction`: `lend | borrow`
  - `status`: `unpaid | partial | paid | overdue`
  - `paid_amount`, `remaining_amount`
- Index:
  - `contact_id`
  - `(direction, status)`
  - `due_date`
  - `updated_at`
  - `(status, due_date)`
  - `(direction, remaining_amount)`

### `payments`
- PK: `id`
- FK: `debt_id -> debts.id`
- Muc dich: ghi nhan nhieu lan thanh toan cho mot khoan no
- Index: `debt_id`, `payment_date`

### `reminders`
- PK: `id`
- FK: `debt_id -> debts.id`
- Muc dich: lich nhac no local
- Index:
  - `(remind_at, status)`
  - `debt_id`
  - `(is_enabled, status, remind_at)`

### `tags`
- PK: `id`
- Muc dich: phan loai khoan no
- Index: `name` unique + search

### `debt_tags`
- PK: `(debt_id, tag_id)`
- FK: `debt_id -> debts.id`, `tag_id -> tags.id`
- Muc dich: lien ket many-to-many giua debt va tag

### `attachments`
- PK: `id`
- FK: `debt_id -> debts.id`, `payment_id -> payments.id`
- Muc dich: file dinh kem cho debt/payment
- Index: `debt_id`, `payment_id`

### `app_settings`
- PK: `key`
- Muc dich: setting local trong DB
- Dang duoc dong bo voi preference quan trong: `language`, `theme_preference`, `currency_code`, `has_completed_onboarding`

### `activity_logs`
- PK: `id`
- Muc dich: audit trail local cho cac thao tac repository
- Index: `(entity_type, entity_id, created_at)`

### `sync_metadata`
- PK: `id`
- Unique: `(entity_type, entity_id)`
- Muc dich: luu trang thai sync future phase
- Index: `(sync_state, dirty)`

## Backup Restore

- Backup xuat JSON snapshot cho 10 bang duoc quan ly.
- Restore se clear du lieu cac bang app va insert lai snapshot.
- `app_metadata` khong thuoc backup payload; schema version duoc quan ly boi migration service.
