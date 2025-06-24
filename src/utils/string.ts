import categoryJson from "../shared/category.json";
import txTypeJson from "../shared/txType.json";
import txMethodJson from "../shared/txMethod.json";

const categoryMap = new Map<number, (typeof categoryJson)[number]>(
  categoryJson.map((c) => [c.id, c])
);

const txTypeMap = new Map<string, string>(
  txTypeJson.map((t) => [t.name, t.label])
);

const txMethodMap = new Map<string, string>(
  txMethodJson.map((t) => [t.name, t.label])
);

/**
 * category 목록 가져오기
 */
export const getCategories = () => {
  return Array.from(categoryMap.values());
};

/**
 * category label 가져오기
 */
export const getCategoryLabel = (categoryId: number) => {
  return categoryMap.get(categoryId)?.label ?? "";
};

/**
 * txType label 가져오기
 */
export const getTxTypeLabel = (txType: "income" | "expense") => {
  return txTypeMap.get(txType) ?? "";
};

/**
 * txMethod label 가져오기
 */
export const getTxMethodLabel = (
  txMethod: "cash" | "debit card" | "credit card" | "bank transfer"
) => {
  return txMethodMap.get(txMethod) ?? "";
};
