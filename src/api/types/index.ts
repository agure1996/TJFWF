// src/api/types/index.ts

// --------------------
// Generic API response
// --------------------
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// --------------------
// Products
// --------------------
export interface ProductDTO {
  productId: number;
  productName: string;
  productType: ProductType;
  productDescription?: string | null;
  supplierId?: number | null;
}

export interface RequestProductDTO {
  productName: string;
  productType: ProductType;
  productDescription?: string | null;
  supplierId?: number | null;
}

// --------------------
// Product Variants
// --------------------
export interface ProductVariantDTO {
  productVariantId: number;
  productId?: number;
  color?: string;
  size: number;
  quantity?: number;
  salePrice?: number;
  sku: string;
}

export interface RequestProductVariantDTO {
  productId?: number;
  color: string;
  size: number;     
  quantity: number;
  salePrice: number;
}

export type CreateProductVariantDTO = Omit<RequestProductVariantDTO, "productId">;

export const PRODUCT_TYPES = ["ABAYA", "HIJAB", "DRESS", "JILBAB", "KHIMAR", "THOWB"] as const;
export type ProductType = typeof PRODUCT_TYPES[number];

// --------------------
// Purchases
// --------------------
export interface PurchaseDTO {
  purchaseId: number;                 // was purchaseId
  supplier?: SupplierDTO;
  purchaseType: "SINGLE" | "BATCH";
  purchaseDate?: string;
  items: PurchaseItemDTO[];
  totalAmount?: number;
}

export interface PurchaseRowDTO {
  id: number;
  supplier?: SupplierDTO;
  supplierName: string;
  purchaseType: "SINGLE" | "BATCH";
  items: PurchaseItemDTO[];
  totalCost: number;
  purchaseDate?: string;
}

export interface PurchaseItemDTO {
  productVariant: ProductVariantDTO;
  quantity: number;
  costPrice: number;
}

// Backend request DTO
// optional, align backend requests
export interface RequestPurchaseDTO {
  supplierId?: number;
  purchaseType?: "SINGLE" | "BATCH";
  purchaseDate: string;
  items?: {
    productVariantId: number;
    quantity: number;
    costPrice: number;
  }[];
}

// --------------------
// Frontend-only request shape (matches backend)
// --------------------
export interface PurchaseItemRequest {
  productVariantId: number;
  quantity: number;
  costPrice: number;
}


export interface CreatePurchaseRequest {
  supplierId: number;
  purchaseType: "SINGLE" | "BATCH";
  purchaseDate: string;       // ISO string
  items: PurchaseItemRequest[];
}

// --------------------
// Sales
// --------------------
export interface SaleDTO {
  id: number;
  total?: number;
  saleDate?: string;
}

// --------------------
// Suppliers
// --------------------
export type SupplierDTO = {
  supplierId: number;
  supplierName: string;
  supplierContactInfo: string;
  notes?: string;
};

export type RequestSupplierDTO = {
  supplierName: string;
  supplierContactInfo: string;
  notes?: string;
};

// --------------------
// Expenses
// --------------------
export interface ExpenseDTO {
  id: number;
  expenseName: string;
  expenseType: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}

export interface RequestExpenseDTO {
  expenseName: string;
  expenseType: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}
