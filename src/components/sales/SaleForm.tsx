import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { saleService } from "@/api/services/saleService";
import type { SaleFormItem, CreateSaleRequest } from "@/api/types";
import { Trash2, Plus } from "lucide-react";
import { toastError } from "@/components/ui/toastHelper";
import { Button } from "@/components/ui/button";

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

// Move VariantPreview outside of the parent component
const VariantPreview: React.FC<{
  control: any;
  index: number;
  variants: { id: number; name: string; details: string }[];
}> = ({ control, index, variants }) => {
  const variantId = useWatch({
    control,
    name: `items.${index}.productVariantId`,
  });
  const selectedVariant = variants.find(v => v.id === Number(variantId));
  
  if (!selectedVariant || variantId === 0) return null;
  
  return (
    <div className="text-xs text-slate-500 pl-3 py-1 bg-slate-50 rounded border border-slate-100">
      {selectedVariant.name} — {selectedVariant.details}
    </div>
  );
};

export const SaleForm: React.FC<SaleFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  className = ""
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      saleDate: new Date().toISOString().slice(0, 16),
      customerName: "",
      customerContact: "",
      items: [{ productVariantId: 0, quantity: 1, salePrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [variants, setVariants] = useState<{ id: number; name: string; details: string }[]>([]);

  useEffect(() => {
    saleService.varList()
      .then((data) =>
        setVariants(
          data.map((v) => ({
            id: v.productVariantId,
            name: v.productName,
            details: `${v.color || ""} (Size ${v.size})`.trim(),
          }))
        )
      )
      .catch(() => toastError("Failed to load product variants"));
  }, []);

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const submitHandler = (data: any) => {
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

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={className}>
      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <label htmlFor="customerName" className="text-sm font-medium text-slate-700 mb-1.5">
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
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="customerContact" className="text-sm font-medium text-slate-700 mb-1.5">
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
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            )}
          />
        </div>
      </div>

      {/* Sale Date */}
      <div className="flex flex-col mb-4">
        <label htmlFor="saleDate" className="text-sm font-medium text-slate-700 mb-1.5">
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
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          )}
        />
      </div>

      {/* Items Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">Items</label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ productVariantId: 0, quantity: 1, salePrice: 0 })}
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((item, index) => (
            <div key={item.id} className="space-y-2">
              {/* Product Variant */}
              <div className="flex flex-col">
                <label htmlFor={`item-${index}-variant`} className="text-xs font-medium text-slate-600 mb-1">
                  Variant
                </label>
                <Controller
                  name={`items.${index}.productVariantId`}
                  control={control}
                  render={({ field }) => (
                    <select
                      id={`item-${index}-variant`}
                      {...field}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value={0}>Select variant</option>
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} — {v.details}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Quantity and Price */}
              <div className="flex items-end gap-2">
                <div className="flex flex-col flex-1">
                  <label htmlFor={`item-${index}-quantity`} className="text-xs font-medium text-slate-600 mb-1">
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
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label htmlFor={`item-${index}-price`} className="text-xs font-medium text-slate-600 mb-1">
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
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    )}
                  />
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mb-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Selected variant details */}
              <VariantPreview control={control} index={index} variants={variants} />

              {index < fields.length - 1 && (
                <div className="border-t border-slate-100 pt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6 border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {initialData ? "Update Sale" : "Create Sale"}
        </Button>
      </div>
    </form>
  );
};