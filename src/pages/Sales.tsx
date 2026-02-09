import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService, variantService } from '@/api/services';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Receipt } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import DataTable from "../components/shared/DataTable";
import SaleForm from "../components/sales/SaleForm";

export default function Sales() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: salesRes = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: () => saleService.list().then(r => r.data.data),
  });
  const sales = salesRes ?? [];

  const { data: variants = [] } = useQuery({
    queryKey: ["variants"],
    queryFn: () => variantService.listAll().then(r => r.data.data),
  });

  const createSale = useMutation({
    mutationFn: (data) => saleService.create(data).then(r => r.data.data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["sales"] }); setShowForm(false); },
  });

  const deleteSale = useMutation({
    mutationFn: (id) => saleService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  const columns = [
    {
      key: "customerName",
      label: "Customer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-rose-600" />
          </div>
          <span className="font-medium">{row.customerName || "Walk-in"}</span>
        </div>
      ),
    },
    {
      key: "saleDate",
      label: "Date",
      render: (row) => row.saleDate ? format(new Date(row.saleDate), "MMM d, yyyy HH:mm") : "—",
    },
    {
      key: "items",
      label: "Items",
      render: (row) => <span>{row.items?.length || 0} items</span>,
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (row) => <span className="font-bold text-emerald-700">£{(row.totalAmount || 0).toFixed(2)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteSale.mutate(row.id); }}>
          <Trash2 className="w-4 h-4 text-slate-400" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle="Track stock sold to customers"
        actions={
          <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> New Sale
          </Button>
        }
      />

      {sales.length === 0 && !isLoading ? (
        <EmptyState
          title="No sales yet"
          description="Record your first sale to start tracking revenue."
          action={
            <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> New Sale
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={sales} isLoading={isLoading} />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Sale</DialogTitle>
          </DialogHeader>
          <SaleForm
            variants={variants}
            onSubmit={(data) => createSale.mutate(data)}
            onCancel={() => setShowForm(false)}
            isLoading={createSale.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}