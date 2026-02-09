import client from '../springBootClient';
import type { ApiResponse, ExpenseDTO, RequestExpenseDTO } from '@/api/types';

export const expenseService = {
  list: () => client.get<ApiResponse<ExpenseDTO[]>>('/expenses'),
  get: (id: number | string) => client.get<ApiResponse<ExpenseDTO>>(`/expenses/${id}`),
  create: (data: RequestExpenseDTO) => client.post<ApiResponse<ExpenseDTO>>('/expenses', data),
  update: (id: number | string, data: RequestExpenseDTO) => client.put<ApiResponse<ExpenseDTO>>(`/expenses/${id}`, data),
  remove: (id: number | string) => client.delete<ApiResponse<void>>(`/expenses/${id}`),
};
