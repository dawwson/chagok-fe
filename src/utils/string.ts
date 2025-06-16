// TODO: i18n 도입 후 label만 다국어 문자열로 치환할 예정.
// TODO: 유틸함수들은 i18n 시스템과 함께 컨텍스트 안에서 동작하도록 커스텀 훅으로 변경해야 한다.

import categoryJson from "../shared/category.json";
import txTypeJson from "../shared/txType.json";
import txMethodJson from "../shared/txMethod.json";

type Language = "ko" | "en";

type Category = (typeof categoryJson)[number];
type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

const categoryMap = new Map<number, Category>(
  categoryJson.map((c) => [c.id, c])
);

const txTypeMap = new Map<string, Record<Language, string>>(
  txTypeJson.map((t) => [t.name, t.labels])
);

const txMethodMap = new Map<string, Record<Language, string>>(
  txMethodJson.map((t) => [t.name, t.labels])
);

/**
 * category 목록 가져오기
 */
export const getCategories = (
  options: { language: Language } = { language: "ko" }
) => {
  return Array.from(categoryMap.values()).map(({ labels, ...rest }) => ({
    ...rest,
    label: labels[options.language],
  }));
};

/**
 * 언어별 category label 가져오기
 */
export const getCategoryLabel = (
  categoryId: number,
  options: { language: Language } = { language: "ko" }
) => {
  return categoryMap.get(categoryId)?.labels[options.language] ?? "";
};

/**
 * 언어별 txType label 가져오기
 */
export const getTxTypeLabel = (
  txType: TxType,
  options: { language: Language } = { language: "ko" }
) => {
  return txTypeMap.get(txType)?.[options.language] ?? "";
};

/**
 * 언어별 txMethod label 가져오기
 */
export const getTxMethodLabel = (
  txMethod: TxMethod,
  options: { language: Language } = { language: "ko" }
) => {
  return txMethodMap.get(txMethod)?.[options.language] ?? "";
};
