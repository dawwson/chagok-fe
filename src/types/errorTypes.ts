export class ApiError extends Error {
  path: string;
  errorCode: string;
  detail: string;
  timestamp: string;

  constructor(
    path: string,
    errorCode: string,
    detail: string,
    timestamp: string
  ) {
    super(`Error ${errorCode}: ${detail}`);
    this.path = path;
    this.errorCode = errorCode;
    this.detail = detail;
    this.timestamp = timestamp;
  }
}
