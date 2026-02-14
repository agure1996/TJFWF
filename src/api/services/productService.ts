import client from '../springBootClient'
import type {
  ApiResponse,
  ProductDTO,
  RequestProductDTO,
  ProductVariantDTO,
  RequestProductVariantDTO
} from '@/api/types'

export const productService = {
  // --------------------
  // Products
  // --------------------
  list: () => client.get<ApiResponse<ProductDTO[]>>('/products'),
  get: (id: number | string) => client.get<ApiResponse<ProductDTO>>(`/products/${id}`),
  create: (data: RequestProductDTO) => client.post<ApiResponse<ProductDTO>>('/products', data),
  createBulk: (data: RequestProductDTO[]) => client.post<ApiResponse<ProductDTO[]>>('/products/bulk', data),
  update: (id: number | string, data: RequestProductDTO) => client.put<ApiResponse<ProductDTO>>(`/products/${id}`, data),
  remove: (id: number | string) => client.delete<ApiResponse<void>>(`/products/${id}`),

  // --------------------
  // Product Variants
  // --------------------
  listAllVariants: () => client.get<ApiResponse<ProductVariantDTO[]>>('/products/variants'),
  getVariantsByProduct: (productId: number | string) =>
    client.get<ApiResponse<ProductVariantDTO[]>>(`/products/${productId}/variants`),
  getVariant: (variantId: number | string) =>
    client.get<ApiResponse<ProductVariantDTO>>(`/products/variants/${variantId}`),
  createVariant: (productId: number | string, data: RequestProductVariantDTO) =>
    client.post<ApiResponse<ProductVariantDTO>>(`/products/${productId}/variants`, data),
  updateVariant: (variantId: number | string, data: RequestProductVariantDTO) =>
    client.put<ApiResponse<ProductVariantDTO>>(`/products/variants/${variantId}`, data),
  deleteVariant: (variantId: number | string) =>
    client.delete<ApiResponse<void>>(`/products/variants/${variantId}`),

  // --------------------
  // Product Types
  // --------------------
  productTypes: () => client.get<ApiResponse<{ key: string; label: string }[]>>('/products/product-types')
}
