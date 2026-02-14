import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ProductVariantDTO } from "@/api/types";

interface VariantCardProps {
  variant: ProductVariantDTO;
  onEdit: (v: ProductVariantDTO) => void;
  onDelete: (id: number) => void;
  highlight?: boolean;
}

export default function VariantCard({ 
  variant, 
  onEdit, 
  onDelete, 
  highlight 
}: Readonly<VariantCardProps>) {
  return (
    <div
      className={`bg-white rounded-lg p-3 border transition-all ${
        highlight 
          ? "border-amber-400 bg-amber-50 shadow-lg ring-2 ring-amber-300" 
          : "border-slate-200"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{variant.sku}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {variant.color} • Size {variant.size}
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-2">
            {variant.quantity} in stock
          </p>
          <p className="text-xs text-green-600 font-medium">
            £{(variant.salePrice ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(variant);
            }}
            className="h-7 w-7 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            aria-label="Edit variant"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(variant.productVariantId);
            }}
            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label="Delete variant"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}