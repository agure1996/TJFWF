import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { purchaseService, supplierService, variantService } from "@/api/services";
import type {
  CreatePurchaseRequest,
  SupplierDTO,
  ProductVariantDTO,
  PurchaseDTO,
  PurchaseRowDTO,
} from "@/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, ShoppingCart, Pencil, Inbox } from "lucide-react";
import { format } from "date-fns";
import PurchaseForm from "@/components/purchases/PurchaseForm";
import { useTheme } from "@/ThemeContext";
import { useToastHelper } from "@/components/ui/toastHelper";


export default function Purchases() {
  const queryClient = useQueryClient();
  const { toastCreate, toastUpdate, toastDelete } = useToastHelper();
  const location = useLocation();
  const { darkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseRowDTO | undefined>(undefined);
  const [highlightPurchaseId, setHighlightPurchaseId] = useState<number | null>(null);

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

  // Map DTO to row type with string id
  const purchases: PurchaseRowDTO[] = purchasesDTO.map((p: any) => ({
    purchaseId: p.purchaseId,
    id: String(p.purchaseId),
    supplier: p.supplier,
    supplierName: p.supplier?.supplierName || "Unknown",
    purchaseType: p.purchaseType ?? "SINGLE",
    items: p.items ?? [],
    totalAmount:
      p.totalAmount ??
      p.items?.reduce((sum: number, i: any) => sum + i.costPrice * i.quantity, 0) ??
      0,
    totalCost:
      p.totalAmount ??
      p.items?.reduce((sum: number, i: any) => sum + i.costPrice * i.quantity, 0) ??
      0,
    purchaseDate: p.purchaseDate,
  }));

  // Handle highlight from navigation state
  useEffect(() => {
    if (location.state?.highlightPurchaseId) {
      setHighlightPurchaseId(location.state.highlightPurchaseId);
      
      // Scroll to the highlighted purchase
      setTimeout(() => {
        const element = document.getElementById(`purchase-${location.state.highlightPurchaseId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightPurchaseId(null);
        // Clear navigation state
        globalThis.history.replaceState({}, document.title);
      }, 3000);
    }
  }, [location.state]);

  // --- Mutations ---
  const savePurchase = useMutation({
    mutationFn: ({ id, data }: { id?: number | string; data: CreatePurchaseRequest }) =>
      id ? purchaseService.update(id, data) : purchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      setShowForm(false);
      setEditingPurchase(undefined);

      if (editingPurchase) {
        toastUpdate("Purchase updated successfully");
      } else {
        toastCreate("Purchase created successfully");
      }
    },
  });

  const deletePurchase = useMutation({
    mutationFn: (id: number) => purchaseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toastDelete("Purchase deleted successfully");
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;
    deletePurchase.mutate(id);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Purchases
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Track stock bought from suppliers
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingPurchase(undefined);
            setShowForm(true);
          }}
          className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
        >
          <Plus className="w-4 h-4 mr-2" /> New Purchase
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
              darkMode ? 'border-neutral-700 border-t-[#8B7355]' : 'border-stone-200 border-t-[#8B7355]'
            }`}></div>
            <p className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>Loading purchases...</p>
          </div>
        </div>
      ) : purchases.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-neutral-800' : 'bg-slate-100'
          }`}>
            <Inbox className={`w-8 h-8 ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            No purchases yet
          </h3>
          <p className={`text-sm mb-6 max-w-sm ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Record your first stock purchase from a supplier.
          </p>
          <Button
            onClick={() => {
              setEditingPurchase(undefined);
              setShowForm(true);
            }}
            className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Purchase
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
                    Date
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Type
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Items
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Total
                  </th>
                  <th className={`px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'divide-y divide-neutral-700' : 'divide-y divide-slate-200'}>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    id={`purchase-${purchase.id}`}
                    className={`transition-all ${
                      highlightPurchaseId === Number.parseInt(purchase.id)
                        ? darkMode 
                          ? "bg-[#8B7355]/20 ring-2 ring-[#8B7355]"
                          : "bg-amber-50 ring-2 ring-amber-300"
                        : darkMode 
                          ? "hover:bg-neutral-700"
                          : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                        }`}>
                          <ShoppingCart className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {purchase.supplierName}
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {purchase.purchaseDate
                        ? format(new Date(purchase.purchaseDate), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge
                        className={
                          purchase.purchaseType === "BATCH"
                            ? darkMode 
                              ? "bg-[#8B7355]/20 text-[#E8DDD0]"
                              : "bg-indigo-100 text-indigo-700"
                            : darkMode
                              ? "bg-neutral-700 text-[#A39180]"
                              : "bg-slate-100 text-slate-600"
                        }
                      >
                        {purchase.purchaseType}
                      </Badge>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {purchase.items.length} items
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        £{purchase.totalCost.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingPurchase(purchase);
                            setShowForm(true);
                          }}
                          className={darkMode 
                            ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                            : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }
                          aria-label="Edit purchase"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(Number.parseInt(purchase.id))}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label="Delete purchase"
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
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                id={`purchase-${purchase.id}`}
                className={`rounded-xl shadow-sm border p-4 transition-all ${
                  highlightPurchaseId === Number.parseInt(purchase.id)
                    ? darkMode
                      ? "bg-[#8B7355]/20 border-[#8B7355] ring-2 ring-[#8B7355]"
                      : "bg-amber-50 border-amber-300 ring-2 ring-amber-300"
                    : darkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-slate-200"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
                    }`}>
                      <ShoppingCart className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {purchase.supplierName}
                      </div>
                      <Badge
                        className={`text-xs mt-1 ${
                          purchase.purchaseType === "BATCH"
                            ? darkMode
                              ? "bg-[#8B7355]/20 text-[#E8DDD0]"
                              : "bg-indigo-100 text-indigo-700"
                            : darkMode
                              ? "bg-neutral-700 text-[#A39180]"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {purchase.purchaseType}
                      </Badge>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingPurchase(purchase);
                        setShowForm(true);
                      }}
                      className={`h-8 w-8 ${
                        darkMode 
                          ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                          : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                      }`}
                      aria-label="Edit purchase"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(Number.parseInt(purchase.id))}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      aria-label="Delete purchase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>
                      {purchase.purchaseDate
                        ? format(new Date(purchase.purchaseDate), "MMM d, yyyy")
                        : "—"}
                    </span>
                    <span className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>
                      {purchase.items.length} items
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 border-t ${
                    darkMode ? 'border-neutral-700' : 'border-slate-100'
                  }`}>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                      Total
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      £{purchase.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
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
        <DialogContent className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {editingPurchase ? "Edit Purchase" : "New Purchase"}
            </DialogTitle>
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