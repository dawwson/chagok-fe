// TODO: 파일명 ApiError.ts, 폴더 위치 /src/errors/ 로 변경
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
