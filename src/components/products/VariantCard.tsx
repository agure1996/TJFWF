import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ProductVariantDTO } from "@/api/types";

interface VariantCardProps {
  variant: ProductVariantDTO;
  onEdit: (v: ProductVariantDTO) => void;
  onDelete: (id: number) => void;
  highlight?: boolean; // <-- new
}

export default function VariantCard({ variant, onEdit, onDelete, highlight }: Readonly<VariantCardProps>) {
  return (
    <div
      className={`bg-white rounded-xl p-3 border ${
        highlight ? "border-indigo-500 bg-indigo-50" : "border-slate-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-700">{variant.sku}</p>
          <p className="text-xs text-slate-500">
            {variant.color} - Size {variant.size}
          </p>
          <p className="text-sm font-bold text-slate-900 mt-1">{variant.quantity} left</p>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(variant)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(variant.productVariantId)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
