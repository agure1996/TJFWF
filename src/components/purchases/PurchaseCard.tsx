import type { PurchaseRowDTO } from "@/api/types";
import { format } from "date-fns";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";      // UI button
import { Badge } from "@/components/ui/badge";   
interface PurchaseCardProps {
  purchase: PurchaseRowDTO;
  onEdit: () => void;
  onDelete: () => void;
}

export function PurchaseCard({ purchase, onEdit, onDelete }: Readonly<PurchaseCardProps>) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{purchase.supplierName}</span>
            <span className="text-sm text-gray-500">
              {purchase.items.length} item{purchase.items.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>{purchase.purchaseDate ? format(new Date(purchase.purchaseDate), "MMM d, yyyy") : "—"}</span>
        <Badge
          variant="secondary"
          className={
            purchase.purchaseType === "BATCH"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-600"
          }
        >
          {purchase.purchaseType}
        </Badge>
        <span className="font-semibold">£{purchase.totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}
