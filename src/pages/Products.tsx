import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productService } from "@/api/services/productService";
import { variantService } from "@/api/services/variantService";
import { supplierService } from "@/api/services/supplierService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Package, ChevronDown, ChevronRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductForm from "@/components/products/ProductForm";
import VariantForm from "@/components/products/VariantForm";
import VariantCard from "@/components/products/VariantCard";
import { PRODUCT_TYPE_BADGES, PRODUCT_TYPE_LABELS } from "@/constants/productType";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariantDTO | null>(null);
  const [highlightVariantId, setHighlightVariantId] = useState<number | null>(null);

  // Fetch products, variants, suppliers
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

  // Handle URL params to expand product and highlight variant
  useEffect(() => {
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    
    if (productId) {
      const id = Number(productId);
      setExpandedProductId(id);
      setCurrentProductId(id);
      
      if (variantId) {
        setHighlightVariantId(Number(variantId));
        
        // Clear highlight after 3 seconds
        const timer = setTimeout(() => {
          setHighlightVariantId(null);
          // Clear URL params
          setSearchParams({});
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, setSearchParams]);

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
      setShowVariantForm(false);
      setEditingVariant(null);
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
      setShowVariantForm(false);
      setEditingVariant(null);
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
    const payload: CreateProductVariantDTO = {
      color: data.color,
      size: Number(data.size),
      quantity: Number(data.quantity),
      salePrice: Number(data.salePrice),
    };

    if (editingVariant?.productVariantId) {
      updateVariant.mutate({ variantId: editingVariant.productVariantId, data: payload });
    } else {
      createVariant.mutate({ productId: currentProductId, data: payload });
    }
  };

  const handleRowClick = (product: ProductDTO) => {
    const id = product.productId;
    if (expandedProductId === id) {
      setExpandedProductId(null);
      setCurrentProductId(null);
      return;
    }
    setExpandedProductId(id);
    setCurrentProductId(id);
  };

  const handleDeleteProduct = (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    deleteProduct.mutate(id);
  };

  const handleDeleteVariant = (id: number) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    deleteVariant.mutate(id);
  };

  // -------------------- Render --------------------
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage products and variants</p>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" /> New Product
        </Button>
      </div>

      {/* Loading State */}
      {loadingProducts ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No products yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Start by creating your first product and adding variants.
          </p>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create First Product
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <React.Fragment key={product.productId}>
                    {/* Product Row */}
                    <tr
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(product)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {expandedProductId === product.productId ? (
                            <ChevronDown className="w-4 h-4 text-slate-400 mr-2" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 mr-2" />
                          )}
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                            <Package className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="text-sm font-medium text-slate-900">
                            {product.productName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge className={PRODUCT_TYPE_BADGES[product.productType]}>
                          {PRODUCT_TYPE_LABELS[product.productType]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            aria-label="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.productId);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Variants Section */}
                    {expandedProductId === product.productId && (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 bg-slate-50">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-slate-700">Variants</h3>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentProductId(product.productId);
                                  setEditingVariant(null);
                                  setShowVariantForm(true);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Variant
                              </Button>
                            </div>

                            {loadingVariants ? (
                              <p className="text-xs text-slate-400 text-center py-4">Loading variants...</p>
                            ) : variants.length === 0 ? (
                              <p className="text-xs text-slate-400 text-center py-4">No variants yet</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {variants.map((v) => (
                                  <VariantCard
                                    key={v.productVariantId}
                                    variant={v}
                                    onEdit={(variant) => {
                                      setEditingVariant(variant);
                                      setShowVariantForm(true);
                                    }}
                                    onDelete={handleDeleteVariant}
                                    highlight={highlightVariantId === v.productVariantId}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Hidden on desktop */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-slate-200">
                {/* Product Header */}
                <button
                  className="w-full p-4 text-left"
                  onClick={() => handleRowClick(product)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRowClick(product);
                    }
                  }}
                  tabIndex={0}
                  aria-expanded={expandedProductId === product.productId}
                  aria-label={`${product.productName} - Click to view variants`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-900">
                          {product.productName}
                        </div>
                        <Badge className={`${PRODUCT_TYPE_BADGES[product.productType]} mt-1`}>
                          {PRODUCT_TYPE_LABELS[product.productType]}
                        </Badge>
                      </div>
                      {expandedProductId === product.productId ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 mt-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(product);
                        setShowProductForm(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8"
                      aria-label="Edit product"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.productId);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      aria-label="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </button>

                {/* Expanded Variants Section */}
                {expandedProductId === product.productId && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700">Variants</h3>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCurrentProductId(product.productId);
                            setEditingVariant(null);
                            setShowVariantForm(true);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>

                      {loadingVariants ? (
                        <p className="text-xs text-slate-400 text-center py-4">Loading variants...</p>
                      ) : variants.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No variants yet</p>
                      ) : (
                        <div className="space-y-2">
                          {variants.map((v) => (
                            <VariantCard
                              key={v.productVariantId}
                              variant={v}
                              onEdit={(variant) => {
                                setEditingVariant(variant);
                                setShowVariantForm(true);
                              }}
                              onDelete={handleDeleteVariant}
                              highlight={highlightVariantId === v.productVariantId}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Product Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingProduct ? "Edit Product" : "New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleProductSubmit}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
            isLoading={createProduct.isPending || updateProduct.isPending}
            suppliers={suppliers}
          />
        </DialogContent>
      </Dialog>

      {/* Variant Dialog */}
      <Dialog open={showVariantForm} onOpenChange={setShowVariantForm}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingVariant ? "Edit Variant" : "New Variant"}
            </DialogTitle>
          </DialogHeader>
          <VariantForm
            variant={editingVariant}
            productId={currentProductId}
            onSubmit={handleVariantSubmit}
            onCancel={() => {
              setShowVariantForm(false);
              setEditingVariant(null);
            }}
            isLoading={createVariant.isPending || updateVariant.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}