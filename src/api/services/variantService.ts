import client from "../springBootClient";
import type {
  ApiResponse,
  CreateProductVariantDTO,
  ProductVariantDTO,
} from "@/api/types";

export const variantService = {
  // List variants for a product
  listByProduct: (productId: number | string) =>
    client.get<ApiResponse<ProductVariantDTO[]>>(
      `/products/${productId}/variants`
    ),

  // List all variants (if backend exposes this)
  listAll: () =>
    client.get<ApiResponse<ProductVariantDTO[]>>("/products/variants"),

  // Get a single variant by variant id
  get: (variantId: number | string) =>
    client.get<ApiResponse<ProductVariantDTO>>(
      `/products/variants/${variantId}`
    ),

  // Create a variant under a product
  create: (productId: number | string, data: CreateProductVariantDTO) =>
    client.post<ApiResponse<ProductVariantDTO>>(
      `/products/${productId}/variants`,
      data
    ),

  // Update a variant (payload same as create — backend expects no productId here)
  update: (variantId: number | string, data: CreateProductVariantDTO) =>
  client.put<ApiResponse<ProductVariantDTO>>(
    `/products/variants/${variantId}`,
    data
  ),

  // Delete a variant
  remove: (variantId: number | string) =>
    client.delete<ApiResponse<void>>(`/products/variants/${variantId}`),
};
