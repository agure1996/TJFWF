import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService, type SupplierRequest } from "@/api/services/supplierService";
import type { SupplierDTO } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Truck } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import DataTable from "../components/shared/DataTable";
import SupplierForm from "../components/suppliers/SupplierForm";
import { toastCreate, toastUpdate, toastDelete } from "@/components/ui/toastHelper";

export default function Suppliers() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SupplierDTO | null>(null);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then(r => r.data.data),
  });

  const createSupplier = useMutation({
    mutationFn: (data: SupplierRequest) =>
      supplierService.create(data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setShowForm(false);
      setEditing(null);
      toastCreate("Supplier created successfully");
    },
  });

  const updateSupplier = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SupplierRequest }) =>
      supplierService.update(id, data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setShowForm(false);
      setEditing(null);
      toastUpdate("Supplier updated successfully");
    },
  });

  const deleteSupplier = useMutation({
    mutationFn: (id: number) => supplierService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toastDelete("Supplier deleted!");
    },
  });

  const handleSubmit = (data: SupplierRequest) => {
    if (editing) {
      updateSupplier.mutate({ id: editing.supplierId, data });
    } else {
      createSupplier.mutate(data);
    }
  };

  const columns = [
    {
      key: "supplierName",
      label: "Supplier",
      render: (row: SupplierDTO) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-medium">{row.supplierName}</span>
        </div>
      ),
    },
    { key: "supplierContactInfo", label: "Contact" },
    {
      key: "notes",
      label: "Notes",
      render: (row: SupplierDTO) => (
        <span className="text-slate-400">{row.notes || "—"}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: SupplierDTO) => (
        <div className="flex gap-1 justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
              setShowForm(true);
            }}
          >
            <Pencil className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              deleteSupplier.mutate(row.supplierId);
            }}
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle="Manage your supply chain contacts"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> New Supplier
          </Button>
        }
      />

      {suppliers.length === 0 && !isLoading ? (
        <EmptyState
          title="No suppliers yet"
          description="Add your first supplier to start tracking purchases."
          action={
            <Button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Supplier
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={suppliers} isLoading={isLoading} onRowClick={undefined} />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Supplier" : "New Supplier"}</DialogTitle>
          </DialogHeader>
          <SupplierForm
            supplier={editing}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={createSupplier.isPending || updateSupplier.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
