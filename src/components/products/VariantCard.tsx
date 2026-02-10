import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ProductVariantDTO } from "@/api/types";

interface VariantCardProps {
  variant: ProductVariantDTO;
  onEdit: (variant: ProductVariantDTO) => void;
  onDelete: (variantId: number) => void;
}

export default function VariantCard({
  variant,
  onEdit,
  onDelete,
}: Readonly<VariantCardProps>) {
  console.log("VariantCard variant:", variant);
  const quantity = variant.quantity ?? 0;
  const stockColor =
    quantity === 0 || quantity < 3
      ? "bg-red-200 text-red-800"
      : quantity < 10
        ? "bg-yellow-200 text-yellow-800"
        : "bg-green-200 text-green-800";
  return (
    <div className="bg-white border rounded-xl p-3 flex flex-col justify-between">
      <div>
        <span className="text-xs font-mono text-slate-400">{variant.sku}</span>
        <p className="text-sm font-medium mt-1">
          {variant.color} — Size {variant.size}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold">${variant.salePrice}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${stockColor}`}>
            Qty: {quantity}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-1 mt-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(variant)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            variant.productVariantId && onDelete(variant.productVariantId)
          }
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
