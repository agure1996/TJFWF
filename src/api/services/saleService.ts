import client from "../springBootClient";
import type { ApiResponse, SaleDTO, CreateSaleRequest, ProductVariantDTO } from "@/api/types";

export const saleService = {
  // GET /sales
  list: async (): Promise<SaleDTO[]> => {
    const res = await client.get<ApiResponse<SaleDTO[]>>("/sales");
    return res.data.data;
  },

  // GET /sales/{id}
  get: async (id: number): Promise<SaleDTO> => {
    const res = await client.get<ApiResponse<SaleDTO>>(`/sales/${id}`);
    return res.data.data;
  },

  // POST /sales
  create: async (payload: CreateSaleRequest): Promise<SaleDTO> => {
    const res = await client.post<ApiResponse<SaleDTO>>("/sales", payload);
    return res.data.data;
  },

  // PUT /sales/{id}
  update: async (id: number, payload: CreateSaleRequest): Promise<SaleDTO> => {
    const res = await client.put<ApiResponse<SaleDTO>>(`/sales/${id}`, payload);
    return res.data.data;
  },

  // DELETE /sales/{id}
  remove: async (id: number): Promise<void> => {
    await client.delete(`/sales/${id}`);
  },

  // GET product variants (for dropdown)
  varList: async (): Promise<ProductVariantDTO[]> => {
    const res = await client.get<ApiResponse<ProductVariantDTO[]>>("/products/variants");
    return res.data.data;
  },
};
