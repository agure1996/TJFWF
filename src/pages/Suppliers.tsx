import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService, type SupplierRequest } from "@/api/services/supplierService";
import type { SupplierDTO } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Truck, Inbox } from "lucide-react";
import SupplierForm from "../components/suppliers/SupplierForm";
import { useTheme } from "@/ThemeContext";
import { useToastHelper } from "@/components/ui/toastHelper";

export default function Suppliers() {
  const queryClient = useQueryClient();
  const { darkMode } = useTheme();
  const { toastCreate, toastUpdate, toastDelete } = useToastHelper();  
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
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Suppliers
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Manage your supply chain contacts
          </p>
        </div>

        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
        >
          <Plus className="w-4 h-4 mr-2" /> New Supplier
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
              darkMode ? 'border-neutral-700 border-t-[#8B7355]' : 'border-stone-200 border-t-[#8B7355]'
            }`}></div>
            <p className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>Loading suppliers...</p>
          </div>
        </div>
      ) : suppliers.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-neutral-800' : 'bg-slate-100'
          }`}>
            <Inbox className={`w-8 h-8 ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            No suppliers yet
          </h3>
          <p className={`text-sm mb-6 max-w-sm ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Add your first supplier to start tracking purchases.
          </p>
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Supplier
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className={`hidden md:block rounded-xl shadow-sm overflow-hidden ${
            darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'
          }`}>
            <table className="w-full">
              <thead className={darkMode ? 'bg-neutral-900 border-b border-neutral-700' : 'bg-slate-50 border-b border-slate-200'}>
                <tr>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Supplier
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Contact
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Notes
                  </th>
                  <th className={`px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    
                  </th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'divide-y divide-neutral-700' : 'divide-y divide-slate-200'}>
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier.supplierId}
                    className={`transition-colors ${darkMode ? 'hover:bg-neutral-700' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          darkMode ? 'bg-amber-900/20' : 'bg-amber-100'
                        }`}>
                          <Truck className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {supplier.supplierName}
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {supplier.supplierContactInfo}
                    </td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                      {supplier.notes || "—"}
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
                          className={darkMode 
                            ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                            : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }
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
                className={`rounded-xl shadow-sm p-4 ${
                  darkMode ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-amber-900/20' : 'bg-amber-100'
                    }`}>
                      <Truck className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {supplier.supplierName}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
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
                      className={`h-8 w-8 ${
                        darkMode 
                          ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                          : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                      }`}
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
                  <div className={`text-sm mt-2 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
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
        <DialogContent className={`w-full sm:max-w-2xl max-h-[90vh] sm:rounded-lg overflow-y-auto ${
  darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white'
}`}>

          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
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
