import type { ProductType } from "@/api/types";

export const PRODUCT_TYPE_BADGES: Record<ProductType, string> = {
  ABAYA: "bg-violet-100 text-violet-700",
  HIJAB: "bg-pink-100 text-pink-700",
  DRESS: "bg-sky-100 text-sky-700",
  JILBAB: "bg-emerald-100 text-emerald-700",
  KHIMAR: "bg-amber-100 text-amber-700",
  THOWB: "bg-indigo-100 text-indigo-700",
};

export const PRODUCT_TYPE_LABELS:any = {
  ABAYA: "Abaya",
  HIJAB: "Hijab",
  DRESS: "Dress",
  JILBAB: "Jilbaab",
  KHIMAR: "Khimar",
  THOWB: "Thowb",
};
