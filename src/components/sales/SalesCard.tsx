import type { SaleDTO } from "@/api/types";
import { Pencil, Trash2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SalesCardProps {
  readonly sale: SaleDTO;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export default function SalesCard({
  sale,
  onEdit,
  onDelete,
}: SalesCardProps) {
  const total = sale.totalAmount
    ? sale.totalAmount
    : sale.items.reduce((sum, i) => sum + i.salePrice * i.quantity, 0);

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3 flex flex-col gap-2">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Tag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{sale.customerName}</span>
            <span className="text-sm text-gray-500">
              {sale.items.length} item{sale.items.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Pencil
            className="w-5 h-5 text-indigo-600 cursor-pointer"
            onClick={onEdit}
          />
          <Trash2
            className="w-5 h-5 text-red-600 cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{sale.saleDate ? format(new Date(sale.saleDate), "MMM d, yyyy") : "—"}</span>
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600"
        >
          SALE
        </Badge>
        <span className="font-semibold">£{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
