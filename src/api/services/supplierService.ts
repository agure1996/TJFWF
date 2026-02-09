import client from "../springBootClient";
import type { ApiResponse, SupplierDTO } from "@/api/types";

// Frontend request type (matches backend JSON)
export type SupplierRequest = {
  supplierName: string;
  supplierContactInfo: string;
  notes?: string;
};

export const supplierService = {
  list: () =>
    client.get<ApiResponse<SupplierDTO[]>>("/suppliers"),

  get: (id: number | string) =>
    client.get<ApiResponse<SupplierDTO>>(`/suppliers/${id}`),

  create: (data: SupplierRequest) =>
    client.post<ApiResponse<SupplierDTO>>("/suppliers", data),

  update: (id: number | string, data: SupplierRequest) =>
    client.put<ApiResponse<SupplierDTO>>(`/suppliers/${id}`, data),

  remove: (id: number | string) =>
    client.delete<ApiResponse<void>>(`/suppliers/${id}`),
};
