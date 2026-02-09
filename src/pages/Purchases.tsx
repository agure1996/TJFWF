// src/pages/purchases.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService, supplierService, variantService } from '@/api/services';
import type { CreatePurchaseRequest } from '@/api/services/purchaseService';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import DataTable from "../components/shared/DataTable";
import PurchaseForm from "../components/purchases/PurchaseForm";

export default function Purchases() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchaseService.list().then(r => r.data.data),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then(r => r.data.data),
  });

  const { data: variants = [] } = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantService.listAll().then(r => r.data.data),
  });

  const createPurchase = useMutation({
    mutationFn: (data: CreatePurchaseRequest) =>
      purchaseService.create(data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      setShowForm(false);
    },
  });

  const deletePurchase = useMutation({
    mutationFn: (id: number) => purchaseService.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["purchases"] }),
  });

  const columns = [
    {
      key: "supplierName",
      label: "Supplier",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-medium">{row.supplierName || "—"}</span>
        </div>
      ),
    },
    {
      key: "purchaseDate",
      label: "Date",
      render: (row: any) =>
        row.purchaseDate ? format(new Date(row.purchaseDate), "MMM d, yyyy") : "—",
    },
    {
      key: "purchaseType",
      label: "Type",
      render: (row: any) => (
        <Badge
          variant="secondary"
          className={
            row.purchaseType === "BATCH"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-600"
          }
        >
          {row.purchaseType}
        </Badge>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row: any) => <span>{row.items?.length || 0} items</span>,
    },
    {
      key: "totalCost",
      label: "Total",
      render: (row: any) => (
        <span className="font-bold">£{(row.totalCost || 0).toFixed(2)}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: any) => (
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            deletePurchase.mutate(row.id);
          }}
        >
          <Trash2 className="w-4 h-4 text-slate-400" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Purchases"
        subtitle="Track stock bought from suppliers"
        actions={
          <Button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> New Purchase
          </Button>
        }
      />

      {purchases.length === 0 && !isLoading ? (
        <EmptyState
          title="No purchases yet"
          description="Record your first stock purchase from a supplier."
          action={
            <Button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Purchase
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={purchases} isLoading={isLoading} onRowClick={undefined} />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Purchase</DialogTitle>
          </DialogHeader>
          <PurchaseForm
            suppliers={suppliers}
            variants={variants}
            onSubmit={(data: CreatePurchaseRequest) => createPurchase.mutate(data)}
            onCancel={() => setShowForm(false)}
            isLoading={createPurchase.isPending} purchase={undefined}          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
