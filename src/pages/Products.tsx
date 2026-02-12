import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/api/services/productService";
import { variantService } from "@/api/services/variantService";
import { supplierService } from "@/api/services/supplierService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "../components/shared/PageHeader";
import ProductForm from "../components/products/ProductForm";
import VariantForm from "../components/products/VariantForm";
import ProductsTable from "../components/shared/ProductsTable";
import type {
  RequestProductVariantDTO,
  CreateProductVariantDTO,
  ProductDTO,
  ProductVariantDTO,
  RequestProductDTO,
  SupplierDTO,
} from "@/api/types";
import { toastCreate, toastUpdate, toastDelete } from "@/components/ui/toastHelper";

export default function Products() {
  const queryClient = useQueryClient();

  // -------------------- State --------------------
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariantDTO | null>(null);

  // -------------------- Queries --------------------
  const { data: products = [], isLoading: loadingProducts } = useQuery<ProductDTO[]>({
    queryKey: ["products"],
    queryFn: () => productService.list().then((r) => r.data.data),
  });

  const { data: variants = [], isLoading: loadingVariants } = useQuery<ProductVariantDTO[]>({
    queryKey: ["productVariants", currentProductId],
    queryFn: () =>
      currentProductId
        ? variantService.listByProduct(currentProductId).then((r) => r.data.data)
        : Promise.resolve([]),
    enabled: currentProductId !== null,
  });

  const { data: suppliers = [] } = useQuery<SupplierDTO[]>({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then((r) => r.data.data),
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
      createVariant.mutate({
        productId: currentProductId,
        data: {
          color: data.color,
          size: Number(data.size),
          quantity: Number(data.quantity),
          salePrice: Number(data.salePrice),
        },
      });
    }

    setShowVariantForm(false);
    setEditingVariant(null);
  };

  const handleRowClick = (row: ProductDTO) => {
    const id = row.productId;
    if (expandedProductId === id) {
      setExpandedProductId(null);
      setCurrentProductId(null);
      return;
    }
    setExpandedProductId(id);
    setCurrentProductId(id);
  };

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
            New Product
          </Button>
        }
      />

      <ProductsTable
        products={products}
        expandedProductId={expandedProductId}
        loadingProducts={loadingProducts}
        loadingVariants={loadingVariants}
        onRowClick={handleRowClick}
        onEditProduct={(p) => {
          setEditingProduct(p);
          setShowProductForm(true);
        }}
        onDeleteProduct={(id) => deleteProduct.mutate(id)}
        variants={variants} // variants are passed to the row dropdown
        onAddVariant={(productId) => {
          setCurrentProductId(productId);
          setEditingVariant(null);
          setShowVariantForm(true);
        }}
        onEditVariant={(v) => {
          setEditingVariant(v);
          setShowVariantForm(true);
        }}
        onDeleteVariant={(id) => deleteVariant.mutate(id)}
      />

      {/* Product Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleProductSubmit}
            onCancel={() => setShowProductForm(false)}
            isLoading={createProduct.isPending || updateProduct.isPending}
            suppliers={suppliers}
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
