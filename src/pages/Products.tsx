import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/api/services/productService";
import { variantService } from "@/api/services/variantService";
import { supplierService } from "@/api/services/supplierService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import DataTable from "../components/shared/DataTable";
import ProductForm from "../components/products/ProductForm";
import VariantForm from "../components/products/VariantForm";
import VariantCard from "../components/products/VariantCard";

export default function Products() {
  const queryClient = useQueryClient();

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [expandedProductId, setExpandedProductId] = useState<number | null>(
    null,
  );
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);

  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);

  // -------------------- Queries --------------------

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.list().then((r) => r.data.data),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then((r) => r.data.data),
  });

  const {
    data: variants = [],
    isLoading: variantsLoading,
  } = useQuery({
    queryKey: ["productVariants", currentProductId],
    queryFn: () =>
      currentProductId
        ? variantService
            .listByProduct(currentProductId)
            .then((r) => r.data.data)
        : Promise.resolve([]),
    enabled: currentProductId !== null,
  });

  // -------------------- Mutations --------------------

  const createProduct = useMutation({
    mutationFn: (data: any) =>
      productService.create(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductForm(false);
      setEditingProduct(null);
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      productService.update(id, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductForm(false);
      setEditingProduct(null);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => productService.remove(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      if (deletedId === currentProductId) {
        setCurrentProductId(null);
        setExpandedProductId(null);
      }
    },
  });

  const createVariant = useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: any }) =>
      variantService.create(productId, data).then((r) => r.data.data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["productVariants", currentProductId],
      }),
  });

  const updateVariant = useMutation({
    mutationFn: ({ variantId, data }: { variantId: number; data: any }) =>
      variantService.update(variantId, data).then((r) => r.data.data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["productVariants", currentProductId],
      }),
  });

  const deleteVariant = useMutation({
    mutationFn: (variantId: number) => variantService.remove(variantId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["productVariants", currentProductId],
      }),
  });

  // -------------------- Handlers --------------------

  function handleProductSubmit(data: any) {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.productId, data });
      return;
    }
    createProduct.mutate(data);
  }

  function handleVariantSubmit(data: any) {
    if (!currentProductId) return;

    if (editingVariant?.productVariantId) {
      updateVariant.mutate({
        variantId: editingVariant.productVariantId,
        data,
      });
    } else {
      createVariant.mutate({ productId: currentProductId, data });
    }

    setShowVariantForm(false);
    setEditingVariant(null);
  }

  // -------------------- Table --------------------

  const columns = [
    {
      key: "productName",
      label: "Product Name",
      render: (row: any) => row.productName,
    },
    {
      key: "actions",
      label: "",
      render: (row: any) => (
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setEditingProduct(row);
              setShowProductForm(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              deleteProduct.mutate(row.productId);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // -------------------- Render --------------------

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage products and variants"
        actions={
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> New Product
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        onRowClick={(row: any) => {
          const id = row.productId;

          if (expandedProductId === id) {
            setExpandedProductId(null);
            setCurrentProductId(null);
            return;
          }

          setExpandedProductId(id);
          setCurrentProductId(id);
        }}
      />

      {/* ---------- Variants Section (ONLY when product selected) ---------- */}
      {expandedProductId !== null && currentProductId !== null && (
        <div className="mt-4 bg-slate-50 rounded-xl p-4 space-y-4">
          <div className="flex  items-center justify-between">
            <h3 className="text-sm font-semibold">Variants</h3>
            <Button
              size="sm"
              onClick={() => {
                setEditingVariant(null);
                setShowVariantForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Variant
            </Button>
          </div>

          {variantsLoading && (
            <p className="text-xs text-slate-400 text-center">
              Loading variants…
            </p>
          )}

          {!variantsLoading && variants.length === 0 && (
            <p className="text-xs text-slate-400 text-center">
              No variants yet
            </p>
          )}

          {!variantsLoading && variants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {variants.map((v) => (
                <VariantCard
                  key={v.productVariantId}
                  variant={v}
                  onEdit={(variant) => {
                    setEditingVariant(variant);
                    setShowVariantForm(true);
                  }}
                  onDelete={(variantId) => {
                    deleteVariant.mutate(variantId);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------- Product Dialog ---------- */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            suppliers={suppliers}
            onSubmit={handleProductSubmit}
            onCancel={() => setShowProductForm(false)}
            isLoading={createProduct.isPending || updateProduct.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* ---------- Variant Dialog ---------- */}
      <Dialog open={showVariantForm} onOpenChange={setShowVariantForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? "Edit Variant" : "New Variant"}
            </DialogTitle>
          </DialogHeader>
          <VariantForm
            variant={editingVariant}
            productId={currentProductId}
            onSubmit={handleVariantSubmit}
            onCancel={() => setShowVariantForm(false)}
            isLoading={createVariant.isPending || updateVariant.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
