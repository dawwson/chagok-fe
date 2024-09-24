export class ApiError extends Error {
  path: string;
  errorCode: string;
  detail: number;
  timestamp: string;

  constructor(
    path: string,
    errorCode: string,
    detail: number,
    timestamp: string
  ) {
    super(`Error ${errorCode}: ${detail}`);
    this.path = path;
    this.errorCode = errorCode;
    this.detail = detail;
    this.timestamp = timestamp;
  }
}
