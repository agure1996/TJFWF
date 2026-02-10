import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/api/services/productService";
import { variantService } from "@/api/services/variantService";
import { supplierService } from "@/api/services/supplierService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import DataTable from "../components/shared/DataTable";
import ProductForm from "../components/products/ProductForm";
import VariantForm from "../components/products/VariantForm";
import VariantCard from "../components/products/VariantCard";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_TYPE_BADGES, PRODUCT_TYPE_LABELS } from "@/constants/productType";
import type { RequestProductVariantDTO, CreateProductVariantDTO, ProductDTO, ProductVariantDTO, RequestProductDTO } from "@/api/types";
import { toastCreate, toastUpdate, toastDelete } from "@/components/ui/toastHelper";

export default function Products() {
  const queryClient = useQueryClient();

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariantDTO | null>(null);

  // -------------------- Queries --------------------
  const { data: products = [], isLoading } = useQuery<ProductDTO[]>({
    queryKey: ["products"],
    queryFn: () => productService.list().then((r) => r.data.data),
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then((r) => r.data.data),
  });

  const { data: variants = [], isLoading: variantsLoading } = useQuery<ProductVariantDTO[]>({
    queryKey: ["productVariants", currentProductId],
    queryFn: () =>
      currentProductId
        ? variantService.listByProduct(currentProductId).then((r) => r.data.data)
        : Promise.resolve([]),
    enabled: currentProductId !== null,
  });

  // -------------------- Mutations --------------------
  const createProduct = useMutation({
    mutationFn: (data: RequestProductDTO) => productService.create(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductForm(false);
      setEditingProduct(null);
      toastCreate("Product created successfully");
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RequestProductDTO }) =>
      productService.update(id, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowProductForm(false);
      setEditingProduct(null);
      toastUpdate("Product updated successfully");
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
      toastDelete("Product deleted!");
    },
  });

  const createVariant = useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: CreateProductVariantDTO }) =>
      variantService.create(productId, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants", currentProductId] });
      toastCreate("Variant created successfully");
    },
    onError: (error: any) => {
      toastDelete(error?.response?.data?.message ?? "Variant already exists");
    },
  });

  const updateVariant = useMutation({
    mutationFn: ({ variantId, data }: { variantId: number; data: CreateProductVariantDTO }) =>
      variantService.update(variantId, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants", currentProductId] });
      toastUpdate("Variant updated successfully");
    },
    onError: (error: any) => {
      toastDelete(error?.response?.data?.message ?? "Failed to update variant");
    },
  });

  const deleteVariant = useMutation({
    mutationFn: (variantId: number) => variantService.remove(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants", currentProductId] });
      toastDelete("Variant deleted!");
    },
  });

  // -------------------- Handlers --------------------
  const handleProductSubmit = (data: RequestProductDTO) => {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.productId, data });
    } else {
      createProduct.mutate(data);
    }
  };

  const handleVariantSubmit = (data: RequestProductVariantDTO) => {
    if (!currentProductId) return;

    const payload: RequestProductVariantDTO = {
      productId: currentProductId,
      color: data.color,
      size: Number(data.size),
      quantity: Number(data.quantity),
      salePrice: Number(data.salePrice),
    };

    if (editingVariant?.productVariantId) {
      updateVariant.mutate({ variantId: editingVariant.productVariantId, data: payload });
    } else {
      const createPayload: CreateProductVariantDTO = {
        color: data.color,
        size: Number(data.size),
        quantity: Number(data.quantity),
        salePrice: Number(data.salePrice),
      };
      createVariant.mutate({ productId: currentProductId, data: createPayload });
    }

    setShowVariantForm(false);
    setEditingVariant(null);
  };

  // -------------------- Table Columns --------------------
  const columns = [
    {
      key: "productName",
      label: "Product Name",
      render: (row: ProductDTO) => row.productName,
    },
    {
      key: "productType",
      label: "Type",
      render: (row: ProductDTO) => {
        const typeKey = row.productType;
        return <Badge className={PRODUCT_TYPE_BADGES[typeKey]}>{PRODUCT_TYPE_LABELS[typeKey]}</Badge>;
      },
    },
    {
      key: "actions",
      label: "",
      render: (row: ProductDTO) => (
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
        onRowClick={(row: ProductDTO) => {
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

      {/* Variants Section */}
      {expandedProductId !== null && currentProductId !== null && (
        <div className="mt-4 rounded-xl p-4 space-y-4 bg-slate-100/60 border border-slate-300/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <div className="flex items-center justify-between">
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

          {variantsLoading && <p className="text-xs text-slate-400 text-center">Loading variants…</p>}

          {!variantsLoading && variants.length === 0 && (
            <p className="text-xs text-slate-400 text-center">No variants yet</p>
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

      {/* Product Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "New Product"}</DialogTitle>
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

      {/* Variant Dialog */}
      <Dialog open={showVariantForm} onOpenChange={setShowVariantForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVariant ? "Edit Variant" : "New Variant"}</DialogTitle>
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
