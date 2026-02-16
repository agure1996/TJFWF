import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, X, ChevronDown } from "lucide-react";
import { useTheme } from "@/ThemeContext";
import type {
  ProductVariantDTO,
  PurchaseRowDTO,
  SupplierDTO,
  CreatePurchaseRequest,
} from "@/api/types";

interface PurchaseItemForm {
  productVariantId: string;
  quantity: string;
  costPrice: string;
}

interface PurchaseFormProps {
  purchase?: PurchaseRowDTO;
  suppliers: SupplierDTO[];
  variants: ProductVariantDTO[];
  onSubmit: (data: CreatePurchaseRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PurchaseForm({
  purchase,
  suppliers,
  variants,
  onSubmit,
  onCancel,
  isLoading,
}: Readonly<PurchaseFormProps>) {
  const { darkMode } = useTheme();
  
  const [form, setForm] = useState({
    supplierId: "",
    purchaseType: "SINGLE" as "SINGLE" | "BATCH",
    purchaseDate: new Date().toISOString().slice(0, 16),
    items: [{ productVariantId: "", quantity: "", costPrice: "" }],
  });

  const [errors, setErrors] = useState("");
  
  // Search states - one per item
  const [itemSearchQueries, setItemSearchQueries] = useState<{ [key: number]: string }>({});
  const [itemSearchActive, setItemSearchActive] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!purchase) return;

    const purchaseDateValue = purchase.purchaseDate
      ? (typeof purchase.purchaseDate === "string"
          ? purchase.purchaseDate
          : purchase.purchaseDate.toISOString()
        ).slice(0, 16)
      : new Date().toISOString().slice(0, 16);

    setForm({
      supplierId: purchase.supplier?.supplierId?.toString() || "",
      purchaseType: purchase.purchaseType,
      purchaseDate: purchaseDateValue,
      items: purchase.items?.length
        ? purchase.items.map((i) => ({
            productVariantId:
              (i as any).productVariant?.productVariantId?.toString() ||
              (i as any).productVariantId?.toString() ||
              "",
            quantity: i.quantity.toString(),
            costPrice: i.costPrice.toString(),
          }))
        : [{ productVariantId: "", quantity: "", costPrice: "" }],
    });
  }, [purchase]);

  useEffect(() => {
    if (form.purchaseType === "BATCH") {
      setForm((f) => ({
        ...f,
        items: f.items.map((item) => ({ ...item, quantity: "12" })),
      }));
    }
  }, [form.purchaseType]);

  const addItem = () => {
    const newIndex = form.items.length;
    setForm((f) => ({
      ...f,
      items: [...f.items, { productVariantId: "", quantity: "", costPrice: "" }],
    }));
    // Initialize search state for new item
    setItemSearchQueries(prev => ({ ...prev, [newIndex]: "" }));
    setItemSearchActive(prev => ({ ...prev, [newIndex]: false }));
  };

  const removeItem = (index: number) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, idx) => idx !== index),
    }));
    // Clean up search states
    setItemSearchQueries(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
    setItemSearchActive(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const updateItem = (
    index: number,
    field: keyof PurchaseItemForm,
    value: string,
  ) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    }));

  // Filter variants based on search query for each item
  const getFilteredVariants = (itemIndex: number) => {
    const searchQuery = itemSearchQueries[itemIndex]?.toLowerCase() || "";
    
    if (!searchQuery) return variants;

    return variants.filter((variant) => {
      const sku = variant.sku?.toLowerCase() || "";
      const color = variant.color?.toLowerCase() || "";
      const size = variant.size?.toString() || "";
      const productName = variant.productName?.toLowerCase() || "";

      return (
        sku.includes(searchQuery) ||
        color.includes(searchQuery) ||
        size.includes(searchQuery) ||
        productName.includes(searchQuery)
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.supplierId) return setErrors("Please select a supplier.");
    if (
      form.items.some((i) => !i.productVariantId || !i.quantity || !i.costPrice)
    )
      return setErrors(
        "Please select valid variants and fill quantity/cost for all items.",
      );

    setErrors("");

    const payload: CreatePurchaseRequest = {
      supplierId: Number(form.supplierId),
      purchaseType: form.purchaseType,
      purchaseDate: new Date(form.purchaseDate).toISOString(),
      items: form.items.map((i) => ({
        productVariantId: Number(i.productVariantId),
        quantity: Number(i.quantity),
        costPrice: Number(i.costPrice),
      })),
    };

    onSubmit(payload);
  };

  const grandTotal = form.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.costPrice || 0),
    0,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors && (
        <div className={`text-sm rounded-lg px-3 py-2 border ${
          darkMode 
            ? 'bg-red-900/20 text-red-400 border-red-800'
            : 'bg-red-50 text-red-600 border-red-200'
        }`}>
          {errors}
        </div>
      )}

      {/* Supplier & Purchase Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={`text-sm font-medium mb-1.5 ${
            darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
          }`}>
            Supplier
          </label>
          <div className="relative">
            <select
              value={form.supplierId}
              onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
                darkMode
                  ? 'bg-neutral-700 border-neutral-600 text-white'
                  : 'bg-white border-stone-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplierId} value={s.supplierId.toString()}>
                  {s.supplierName}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              darkMode ? 'text-neutral-400' : 'text-slate-400'
            }`} />
          </div>
        </div>

        <div className="flex flex-col">
          <label className={`text-sm font-medium mb-1.5 ${
            darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
          }`}>
            Purchase Type
          </label>
          <div className="relative">
            <select
              value={form.purchaseType}
              onChange={(e) =>
                setForm({
                  ...form,
                  purchaseType: e.target.value as "SINGLE" | "BATCH",
                })
              }
              className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
                darkMode
                  ? 'bg-neutral-700 border-neutral-600 text-white'
                  : 'bg-white border-stone-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
            >
              <option value="SINGLE">Single</option>
              <option value="BATCH">Batch (12 units)</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              darkMode ? 'text-neutral-400' : 'text-slate-400'
            }`} />
          </div>
        </div>
      </div>

      {/* Purchase Date */}
      <div className="flex flex-col">
        <label className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Purchase Date
        </label>
        <input
          type="datetime-local"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode
              ? 'bg-neutral-700 border-neutral-600 text-white'
              : 'bg-white border-stone-300 text-slate-900'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={`text-sm font-medium ${
            darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
          }`}>
            Items
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addItem}
            className={`text-sm ${
              darkMode
                ? 'text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20'
                : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {form.items.map((item, idx) => {
            const selectedVariant = variants.find(
              (v) => v.productVariantId.toString() === item.productVariantId,
            );
            const filteredVariants = getFilteredVariants(idx);
            const searchQuery = itemSearchQueries[idx] || "";
            const isSearching = itemSearchActive[idx];

            return (
              <div 
                key={`${item.productVariantId}-${idx}`} 
                className={`space-y-3 p-3 rounded-lg border ${
                  darkMode
                    ? 'border-neutral-700 bg-neutral-800/50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                {/* Search Bar for this item */}
                <div className="flex flex-col">
                  <label className={`text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-600'
                  }`}>
                    Search Variant (SKU, Color, Size)
                  </label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      darkMode ? 'text-neutral-400' : 'text-slate-400'
                    }`} />
                    <input
                      type="text"
                      placeholder="e.g. BLA-NAV-42, Black, Navy..."
                      value={searchQuery}
                      onChange={(e) => {
                        setItemSearchQueries(prev => ({
                          ...prev,
                          [idx]: e.target.value
                        }));
                        setItemSearchActive(prev => ({
                          ...prev,
                          [idx]: e.target.value.length > 0
                        }));
                      }}
                      className={`w-full border rounded-lg pl-10 pr-10 py-2 text-sm transition-all ${
                        darkMode
                          ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400'
                          : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
                      } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setItemSearchQueries(prev => ({
                            ...prev,
                            [idx]: ""
                          }));
                          setItemSearchActive(prev => ({
                            ...prev,
                            [idx]: false
                          }));
                        }}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          darkMode ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {isSearching && (
                    <p className={`text-xs mt-1 ${
                      darkMode ? 'text-[#A39180]' : 'text-slate-500'
                    }`}>
                      Found {filteredVariants.length} variant{filteredVariants.length === 1 ? '' : 's'}
                    </p>
                  )}
                </div>

                {/* Variant Dropdown */}
                <div className="flex flex-col">
                  <label className={`text-xs font-medium mb-1 ${
                    darkMode ? 'text-[#A39180]' : 'text-slate-600'
                  }`}>
                    Select Variant
                  </label>
                  <div className="relative">
                    <select
                      value={item.productVariantId}
                      onChange={(e) => updateItem(idx, "productVariantId", e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
                        darkMode
                          ? 'bg-neutral-700 border-neutral-600 text-white'
                          : 'bg-white border-stone-300 text-slate-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                    >
                      <option value="">Select variant</option>
                      {filteredVariants.map((v) => (
                        <option
                          key={v.productVariantId}
                          value={v.productVariantId.toString()}
                        >
                          {v.sku} — {v.color} (Size {v.size})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                      darkMode ? 'text-neutral-400' : 'text-slate-400'
                    }`} />
                  </div>
                </div>

                {/* Quantity and Cost */}
                <div className="flex items-end gap-2">
                  <div className="flex flex-col flex-1">
                    <label className={`text-xs font-medium mb-1 ${
                      darkMode ? 'text-[#A39180]' : 'text-slate-600'
                    }`}>
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      disabled={form.purchaseType === "BATCH"}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                        darkMode
                          ? 'bg-neutral-700 border-neutral-600 text-white disabled:bg-neutral-800 disabled:cursor-not-allowed'
                          : 'bg-white border-stone-300 text-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className={`text-xs font-medium mb-1 ${
                      darkMode ? 'text-[#A39180]' : 'text-slate-600'
                    }`}>
                      Cost (£)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.costPrice}
                      onChange={(e) => updateItem(idx, "costPrice", e.target.value)}
                      className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                        darkMode
                          ? 'bg-neutral-700 border-neutral-600 text-white'
                          : 'bg-white border-stone-300 text-slate-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                    />
                  </div>

                  {form.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 mb-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Selected Variant Preview */}
                {selectedVariant && (
                  <div className={`text-xs px-3 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-neutral-700 border-neutral-600 text-[#A39180]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    {selectedVariant.sku} — {selectedVariant.color} (Size {selectedVariant.size})
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Grand Total */}
        <div className={`mt-4 pt-3 border-t ${
          darkMode ? 'border-neutral-700' : 'border-slate-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
            }`}>
              Grand Total
            </span>
            <span className={`text-lg font-semibold ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              £{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex justify-end gap-3 pt-4 border-t ${
        darkMode ? 'border-neutral-700' : 'border-slate-200'
      }`}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className={
            darkMode
              ? 'text-[#A39180] hover:text-white hover:bg-neutral-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#8B7355] hover:bg-[#7A6854] text-white disabled:opacity-50"
        >
          {purchase ? "Update Purchase" : "Create Purchase"}
        </Button>
      </div>
    </form>
  );
}