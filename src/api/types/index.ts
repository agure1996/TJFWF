// API DTOs and response types shared by frontend services
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Products
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

// Product Variants
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

 
// Purchases (minimal shape)
export interface PurchaseDTO {
  id: number;
  supplierId?: number;
  total?: number;
  purchaseDate?: string;
}

export interface RequestPurchaseDTO {
  supplierId?: number;
  total: number;
  purchaseDate: string;
}

// Sales (minimal shape)
export interface SaleDTO {
  id: number;
  total?: number;
  saleDate?: string;
}

// Suppliers
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

// Expenses
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
