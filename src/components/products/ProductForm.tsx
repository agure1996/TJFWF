import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/ThemeContext";
import type {
  ProductDTO,
  ProductType,
  RequestProductDTO,
  SupplierDTO,
} from "@/api/types";

const PRODUCT_TYPES = [
  "ABAYA",
  "HIJAB",
  "DRESS",
  "JILBAB",
  "KHIMAR",
  "THOWB",
] as const;

interface ProductFormProps {
  product: ProductDTO | null;
  suppliers: SupplierDTO[];
  onSubmit: (data: RequestProductDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({
  product,
  suppliers = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: Readonly<ProductFormProps>) {
  const { darkMode } = useTheme();
  
  const [form, setForm] = useState<{
    productName: string;
    productType: ProductType;
    productDescription: string;
    supplierId?: string;
  }>({
    productName: "",
    productType: PRODUCT_TYPES[0],
    productDescription: "",
    supplierId: undefined,
  });

  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || "",
        productType: product.productType,
        productDescription: product.productDescription || "",
        supplierId:
          product.supplierId === undefined
            ? undefined
            : String(product.supplierId),
      });
    }
  }, [product]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: RequestProductDTO = {
      productName: form.productName,
      productType: form.productType,
      productDescription: form.productDescription,
      supplierId: form.supplierId ? Number(form.supplierId) : undefined,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div className="flex flex-col">
        <label htmlFor="productName" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Product Name
        </label>
        <input
          id="productName"
          type="text"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          placeholder="e.g. Silk Abaya"
          required
          className={`border rounded-lg px-3 py-2 text-sm transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Product Type */}
      <div className="flex flex-col">
        <label htmlFor="productType" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Product Type
        </label>
        <div className="relative">
          <select
            id="productType"
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value as ProductType })}
            className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
              darkMode 
                ? 'bg-neutral-700 border-neutral-600 text-white' 
                : 'bg-white border-stone-300 text-slate-900'
            } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
          >
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
            darkMode ? 'text-neutral-400' : 'text-slate-400'
          }`} />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label htmlFor="productDescription" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Description
        </label>
        <textarea
          id="productDescription"
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          placeholder="Optional description..."
          rows={3}
          className={`border rounded-lg px-3 py-2 text-sm resize-none transition-all ${
            darkMode 
              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400' 
              : 'bg-white border-stone-300 text-slate-900 placeholder-slate-400'
          } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
        />
      </div>

      {/* Supplier */}
      <div className="flex flex-col">
        <label htmlFor="supplier" className={`text-sm font-medium mb-1.5 ${
          darkMode ? 'text-[#E8DDD0]' : 'text-slate-700'
        }`}>
          Supplier (Optional)
        </label>
        <div className="relative">
          <select
            id="supplier"
            value={form.supplierId || ""}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value || undefined })}
            className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm appearance-none cursor-pointer transition-all ${
              darkMode 
                ? 'bg-neutral-700 border-neutral-600 text-white' 
                : 'bg-white border-stone-300 text-slate-900'
            } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]`}
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierId} value={String(supplier.supplierId)}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
            darkMode ? 'text-neutral-400' : 'text-slate-400'
          }`} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex justify-end gap-3 pt-4 border-t ${
        darkMode ? 'border-neutral-700' : 'border-slate-200'
      }`}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className={darkMode 
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
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}