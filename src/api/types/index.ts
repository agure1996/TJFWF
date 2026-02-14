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
export type ProductType =
  | "ABAYA"
  | "HIJAB"
  | "DRESS"
  | "JILBAB"
  | "KHIMAR"
  | "THOWB";

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
  productName: string;
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

export type CreateProductVariantDTO = Omit<
  RequestProductVariantDTO,
  "productId"
>;

// --------------------
// Sales
// --------------------
export interface SaleItemDTO {
  productVariant: ProductVariantDTO;
  quantity: number;
  salePrice: number;
  // costPrice removed
}

export interface SaleDTO {
  saleId: number;        // previously saleId, ensure backend matches
  saleDate: string;
  customerName: string;
  customerContact: string;
  items: SaleItemDTO[];
  totalAmount: number;
}

export interface SaleFormItem {
  productVariantId: number; // use number instead of string for RHF compatibility
  quantity: number;
  salePrice: number;
}

export interface CreateSaleItemRequest {
  productVariantId: number;
  quantity: number;
  salePrice: number;
  // costPrice removed
}

export interface CreateSaleRequest {
  saleDate: string;
  customerName: string;
  customerContact: string;
  items: CreateSaleItemRequest[];
}

// --------------------
// Purchases
// --------------------
export interface PurchaseItemRequest {
  productVariantId: number;
  quantity: number;
  costPrice: number;
}

export interface CreatePurchaseRequest {
  supplierId: number;
  purchaseType: "SINGLE" | "BATCH";
  purchaseDate: string;
  items: PurchaseItemRequest[];
}

export interface PurchaseItemDTO {
  id: number;
  name: string;
  quantity: number;
  costPrice: number;
}

export interface PurchaseDTO {
  purchaseId: number;
  supplier?: SupplierDTO;
  purchaseType: "SINGLE" | "BATCH";
  purchaseDate?: string;
  items: PurchaseItemDTO[];
  totalAmount?: number;
}

export interface PurchaseRowDTO {
  id: string;
  supplier?: SupplierDTO;
  supplierName: string;
  items: PurchaseItemDTO[];
  purchaseType: "BATCH" | "SINGLE";
  purchaseDate?: string | Date;
  totalCost: number;
}

// --------------------
// Suppliers
// --------------------
export interface SupplierDTO {
  supplierId: number;
  supplierName: string;
  supplierContactInfo: string;
  notes?: string;
}

export interface RequestSupplierDTO {
  supplierName: string;
  supplierContactInfo: string;
  notes?: string;
}

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
