import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductDTO, RequestProductDTO, SupplierDTO } from "@/api/types";

const PRODUCT_TYPES = ["ABAYA", "HIJAB", "DRESS", "JILBAB", "KHIMAR", "THOWB"] as const;

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

  // supplierId is now string | undefined
  const [form, setForm] = useState<{
    productName: string;
    productType: string;
    productDescription: string;
    supplierId?: string;
  }>({
    productName: "",
    productType: "",
    productDescription: "",
    supplierId: undefined,
  });

  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || "",
        productType: product.productType || "",
        productDescription: product.productDescription || "",
        supplierId: product.supplierId === undefined ? undefined : String(product.supplierId),
      });
    }
  }, [product]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: RequestProductDTO = {
      productName: form.productName,
      productType: form.productType,
      productDescription: form.productDescription,
      supplierId: form.supplierId ? Number(form.supplierId) : undefined, // convert string to number here
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          placeholder="e.g. Silk Abaya"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productType">Product Type</Label>
        <Select
          value={form.productType}
          onValueChange={(val) => setForm({ ...form, productType: val })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productDescription">Description</Label>
        <Textarea
          id="productDescription"
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          placeholder="Optional description..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier (Optional)</Label>
        <Select
          value={form.supplierId} // <-- now always string | undefined
          onValueChange={(val) => setForm({ ...form, supplierId: val || undefined })} // undefined instead of null
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.supplierId} value={String(supplier.supplierId)}>
                {supplier.supplierName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
          {product ? "Update" : "Create"} Product
        </Button>
      </div>
    </form>
  );
}
