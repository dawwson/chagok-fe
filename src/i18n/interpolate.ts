/**
 * 다국어 지원 치환 함수
 * @param template 텍스트
 * @param variables 템플릿에 삽입할 변수들 (선택)
 * @returns 치환된 문자열
 */
export function t(
  template: string,
  variables?: Record<string, unknown>
): string {
  if (!variables) return template;

  return template.replace(/{(\w+)}/g, (_, key) => {
    const value = variables[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}
