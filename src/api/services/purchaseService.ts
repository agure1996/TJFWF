// src/api/services/purchaseService.ts
import client from '../springBootClient';
import type { ApiResponse, CreatePurchaseRequest, PurchaseDTO } from '@/api/types';

export const purchaseService = {
  list: () =>
client.get<ApiResponse<PurchaseDTO[]>>('/purchases'),

  get: (id: number | string) =>
    client.get<ApiResponse<PurchaseDTO>>(`/purchases/${id}`),

  create: (data: CreatePurchaseRequest) =>
    client.post<ApiResponse<PurchaseDTO>>('/purchases', data),

  update: (id: number | string, data: CreatePurchaseRequest) =>
    client.put<ApiResponse<PurchaseDTO>>(`/purchases/${id}`, data),

  remove: (id: number | string) =>
    client.delete<ApiResponse<void>>(`/purchases/${id}`),
};
