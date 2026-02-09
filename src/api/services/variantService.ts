import client from '../springBootClient';
import type { ApiResponse, ProductVariantDTO, RequestProductVariantDTO } from '@/api/types';

export const variantService = {
  // List variants for a product
  listByProduct: (productId: number | string) => client.get<ApiResponse<ProductVariantDTO[]>>(`/products/${productId}/variants`),

  // List all variants (convenience - backend may expose this)
  listAll: () => client.get<ApiResponse<ProductVariantDTO[]>>('/products/variants'),

  // Get a single variant by variant id
  get: (variantId: number | string) => client.get<ApiResponse<ProductVariantDTO>>(`/products/variants/${variantId}`),

  // Create a variant under a product
  create: (productId: number | string, data: RequestProductVariantDTO) => client.post<ApiResponse<ProductVariantDTO>>(`/products/${productId}/variants`, data),

  // Update a variant
  update: (variantId: number | string, data: RequestProductVariantDTO) => client.put<ApiResponse<ProductVariantDTO>>(`/products/variants/${variantId}`, data),

  // Delete a variant
  remove: (variantId: number | string) => client.delete<ApiResponse<void>>(`/products/variants/${variantId}`),
};
