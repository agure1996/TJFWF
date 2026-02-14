import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
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
        <label htmlFor="productName" className="text-sm font-medium text-slate-700 mb-1.5">
          Product Name
        </label>
        <input
          id="productName"
          type="text"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          placeholder="e.g. Silk Abaya"
          required
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Product Type */}
      <div className="flex flex-col">
        <label htmlFor="productType" className="text-sm font-medium text-slate-700 mb-1.5">
          Product Type
        </label>
        <select
          id="productType"
          value={form.productType}
          onChange={(e) => setForm({ ...form, productType: e.target.value as ProductType })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
        >
          {PRODUCT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label htmlFor="productDescription" className="text-sm font-medium text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          id="productDescription"
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          placeholder="Optional description..."
          rows={3}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Supplier */}
      <div className="flex flex-col">
        <label htmlFor="supplier" className="text-sm font-medium text-slate-700 mb-1.5">
          Supplier (Optional)
        </label>
        <select
          id="supplier"
          value={form.supplierId || ""}
          onChange={(e) => setForm({ ...form, supplierId: e.target.value || undefined })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
        >
          <option value="">Select a supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.supplierId} value={String(supplier.supplierId)}>
              {supplier.supplierName}
            </option>
          ))}
        </select>
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
          disabled={isLoading}
          className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}