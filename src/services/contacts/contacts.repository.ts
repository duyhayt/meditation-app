import type { ContactRecord } from '@/domain/database';
import { createId, fromSqliteBoolean, getNowIsoString, toSqliteBoolean } from '@/services/db/db.utils';
import { upsertSyncMetadata, writeActivityLog } from '@/services/db/internal-metadata';
import type { DatabaseService, LoggerService } from '@/services/di/types';

type ContactRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  note: string | null;
  avatar_uri: string | null;
  is_archived: number;
  created_at: string;
  updated_at: string;
};

type CreateContactInput = Omit<ContactRecord, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateContactInput = Partial<CreateContactInput>;

function mapContactRow(row: ContactRow): ContactRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    note: row.note,
    avatarUri: row.avatar_uri,
    isArchived: fromSqliteBoolean(row.is_archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createContactsRepository(deps: {
  databaseService: DatabaseService;
  loggerService: LoggerService;
}) {
  return {
    list: async (): Promise<ContactRecord[]> => {
      const database = await deps.databaseService.getDatabase();
      const rows = await database.getAllAsync<ContactRow>(
        'SELECT * FROM contacts ORDER BY updated_at DESC, name COLLATE NOCASE ASC'
      );
      return rows.map(mapContactRow);
    },
    getById: async (id: string): Promise<ContactRecord | null> => {
      const database = await deps.databaseService.getDatabase();
      const row = await database.getFirstAsync<ContactRow>('SELECT * FROM contacts WHERE id = ?', id);
      return row ? mapContactRow(row) : null;
    },
    create: async (input: CreateContactInput): Promise<ContactRecord> => {
      const database = await deps.databaseService.getDatabase();
      const id = createId('contact');
      const now = getNowIsoString();

      await database.runAsync(
        'INSERT INTO contacts (id, name, phone, email, address, note, avatar_uri, is_archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id,
        input.name,
        input.phone,
        input.email,
        input.address,
        input.note,
        input.avatarUri,
        toSqliteBoolean(input.isArchived),
        now,
        now
      );

      await writeActivityLog({ database, entityType: 'contact', entityId: id, action: 'created', payload: input });
      await upsertSyncMetadata({ database, entityType: 'contact', entityId: id });

      deps.loggerService.info('Contact created', { id });

      return {
        id,
        ...input,
        createdAt: now,
        updatedAt: now
      };
    },
    update: async (id: string, input: UpdateContactInput): Promise<ContactRecord | null> => {
      const current = await deps.databaseService
        .getDatabase()
        .then((database) => database.getFirstAsync<ContactRow>('SELECT * FROM contacts WHERE id = ?', id));

      if (!current) {
        return null;
      }

      const database = await deps.databaseService.getDatabase();
      const next: ContactRecord = {
        ...mapContactRow(current),
        ...input,
        updatedAt: getNowIsoString()
      };

      await database.runAsync(
        'UPDATE contacts SET name = ?, phone = ?, email = ?, address = ?, note = ?, avatar_uri = ?, is_archived = ?, updated_at = ? WHERE id = ?',
        next.name,
        next.phone,
        next.email,
        next.address,
        next.note,
        next.avatarUri,
        toSqliteBoolean(next.isArchived),
        next.updatedAt,
        id
      );

      await writeActivityLog({ database, entityType: 'contact', entityId: id, action: 'updated', payload: input });
      await upsertSyncMetadata({ database, entityType: 'contact', entityId: id });

      return next;
    },
    remove: async (id: string): Promise<void> => {
      const database = await deps.databaseService.getDatabase();
      await database.runAsync('DELETE FROM contacts WHERE id = ?', id);
      await writeActivityLog({ database, entityType: 'contact', entityId: id, action: 'deleted' });
      await upsertSyncMetadata({ database, entityType: 'contact', entityId: id });
    }
  };
}
