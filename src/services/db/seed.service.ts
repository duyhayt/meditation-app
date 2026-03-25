import { APP_NAME, DEFAULT_CURRENCY } from '@/config/constants';
import { createId, getNowIsoString } from '@/services/db/db.utils';
import type { SQLiteExecutor } from '@/services/db/sqlite.types';
import { calculateDebtSnapshot } from '@/services/debts/debt-calculations';

function buildDemoTimestamp(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

export async function seedDevelopmentData(database: SQLiteExecutor): Promise<void> {
  const existingContact = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM contacts'
  );

  if ((existingContact?.count ?? 0) > 0) {
    return;
  }

  const now = getNowIsoString();
  const contactA = createId('contact');
  const contactB = createId('contact');
  const debtA = createId('debt');
  const debtB = createId('debt');
  const paymentA = createId('payment');
  const reminderA = createId('reminder');
  const reminderB = createId('reminder');
  const familyTag = createId('tag');
  const businessTag = createId('tag');

  await database.runAsync(
    'INSERT INTO contacts (id, name, phone, email, address, note, avatar_uri, is_archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    contactA,
    'Nguyen Minh Anh',
    '0909123456',
    'minhanh@example.com',
    'District 1, Ho Chi Minh City',
    'Frequently settles in installments.',
    null,
    0,
    now,
    now
  );
  await database.runAsync(
    'INSERT INTO contacts (id, name, phone, email, address, note, avatar_uri, is_archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    contactB,
    'Tran Bao Chau',
    '0911222333',
    'baochau@example.com',
    'Thu Duc City',
    'Supplier account.',
    null,
    0,
    now,
    now
  );

  await database.runAsync(
    'INSERT INTO tags (id, name, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    familyTag,
    'Family',
    '#6FCF97',
    now,
    now
  );
  await database.runAsync(
    'INSERT INTO tags (id, name, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
    businessTag,
    'Business',
    '#D9C27C',
    now,
    now
  );

  const lendSnapshot = calculateDebtSnapshot({
    principalAmount: 5000000,
    paidAmount: 1500000,
    dueDate: buildDemoTimestamp(7)
  });
  const borrowSnapshot = calculateDebtSnapshot({
    principalAmount: 3000000,
    paidAmount: 0,
    dueDate: buildDemoTimestamp(-3)
  });

  await database.runAsync(
    'INSERT INTO debts (id, contact_id, direction, title, description, principal_amount, paid_amount, remaining_amount, currency_code, issue_date, due_date, status, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    debtA,
    contactA,
    'lend',
    'Personal loan',
    'Short-term support for household expenses.',
    5000000,
    lendSnapshot.paidAmount,
    lendSnapshot.remainingAmount,
    DEFAULT_CURRENCY,
    now,
    buildDemoTimestamp(7),
    lendSnapshot.status,
    'Track weekly payments.',
    now,
    now
  );
  await database.runAsync(
    'INSERT INTO debts (id, contact_id, direction, title, description, principal_amount, paid_amount, remaining_amount, currency_code, issue_date, due_date, status, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    debtB,
    contactB,
    'borrow',
    'Inventory order',
    'Borrowed to restock store inventory.',
    3000000,
    borrowSnapshot.paidAmount,
    borrowSnapshot.remainingAmount,
    DEFAULT_CURRENCY,
    now,
    buildDemoTimestamp(-3),
    borrowSnapshot.status,
    'Overdue sample debt.',
    now,
    now
  );

  await database.runAsync(
    'INSERT INTO payments (id, debt_id, amount, payment_date, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    paymentA,
    debtA,
    1500000,
    buildDemoTimestamp(-1),
    'Initial partial payment',
    now,
    now
  );

  await database.runAsync(
    'INSERT INTO reminders (id, debt_id, remind_at, channel, status, note, is_enabled, last_triggered_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    reminderA,
    debtA,
    buildDemoTimestamp(3),
    'local',
    'pending',
    'Call before due date',
    1,
    null,
    now,
    now
  );
  await database.runAsync(
    'INSERT INTO reminders (id, debt_id, remind_at, channel, status, note, is_enabled, last_triggered_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    reminderB,
    debtB,
    buildDemoTimestamp(1),
    'local',
    'pending',
    'Urgent follow-up',
    1,
    null,
    now,
    now
  );

  await database.runAsync(
    'INSERT INTO debt_tags (debt_id, tag_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
    debtA,
    familyTag,
    now,
    now
  );
  await database.runAsync(
    'INSERT INTO debt_tags (debt_id, tag_id, created_at, updated_at) VALUES (?, ?, ?, ?)',
    debtB,
    businessTag,
    now,
    now
  );

  await database.runAsync(
    'INSERT INTO app_settings (key, value, value_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, value_type = excluded.value_type, updated_at = excluded.updated_at',
    'app_name',
    APP_NAME,
    'string',
    now,
    now
  );
}
