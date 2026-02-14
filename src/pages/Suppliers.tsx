import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService, type SupplierRequest } from "@/api/services/supplierService";
import type { SupplierDTO } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Truck, Inbox } from "lucide-react";
import SupplierForm from "../components/suppliers/SupplierForm";
import { toastCreate, toastUpdate, toastDelete } from "@/components/ui/toastHelper";

export default function Suppliers() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SupplierDTO | null>(null);

  // Fetch suppliers
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then(r => r.data.data),
  });

  // Mutations
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

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    deleteSupplier.mutate(id);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your supply chain contacts</p>
        </div>

        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> New Supplier
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading suppliers...</p>
          </div>
        </div>
      ) : suppliers.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No suppliers yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Add your first supplier to start tracking purchases.
          </p>
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Supplier
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier.supplierId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                          <Truck className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="text-sm font-medium text-slate-900">
                          {supplier.supplierName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {supplier.supplierContactInfo}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-500">
                        {supplier.notes || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(supplier);
                            setShowForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(supplier.supplierId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Hidden on desktop */}
          <div className="md:hidden space-y-3">
            {suppliers.map((supplier) => (
              <div
                key={supplier.supplierId}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {supplier.supplierName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {supplier.supplierContactInfo}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(supplier);
                        setShowForm(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(supplier.supplierId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                {supplier.notes && (
                  <div className="text-sm text-slate-500 mt-2">
                    {supplier.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editing ? "Edit Supplier" : "New Supplier"}
            </DialogTitle>
          </DialogHeader>
          <SupplierForm
            supplier={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            isLoading={createSupplier.isPending || updateSupplier.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}