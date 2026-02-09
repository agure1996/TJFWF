import client from '../springBootClient';
import type { ApiResponse, SaleDTO } from '@/api/types';

export const saleService = {
  list: () => client.get<ApiResponse<SaleDTO[]>>('/sales'),
  get: (id: number | string) => client.get<ApiResponse<SaleDTO>>(`/sales/${id}`),
  create: (data: any) => client.post<ApiResponse<SaleDTO>>('/sales', data),
  update: (id: number | string, data: any) => client.put<ApiResponse<SaleDTO>>(`/sales/${id}`, data),
  remove: (id: number | string) => client.delete<ApiResponse<void>>(`/sales/${id}`),
};
