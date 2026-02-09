// src/api/services/purchaseService.ts
import client from '../springBootClient';
import type { ApiResponse, PurchaseDTO } from '@/api/types';

/**
 * Frontend-only request shape
 * MUST match backend RequestPurchaseDTO JSON
 */
export interface PurchaseItemRequest {
  variantId: number;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseRequest {
  supplierId: number;
  purchaseDate: string; // ISO date string
  purchaseType: 'BATCH' | 'SINGLE';
  items: PurchaseItemRequest[];
}

export const purchaseService = {
  list: () => client.get<ApiResponse<PurchaseDTO[]>>('/purchases'),

  get: (id: number | string) => client.get<ApiResponse<PurchaseDTO>>(`/purchases/${id}`),

  create: (data: CreatePurchaseRequest) => client.post<ApiResponse<PurchaseDTO>>('/purchases', data),

  update: (id: number | string, data: CreatePurchaseRequest) => client.put<ApiResponse<PurchaseDTO>>(`/purchases/${id}`, data),

  remove: (id: number | string) => client.delete<ApiResponse<void>>(`/purchases/${id}`),
};
