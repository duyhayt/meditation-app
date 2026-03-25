export type SQLiteBindValue = string | number | null;

export type SQLiteStatementResult = {
  lastInsertRowId: number;
  changes: number;
};

export type SQLiteExecutor = {
  execAsync: (source: string) => Promise<void>;
  getFirstAsync: <TRow>(source: string, ...params: SQLiteBindValue[]) => Promise<TRow | null>;
  getAllAsync: <TRow>(source: string, ...params: SQLiteBindValue[]) => Promise<TRow[]>;
  runAsync: (source: string, ...params: SQLiteBindValue[]) => Promise<SQLiteStatementResult>;
};
