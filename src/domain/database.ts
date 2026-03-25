export type AppSettingRecord = {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
  createdAt: string;
  updatedAt: string;
};
