import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { saleService } from "@/api/services/saleService";
import type { SaleFormItem, CreateSaleRequest } from "@/api/types";
import { Trash2, Plus, ChevronDown, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/ThemeContext";
import { useToastHelper } from "@/components/ui/toastHelper";

interface SaleFormProps {
  initialData?: {
    saleDate: string;
    customerName: string;
    customerContact: string;
    items: SaleFormItem[];
  };
  onSubmit: (data: CreateSaleRequest) => void;
  onCancel: () => void;
  className?: string;
}

// Enhanced variant with stock info
interface VariantWithStock {
  id: number;
  name: string;
  details: string;
  availableStock: number;
  sku: string;
}

const VariantPreview: React.FC<{
  control: any;
  index: number;
  variants: VariantWithStock[];
  darkMode: boolean;
  stockError: string | null;
}> = ({ control, index, variants, darkMode, stockError }) => {
  const variantId = useWatch({
    control,
    name: `items.${index}.productVariantId`,
  });
  const quantity = useWatch({
    control,
    name: `items.${index}.quantity`,
  });

  const selectedVariant = variants.find((v) => v.id === Number(variantId));
  
  if (!selectedVariant || variantId === 0) return null;

  const isOutOfStock = selectedVariant.availableStock === 0;
  const isLowStock = selectedVariant.availableStock > 0 && selectedVariant.availableStock <= 5;
  const exceedsStock = quantity > selectedVariant.availableStock;

  return (
    <div className="space-y-2">
      {/* Variant Info */}
      <div
        className={`text-xs px-3 py-2 rounded-lg border ${
          darkMode
            ? "bg-neutral-700 border-neutral-600 text-[#A39180]"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <div className="flex justify-between items-center">
          <span>{selectedVariant.name} — {selectedVariant.details}</span>
          <span className={`font-semibold ${
            isOutOfStock 
              ? 'text-red-500' 
              : isLowStock 
                ? darkMode ? 'text-amber-400' : 'text-amber-600'
                : darkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            {selectedVariant.availableStock} in stock
          </span>
        </div>
      </div>

      {/* Stock Error */}
      {stockError && (
        <div className={`text-xs px-3 py-2 rounded-lg border flex items-start gap-2 ${
          darkMode 
            ? 'bg-red-950/30 border-red-800 text-red-300' 
            : 'bg-red-50 border-red-300 text-red-700'
        }`}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{stockError}</span>
        </div>
      )}

      {/* Low Stock Warning */}
      {!stockError && isLowStock && !exceedsStock && (
        <div className={`text-xs px-3 py-2 rounded-lg border flex items-start gap-2 ${
          darkMode 
            ? 'bg-amber-900/20 border-amber-700/50 text-amber-300' 
            : 'bg-amber-50 border-amber-300 text-amber-700'
        }`}>
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Low stock warning - Only {selectedVariant.availableStock} units available</span>
        </div>
      )}
    </div>
  );
};

export const SaleForm: React.FC<SaleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className = "",
}) => {
  const { darkMode } = useTheme();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: initialData || {
      saleDate: new Date().toISOString().slice(0, 16),
      customerName: "",
      customerContact: "",
      items: [{ productVariantId: 0, quantity: 1, salePrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [variants, setVariants] = useState<VariantWithStock[]>([]);
  const [stockErrors, setStockErrors] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toastError } = useToastHelper();

  // Fetch variants with stock information
  useEffect(() => {
    saleService
      .varList()
      .then((data) =>
        setVariants(
          data.map((v) => ({
            id: v.productVariantId,
            name: v.productName,
            details: `${v.color || ""} (Size ${v.size})`.trim(),
            availableStock: v.quantity || 0,
            sku: v.sku,
          })),
        ),
      )
      .catch((error) => toastError(error)); // toastHelper handles the error object
  }, []);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // Watch all items to validate stock in real-time
  const watchedItems = watch("items");

  useEffect(() => {
    const newErrors: { [key: number]: string } = {};

    watchedItems.forEach((item, index) => {
      const variantId = Number(item.productVariantId);
      const quantity = Number(item.quantity);

      if (variantId === 0) return;

      const variant = variants.find((v) => v.id === variantId);
      if (!variant) return;

      if (variant.availableStock === 0) {
        newErrors[index] = `❌ OUT OF STOCK - Cannot sell this item (${variant.sku})`;
      } else if (quantity > variant.availableStock) {
        newErrors[index] = `⚠️ Insufficient stock - Only ${variant.availableStock} units available (requested: ${quantity})`;
      }
    });

    setStockErrors(newErrors);
  }, [watchedItems, variants]);

  const submitHandler = (data: any) => {
    // Final validation before submit
    const hasErrors = Object.keys(stockErrors).length > 0;
    if (hasErrors) {
      toastError("Cannot submit: Some items have stock issues. Please fix the errors above.");
      return;
    }

    // Check if any variant is selected
    const hasInvalidVariant = data.items.some((item: any) => Number(item.productVariantId) === 0);
    if (hasInvalidVariant) {
      toastError("Please select a variant for all items");
      return;
    }

    setIsSubmitting(true);

    const payload: CreateSaleRequest = {
      saleDate: data.saleDate,
      customerName: data.customerName,
      customerContact: data.customerContact,
      items: data.items.map((i: SaleFormItem) => ({
        productVariantId: Number(i.productVariantId),
        quantity: Number(i.quantity),
        salePrice: Number(i.salePrice),
      })),
    };
    
    onSubmit(payload);
  };

  // Disable submit if there are stock errors
  const hasStockErrors = Object.keys(stockErrors).length > 0;

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={className}>
      {/* General Error Display */}
      {hasStockErrors && (
        <div className={`mb-4 px-4 py-3 rounded-lg border flex items-start gap-3 ${
          darkMode 
            ? 'bg-red-950/30 border-red-800' 
            : 'bg-red-50 border-red-300'
        }`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            darkMode ? 'text-red-400' : 'text-red-600'
          }`} />
          <div>
            <p className={`text-sm font-semibold ${
              darkMode ? 'text-red-300' : 'text-red-800'
            }`}>
              Stock Issues Detected
            </p>
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              Please fix the stock errors below before submitting the sale.
            </p>
          </div>
        </div>
      )}

      {/* Customer Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label
            htmlFor="customerName"
            className={`text-sm font-medium mb-1.5 ${darkMode ? "text-[#E8DDD0]" : "text-slate-700"}`}
          >
            Customer Name
          </label>
          <Controller
            name="customerName"
            control={control}
            render={({ field }) => (
              <input
                id="customerName"
                {...field}
                placeholder="Optional"
                className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                  darkMode
                    ? "bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                    : "bg-white border-stone-300 text-slate-900 placeholder-slate-400"
                } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="customerContact"
            className={`text-sm font-medium mb-1.5 ${darkMode ? "text-[#E8DDD0]" : "text-slate-700"}`}
          >
            Customer Contact
          </label>
          <Controller
            name="customerContact"
            control={control}
            render={({ field }) => (
              <input
                id="customerContact"
                {...field}
                placeholder="Optional"
                className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                  darkMode
                    ? "bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                    : "bg-white border-stone-300 text-slate-900 placeholder-slate-400"
                } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
              />
            )}
          />
        </div>
      </div>

      {/* Sale Date */}
      <div className="flex flex-col mb-4">
        <label
          htmlFor="saleDate"
          className={`text-sm font-medium mb-1.5 ${darkMode ? "text-[#E8DDD0]" : "text-slate-700"}`}
        >
          Sale Date
        </label>
        <Controller
          name="saleDate"
          control={control}
          render={({ field }) => (
            <input
              id="saleDate"
              type="datetime-local"
              {...field}
              className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                darkMode
                  ? "bg-neutral-700 border-neutral-600 text-white"
                  : "bg-white border-stone-300 text-slate-900"
              } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
            />
          )}
        />
      </div>

      {/* Items Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label
            className={`text-sm font-medium ${darkMode ? "text-[#E8DDD0]" : "text-slate-700"}`}
          >
            Items
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              append({ productVariantId: 0, quantity: 1, salePrice: 0 })
            }
            className={`text-sm ${
              darkMode
                ? "text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20"
                : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className={`space-y-2 p-3 rounded-lg border ${
              stockErrors[index] 
                ? darkMode 
                  ? 'border-red-800 bg-red-950/20' 
                  : 'border-red-300 bg-red-50'
                : darkMode 
                  ? 'border-neutral-700 bg-neutral-800/50' 
                  : 'border-slate-200 bg-slate-50'
            }`}>
              {/* Product Variant */}
              <div className="flex flex-col">
                <label
                  htmlFor={`item-${index}-variant`}
                  className={`text-xs font-medium mb-1 ${darkMode ? "text-[#A39180]" : "text-slate-600"}`}
                >
                  Variant
                </label>
                <div className="relative">
                  <Controller
                    name={`items.${index}.productVariantId`}
                    control={control}
                    render={({ field }) => (
                      <select
                        id={`item-${index}-variant`}
                        {...field}
                        className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
                          darkMode
                            ? "bg-neutral-700 border-neutral-600 text-white"
                            : "bg-white border-stone-300 text-slate-900"
                        } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                      >
                        <option value={0}>Select variant</option>
                        {variants.map((v) => (
                          <option key={v.id} value={v.id} disabled={v.availableStock === 0}>
                            {v.name} — {v.details} {v.availableStock === 0 ? '(OUT OF STOCK)' : `(${v.availableStock} available)`}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${darkMode ? "text-neutral-400" : "text-slate-400"}`}
                  />
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex flex-col flex-1">
                  <label
                    htmlFor={`item-${index}-quantity`}
                    className={`text-xs font-medium mb-1 ${darkMode ? "text-[#A39180]" : "text-slate-600"}`}
                  >
                    Qty
                  </label>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <input
                        id={`item-${index}-quantity`}
                        type="number"
                        min={1}
                        {...field}
                        className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                          darkMode
                            ? "bg-neutral-700 border-neutral-600 text-white"
                            : "bg-white border-stone-300 text-slate-900"
                        } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label
                    htmlFor={`item-${index}-price`}
                    className={`text-xs font-medium mb-1 ${darkMode ? "text-[#A39180]" : "text-slate-600"}`}
                  >
                    Price (£)
                  </label>
                  <Controller
                    name={`items.${index}.salePrice`}
                    control={control}
                    render={({ field }) => (
                      <input
                        id={`item-${index}-price`}
                        type="number"
                        min={0}
                        step={0.01}
                        {...field}
                        className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                          darkMode
                            ? "bg-neutral-700 border-neutral-600 text-white"
                            : "bg-white border-stone-300 text-slate-900"
                        } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
                      />
                    )}
                  />
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      remove(index);
                      // Remove error for this index
                      setStockErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[index];
                        return newErrors;
                      });
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 sm:mb-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Selected variant details + stock warnings */}
              <VariantPreview
                control={control}
                index={index}
                variants={variants}
                darkMode={darkMode}
                stockError={stockErrors[index] || null}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t ${darkMode ? "border-neutral-700" : "border-slate-200"}`}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className={
            darkMode
              ? "text-[#A39180] hover:text-white hover:bg-neutral-700"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={hasStockErrors || isSubmitting}
          className="bg-[#8B7355] hover:bg-[#7A6854] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : initialData ? "Update Sale" : "Create Sale"}
        </Button>
      </div>
    </form>
  );
};