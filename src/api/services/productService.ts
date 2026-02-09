import client from '../springBootClient';
import type { ApiResponse, ProductDTO, RequestProductDTO } from '@/api/types';

export const productService = {
  list: () => client.get<ApiResponse<ProductDTO[]>>('/products'),
  get: (id: number | string) => client.get<ApiResponse<ProductDTO>>(`/products/${id}`),
  create: (data: RequestProductDTO) => client.post<ApiResponse<ProductDTO>>('/products', data),
  createBulk: (data: RequestProductDTO[]) => client.post<ApiResponse<ProductDTO[]>>('/products/bulk', data),
  update: (id: number | string, data: RequestProductDTO) => client.put<ApiResponse<ProductDTO>>(`/products/${id}`, data),
  remove: (id: number | string) => client.delete<ApiResponse<void>>(`/products/${id}`),
};
