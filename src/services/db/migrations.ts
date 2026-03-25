import type { SQLiteExecutor } from './sqlite.types';

export type DatabaseMigration = {
  version: number;
  description: string;
  up: (database: SQLiteExecutor) => Promise<void>;
};

const migration1Sql = `
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    note TEXT,
    avatar_uri TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_contacts_updated_at ON contacts(updated_at DESC);

  CREATE TABLE IF NOT EXISTS debts (
    id TEXT PRIMARY KEY NOT NULL,
    contact_id TEXT NOT NULL,
    direction TEXT NOT NULL CHECK(direction IN ('lend', 'borrow')),
    title TEXT NOT NULL,
    description TEXT,
    principal_amount REAL NOT NULL CHECK(principal_amount >= 0),
    paid_amount REAL NOT NULL DEFAULT 0 CHECK(paid_amount >= 0),
    remaining_amount REAL NOT NULL CHECK(remaining_amount >= 0),
    currency_code TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    due_date TEXT,
    status TEXT NOT NULL CHECK(status IN ('unpaid', 'partial', 'paid', 'overdue')),
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_debts_contact_id ON debts(contact_id);
  CREATE INDEX IF NOT EXISTS idx_debts_direction_status ON debts(direction, status);
  CREATE INDEX IF NOT EXISTS idx_debts_due_date ON debts(due_date);
  CREATE INDEX IF NOT EXISTS idx_debts_updated_at ON debts(updated_at DESC);

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY NOT NULL,
    debt_id TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    payment_date TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(debt_id) REFERENCES debts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON payments(debt_id);
  CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date DESC);

  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY NOT NULL,
    debt_id TEXT NOT NULL,
    remind_at TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'local',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'dismissed', 'completed')),
    note TEXT,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    last_triggered_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(debt_id) REFERENCES debts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_reminders_due_status ON reminders(remind_at, status);
  CREATE INDEX IF NOT EXISTS idx_reminders_debt_id ON reminders(debt_id);

  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name COLLATE NOCASE);

  CREATE TABLE IF NOT EXISTS debt_tags (
    debt_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (debt_id, tag_id),
    FOREIGN KEY(debt_id) REFERENCES debts(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_debt_tags_tag_id ON debt_tags(tag_id);

  CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY NOT NULL,
    debt_id TEXT NOT NULL,
    payment_id TEXT,
    file_name TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    mime_type TEXT,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(debt_id) REFERENCES debts(id) ON DELETE CASCADE,
    FOREIGN KEY(payment_id) REFERENCES payments(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_attachments_debt_id ON attachments(debt_id);
  CREATE INDEX IF NOT EXISTS idx_attachments_payment_id ON attachments(payment_id);

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    value_type TEXT NOT NULL CHECK(value_type IN ('string', 'number', 'boolean', 'json')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    payload_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS sync_metadata (
    id TEXT PRIMARY KEY NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    sync_state TEXT NOT NULL CHECK(sync_state IN ('local_only', 'pending_upload', 'synced', 'conflict')),
    last_synced_at TEXT,
    dirty INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(entity_type, entity_id)
  );

  CREATE INDEX IF NOT EXISTS idx_sync_metadata_state ON sync_metadata(sync_state, dirty);
`;

const migration2Sql = `
  CREATE INDEX IF NOT EXISTS idx_debts_status_due_date ON debts(status, due_date);
  CREATE INDEX IF NOT EXISTS idx_debts_direction_remaining_amount ON debts(direction, remaining_amount);
  CREATE INDEX IF NOT EXISTS idx_reminders_active_queue ON reminders(is_enabled, status, remind_at);
`;

export const databaseMigrations: DatabaseMigration[] = [
  {
    version: 1,
    description: 'Create Debt Note App core schema',
    up: async (database) => {
      await database.execAsync(migration1Sql);
    }
  },
  {
    version: 2,
    description: 'Add indexes for reminders and statistics queries',
    up: async (database) => {
      await database.execAsync(migration2Sql);
    }
  }
];

export function getLatestSchemaVersion(): number {
  return databaseMigrations[databaseMigrations.length - 1]?.version ?? 0;
}

export async function runMigrations(database: SQLiteExecutor, currentVersion: number): Promise<number> {
  let appliedVersion = currentVersion;

  for (const migration of databaseMigrations) {
    if (migration.version > currentVersion) {
      await migration.up(database);
      appliedVersion = migration.version;
    }
  }

  return appliedVersion;
}
