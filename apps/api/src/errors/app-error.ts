export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(options: { code: string; message: string; statusCode: number }) {
    super(options.message);

    this.name = "AppError";
    this.code = options.code;
    this.statusCode = options.statusCode;
  }
}
