import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { saleService } from "@/api/services/saleService";
import type { SaleDTO, CreateSaleRequest, SaleFormItem } from "@/api/types";
import { SaleForm } from "@/components/sales/SaleForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Inbox, ReceiptText  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/ThemeContext";
import { useToastHelper } from "@/components/ui/toastHelper";

export default function Sales(): JSX.Element {
  const location = useLocation();
  const { toastCreate, toastError } = useToastHelper();
  const { darkMode } = useTheme();
  const [sales, setSales] = useState<SaleDTO[]>([]);
  const [editingSale, setEditingSale] = useState<SaleDTO | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightSaleId, setHighlightSaleId] = useState<number | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await saleService.list();
      setSales(data);
    } catch {
      toastError("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle highlight from navigation state
  useEffect(() => {
    if (location.state?.highlightSaleId) {
      setHighlightSaleId(location.state.highlightSaleId);
      
      // Scroll to the highlighted sale
      setTimeout(() => {
        const element = document.getElementById(`sale-${location.state.highlightSaleId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightSaleId(null);
        // Clear navigation state
        globalThis.history.replaceState({}, document.title);
      }, 3000);
    }
  }, [location.state]);

  const handleCreate = async (payload: CreateSaleRequest) => {
    try {
      if (editingSale) {
        await saleService.update(editingSale.saleId, payload);
        toastCreate("Sale updated");
      } else {
        await saleService.create(payload);
        toastCreate("Sale created");
      }
      setShowForm(false);
      setEditingSale(null);
      fetchSales();
    } catch {
      toastError("Failed to submit sale");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    
    try {
      await saleService.remove(id);
      toastCreate("Sale deleted");
      fetchSales();
    } catch {
      toastError("Failed to delete sale");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Sales
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Track stock sold to customers
          </p>
        </div>

        <Button
          onClick={() => { 
            setEditingSale(null); 
            setShowForm(true); 
          }}
          className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
        >
          <Plus className="w-4 h-4 mr-2" /> New Sale
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
              darkMode ? 'border-neutral-700 border-t-[#8B7355]' : 'border-stone-200 border-t-[#8B7355]'
            }`}></div>
            <p className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>Loading sales...</p>
          </div>
        </div>
      ) : sales.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-neutral-800' : 'bg-slate-100'
          }`}>
            <Inbox className={`w-8 h-8 ${darkMode ? 'text-[#A39180]' : 'text-slate-400'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            No sales yet
          </h3>
          <p className={`text-sm mb-6 max-w-sm ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
            Start tracking your sales by creating your first sale record.
          </p>
          <Button
            onClick={() => { 
              setEditingSale(null); 
              setShowForm(true); 
            }}
            className={`${darkMode ? 'bg-[#8B7355] hover:bg-[#7A6854]' : 'bg-[#8B7355] hover:bg-[#7A6854]'} text-white`}
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Sale
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
                    Customer
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-500'
                  }`}>
                    Date
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
                {sales.map((sale) => (
                  <tr
                    key={sale.saleId}
                    id={`sale-${sale.saleId}`}
                    className={`transition-all ${
                      highlightSaleId === sale.saleId
                        ? darkMode
                          ? "bg-green-900/20 ring-2 ring-green-600"
                          : "bg-green-50 ring-2 ring-green-300"
                        : darkMode
                          ? "hover:bg-neutral-700"
                          : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                          darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'
                        }`}>
                          <ReceiptText className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {sale.customerName || "Walk-in"}
                          </div>
                          {sale.customerContact && (
                            <div className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                              {sale.customerContact}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {new Date(sale.saleDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                        {new Date(sale.saleDate).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-neutral-700 text-[#A39180]' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {sale.items.length} item{sale.items.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        £{sale.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { 
                            setEditingSale(sale); 
                            setShowForm(true); 
                          }}
                          className={darkMode 
                            ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                            : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }
                          aria-label="Edit sale"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(sale.saleId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label="Delete sale"
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
            {sales.map((sale) => {
              const total = sale.totalAmount || 
                sale.items.reduce((sum, i) => sum + i.salePrice * i.quantity, 0);
              
              return (
                <div
                  key={sale.saleId}
                  id={`sale-${sale.saleId}`}
                  className={`rounded-xl shadow-sm border p-4 transition-all ${
                    highlightSaleId === sale.saleId
                      ? darkMode
                        ? "bg-green-900/20 border-green-600 ring-2 ring-green-600"
                        : "bg-green-50 border-green-300 ring-2 ring-green-300"
                      : darkMode
                        ? "bg-neutral-800 border-neutral-700"
                        : "bg-white border-slate-200"
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'
                      }`}>
                        <ReceiptText className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {sale.customerName || "Walk-in"}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-[#A39180]' : 'text-slate-500'}`}>
                          {sale.items.length} item{sale.items.length === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { 
                          setEditingSale(sale); 
                          setShowForm(true); 
                        }}
                        className={`h-8 w-8 ${
                          darkMode 
                            ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20' 
                            : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                        }`}
                        aria-label="Edit sale"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(sale.saleId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        aria-label="Delete sale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex justify-between items-center text-sm">
                    <span className={darkMode ? 'text-[#A39180]' : 'text-slate-500'}>
                      {new Date(sale.saleDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      £{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {editingSale ? "Edit Sale" : "New Sale"}
            </DialogTitle>
          </DialogHeader>
          <SaleForm
            initialData={editingSale ? {
              saleDate: editingSale.saleDate,
              customerName: editingSale.customerName,
              customerContact: editingSale.customerContact,
              items: editingSale.items.map((i): SaleFormItem => ({
                productVariantId: i.productVariant.productVariantId,
                quantity: i.quantity,
                salePrice: i.salePrice,
              })),
            } : undefined}
            onSubmit={handleCreate}
            onCancel={() => { 
              setShowForm(false); 
              setEditingSale(null); 
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}