import React, { useState } from "react";
import type { SaleDTO, SaleItemDTO } from "@/api/types";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesTableProps {
  sales: SaleDTO[];
  isLoading: boolean;
  onEdit: (sale: SaleDTO) => void;
  onDelete: (sale: SaleDTO) => void;
}

export default function SalesTable({ sales, isLoading, onEdit, onDelete }: Readonly<SalesTableProps>) {
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

  const toggleExpand = (saleId: number) => {
    setExpandedSaleId(expandedSaleId === saleId ? null : saleId);
  };

  if (isLoading) {
    return <p className="text-center text-slate-400 py-4">Loading sales…</p>;
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        No sales yet. Click "Add Sale" to create your first sale.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Items</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {sales.map((sale) => (
            <React.Fragment key={sale.saleId}>
              <tr
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => toggleExpand(sale.saleId)}
              >
                <td className="px-4 py-2">{sale.customerName}</td>
                <td className="px-4 py-2">{new Date(sale.saleDate).toLocaleString()}</td>
                <td className="px-4 py-2">{sale.items.length}</td>
                <td className="px-4 py-2">
                  ${sale.totalAmount?.toFixed(2) ??
                    sale.items.reduce((sum, i) => sum + i.salePrice * i.quantity, 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(sale);
                    }}
                  >
                    <Pencil className="w-4 h-4 text-indigo-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(sale);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>

              {/* Expanded row showing sale items */}
              {expandedSaleId === sale.saleId && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 bg-slate-100/60">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Items</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {sale.items.map((item: SaleItemDTO) => (
                          <div
                            key={item.productVariant.productVariantId}
                            className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm flex justify-between"
                          >
                            <div className="text-sm">
                              {item.productVariant.productName}{" "}
                              <span className="text-slate-400 text-xs">
                                {item.productVariant.color ?? ""} - {item.productVariant.size}
                              </span>
                            </div>
                            <div className="text-right text-sm">
                              {item.quantity} × ${item.salePrice.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
