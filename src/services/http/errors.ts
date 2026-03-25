export class AppError extends Error {
  public readonly code: string;

  public readonly status?: number;

  constructor(message: string, code = 'UNKNOWN_ERROR', status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
