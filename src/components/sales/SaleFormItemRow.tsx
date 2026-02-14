import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import type { ProductVariantDTO } from "@/api/types";

interface SaleFormItemRowProps {
  variant: ProductVariantDTO;
  quantity: number;
  salePrice: number;
  onChange: (field: "quantity" | "salePrice", value: number) => void;
  onRemove: () => void;
}

export default function SaleFormItemRow({
  variant,
  quantity,
  salePrice,
  onChange,
  onRemove,
}: Readonly<SaleFormItemRowProps>) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 border-b py-2">
      <div className="flex-1">
        <p className="font-medium">{variant.productName}</p>
        <p className="text-sm text-slate-500">{variant.color || ""} / Size {variant.size}</p>
      </div>
      <Input
        type="number"
        className="w-20"
        value={quantity}
        onChange={e => onChange("quantity", Number.parseInt(e.target.value))}
        placeholder="Qty"
      />
      <Input
        type="number"
        className="w-28"
        value={salePrice}
        onChange={e => onChange("salePrice", Number.parseFloat(e.target.value))}
        placeholder="Price"
      />
      <Button size="icon" variant="destructive" onClick={onRemove}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
