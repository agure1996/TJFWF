import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService, supplierService, variantService } from "@/api/services";
import type { CreatePurchaseRequest, SupplierDTO, ProductVariantDTO, PurchaseDTO, PurchaseRowDTO } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import DataTable from "../components/shared/DataTable";
import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseCard from "../components/purchases/PurchaseCard";

export default function Purchases() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseRowDTO | undefined>(undefined);

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery<SupplierDTO[]>({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then((r) => r.data.data),
  });

  // Fetch product variants
  const { data: variants = [] } = useQuery<ProductVariantDTO[]>({
    queryKey: ["variants"],
    queryFn: () => variantService.listAll().then((r) => r.data.data),
  });

  // Fetch purchases
  const { data: purchasesDTO = [], isLoading } = useQuery<PurchaseDTO[]>({
    queryKey: ["purchases"],
    queryFn: () => purchaseService.list().then((r) => r.data.data),
  });

  // Map purchases to row DTOs
  const purchases: PurchaseRowDTO[] = purchasesDTO.map((p: any) => ({
    id: p.purchaseId,
    supplier: p.supplier,
    supplierName: p.supplier?.supplierName || "Unknown",
    purchaseType: p.purchaseType ?? "SINGLE",
    items: p.items ?? [],
    totalCost:
      p.totalAmount ??
      p.items?.reduce((sum: number, i: any) => sum + i.costPrice * i.quantity, 0) ??
      0,
    purchaseDate: p.purchaseDate,
  }));

  // Mutations
  const savePurchase = useMutation({
    mutationFn: ({ id, data }: { id?: number; data: CreatePurchaseRequest }) =>
      id ? purchaseService.update(id, data) : purchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      setShowForm(false);
      setEditingPurchase(undefined);
    },
  });

  const deletePurchase = useMutation({
    mutationFn: (id: number) => purchaseService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchases"] }),
  });

  // Columns for desktop DataTable
  const columns = [
    {
      key: "supplierName",
      label: "Supplier",
      render: (row: PurchaseRowDTO) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-medium">{row.supplierName}</span>
        </div>
      ),
    },
    {
      key: "purchaseDate",
      label: "Date",
      render: (row: PurchaseRowDTO) =>
        row.purchaseDate ? format(new Date(row.purchaseDate), "MMM d, yyyy") : "—",
    },
    {
      key: "purchaseType",
      label: "Type",
      render: (row: PurchaseRowDTO) => (
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
      render: (row: PurchaseRowDTO) => <span>{row.items.length} items</span>,
    },
    {
      key: "totalCost",
      label: "Total",
      render: (row: PurchaseRowDTO) => <span className="font-bold">£{row.totalCost.toFixed(2)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (row: PurchaseRowDTO) => (
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setEditingPurchase(row);
              setShowForm(true);
            }}
          >
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              deletePurchase.mutate(row.id);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
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
            onClick={() => {
              setEditingPurchase(undefined);
              setShowForm(true);
            }}
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
              onClick={() => {
                setEditingPurchase(undefined);
                setShowForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Purchase
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={purchases}
              isLoading={isLoading}
              onRowClick={(row: PurchaseRowDTO) => {
                setEditingPurchase(row);
                setShowForm(true);
              }}
            />
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden">
            {purchases.map((p) => (
              <PurchaseCard
                key={p.id}
                purchase={p}
                onEdit={() => {
                  setEditingPurchase(p);
                  setShowForm(true);
                }}
                onDelete={() => deletePurchase.mutate(p.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Purchase Form Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingPurchase(undefined);
        }}
      >
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>{editingPurchase ? "Edit Purchase" : "New Purchase"}</DialogTitle>
          </DialogHeader>

          <PurchaseForm
            purchase={editingPurchase}
            suppliers={suppliers}
            variants={variants}
            onSubmit={(data: CreatePurchaseRequest) => {
              if (editingPurchase?.id) {
                savePurchase.mutate({ id: editingPurchase.id, data });
              } else {
                savePurchase.mutate({ data });
              }
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingPurchase(undefined);
            }}
            isLoading={savePurchase.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
