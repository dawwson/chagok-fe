/**
 * 공백으로 구분된 소문자 문자열의 각 첫 글자를 대문자로 변환(e.g. bank transfer => Bank Transfer)
 */
export const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
