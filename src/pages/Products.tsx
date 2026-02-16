import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ChevronDown,
  ChevronRight,
  Inbox,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductForm from "@/components/products/ProductForm";
import VariantForm from "@/components/products/VariantForm";
import VariantCard from "@/components/products/VariantCard";
import {
  PRODUCT_TYPE_BADGES,
  PRODUCT_TYPE_LABELS,
} from "@/constants/productType";
import { useTheme } from "@/ThemeContext";
import type {
  RequestProductVariantDTO,
  CreateProductVariantDTO,
  ProductDTO,
  ProductVariantDTO,
  RequestProductDTO,
  SupplierDTO,
} from "@/api/types";
import CustomDropdown from "@/components/products/CustomDropdown";
import { useToastHelper } from "@/components/ui/toastHelper";

export default function Products() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode } = useTheme();
  const { toastCreate, toastUpdate, toastDelete } = useToastHelper();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(
    null,
  );
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] =
    useState<ProductVariantDTO | null>(null);
  const [highlightVariantId, setHighlightVariantId] = useState<number | null>(
    null,
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<
    "all" | "color" | "size" | "sku"
  >("all");

  // Fetch products, variants, suppliers
  const { data: products = [], isLoading: loadingProducts } = useQuery<
    ProductDTO[]
  >({
    queryKey: ["products"],
    queryFn: () => productService.list().then((r) => r.data.data),
  });

  const { data: allVariants = [] } = useQuery<ProductVariantDTO[]>({
    queryKey: ["allVariants"],
    queryFn: () => variantService.listAll().then((r) => r.data.data),
  });

  const { data: variants = [], isLoading: loadingVariants } = useQuery<
    ProductVariantDTO[]
  >({
    queryKey: ["productVariants", currentProductId],
    queryFn: () =>
      currentProductId
        ? variantService
            .listByProduct(currentProductId)
            .then((r) => r.data.data)
        : Promise.resolve([]),
    enabled: currentProductId !== null,
  });

  const { data: suppliers = [] } = useQuery<SupplierDTO[]>({
    queryKey: ["suppliers"],
    queryFn: () => supplierService.list().then((r) => r.data.data),
  });

  const [searchTarget, setSearchTarget] = useState<
    "all" | "products" | "variants"
  >("all"); // add this above useMemo

  const filteredVariants = useMemo(() => {
    if (!searchQuery.trim()) return { products, variants: allVariants };

    const query = searchQuery.toLowerCase();

    if (searchTarget === "products") {
      const matchedProducts = products.filter(
        (p) =>
          p.productName.toLowerCase().includes(query) ||
          PRODUCT_TYPE_LABELS[p.productType].toLowerCase().includes(query),
      );
      return { products: matchedProducts, variants: [] };
    }

    if (searchTarget === "variants") {
      const matchedVariants = allVariants.filter((variant) => {
        switch (searchFilter) {
          case "color":
            return variant.color?.toLowerCase().includes(query);
          case "size":
            return variant.size?.toString().includes(query);
          case "sku":
            return variant.sku?.toLowerCase().includes(query);
          default:
            return (
              variant.color?.toLowerCase().includes(query) ||
              variant.size?.toString().includes(query) ||
              variant.sku?.toLowerCase().includes(query)
            );
        }
      });

      const matchedVariantProductIds = new Set(
        matchedVariants.map((v) => v.productId),
      );
      const filteredProducts = products.filter((p) =>
        matchedVariantProductIds.has(p.productId),
      );

      return { products: filteredProducts, variants: matchedVariants };
    }

    // Default: search both products and variants
    const matchedVariants = allVariants.filter((variant) => {
      switch (searchFilter) {
        case "color":
          return variant.color?.toLowerCase().includes(query);
        case "size":
          return variant.size?.toString().includes(query);
        case "sku":
          return variant.sku?.toLowerCase().includes(query);
        default:
          return (
            variant.color?.toLowerCase().includes(query) ||
            variant.size?.toString().includes(query) ||
            variant.sku?.toLowerCase().includes(query)
          );
      }
    });

    const matchedVariantProductIds = new Set(
      matchedVariants.map((v) => v.productId),
    );

    const matchedProducts = products.filter(
      (p) =>
        matchedVariantProductIds.has(p.productId) ||
        p.productName.toLowerCase().includes(query) ||
        PRODUCT_TYPE_LABELS[p.productType].toLowerCase().includes(query),
    );

    return { products: matchedProducts, variants: matchedVariants };
  }, [searchQuery, searchFilter, searchTarget, products, allVariants]);

  // Handle URL params to expand product and highlight variant
  useEffect(() => {
    const productId = searchParams.get("productId");
    const variantId = searchParams.get("variantId");

    if (productId) {
      const id = Number(productId);
      setExpandedProductId(id);
      setCurrentProductId(id);

      if (variantId) {
        setHighlightVariantId(Number(variantId));

        const timer = setTimeout(() => {
          setHighlightVariantId(null);
          setSearchParams({});
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, setSearchParams]);

  // -------------------- Mutations --------------------
  const createProduct = useMutation({
    mutationFn: (data: RequestProductDTO) =>
      productService.create(data).then((r) => r.data.data),
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
    mutationFn: ({
      productId,
      data,
    }: {
      productId: number;
      data: CreateProductVariantDTO;
    }) => variantService.create(productId, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productVariants", currentProductId],
      });
      queryClient.invalidateQueries({ queryKey: ["allVariants"] });
      setShowVariantForm(false);
      setEditingVariant(null);
      toastCreate("Variant created successfully");
    },
    onError: (error: any) => {
      toastDelete(error?.response?.data?.message ?? "Variant already exists");
    },
  });

  const updateVariant = useMutation({
    mutationFn: ({
      variantId,
      data,
    }: {
      variantId: number;
      data: CreateProductVariantDTO;
    }) => variantService.update(variantId, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productVariants", currentProductId],
      });
      queryClient.invalidateQueries({ queryKey: ["allVariants"] });
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
      queryClient.invalidateQueries({
        queryKey: ["productVariants", currentProductId],
      });
      queryClient.invalidateQueries({ queryKey: ["allVariants"] });
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
      updateVariant.mutate({
        variantId: editingVariant.productVariantId,
        data: payload,
      });
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

  const displayProducts = searchQuery ? filteredVariants.products : products;
  const displayVariants = searchQuery
    ? filteredVariants.variants.filter((v) => v.productId === currentProductId)
    : variants;

  // -------------------- Render --------------------
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Products
          </h1>
          <p
            className={`text-sm mt-1 ${darkMode ? "text-[#A39180]" : "text-slate-500"}`}
          >
            Manage products and variants
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}
          className={`${darkMode ? "bg-[#8B7355] hover:bg-[#7A6854]" : "bg-[#8B7355] hover:bg-[#7A6854]"} text-white`}
        >
          <Plus className="w-4 h-4 mr-2" /> New Product
        </Button>
      </div>

      {/* Search Section */}
      <div
        className={`mb-6 p-4 rounded-xl ${darkMode ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-stone-200"} shadow-sm`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or variants..."
              className={`w-full pl-10 pr-3 py-2.5 rounded-lg text-sm transition-all
          ${
            darkMode
              ? "bg-neutral-700 border border-neutral-600 text-white placeholder-[#A39180] focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20"
              : "bg-white border border-stone-300 text-slate-900 placeholder-slate-400 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20"
          } focus:outline-none`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-[#A39180] hover:text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Target Dropdown */}
          <CustomDropdown
            options={[
              { label: "Products & Variants", value: "all" },
              { label: "Products Only", value: "products" },
              { label: "Variants Only", value: "variants" },
            ]}
            value={searchTarget}
            onChange={(val: string) =>
              setSearchTarget(val as "all" | "products" | "variants")
            }
          />

          {/* Variant Filter Dropdown */}
          <CustomDropdown
            options={[
              { label: "All Fields", value: "all" },
              { label: "Color", value: "color" },
              { label: "Size", value: "size" },
              { label: "SKU", value: "sku" },
            ]}
            value={searchFilter}
            onChange={(val: string) =>
              setSearchFilter(val as "all" | "color" | "size" | "sku")
            }
          />
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div
            className={`mt-3 text-sm ${darkMode ? "text-[#A39180]" : "text-slate-600"}`}
          >
            Found {displayProducts.length} product
            {displayProducts.length === 1 ? "" : "s"} with{" "}
            {filteredVariants.variants.length} matching variant
            {filteredVariants.variants.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loadingProducts ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div
              className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${darkMode ? "border-neutral-700 border-t-[#8B7355]" : "border-stone-200 border-t-[#8B7355]"}`}
            ></div>
            <p className={darkMode ? "text-[#A39180]" : "text-slate-500"}>
              Loading products...
            </p>
          </div>
        </div>
      ) : displayProducts.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? "bg-neutral-800" : "bg-slate-100"}`}
          >
            <Inbox
              className={`w-8 h-8 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
            />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            {searchQuery ? "No matching products" : "No products yet"}
          </h3>
          <p
            className={`text-sm mb-6 max-w-sm ${darkMode ? "text-[#A39180]" : "text-slate-500"}`}
          >
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start by creating your first product and adding variants."}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className={`${darkMode ? "bg-[#8B7355] hover:bg-[#7A6854]" : "bg-[#8B7355] hover:bg-[#7A6854]"} text-white`}
            >
              <Plus className="w-4 h-4 mr-2" /> Create First Product
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div
            className={`hidden md:block rounded-xl shadow-sm overflow-hidden ${darkMode ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-slate-200"}`}
          >
            <table className="w-full">
              <thead
                className={
                  darkMode
                    ? "bg-neutral-900 border-b border-neutral-700"
                    : "bg-slate-50 border-b border-slate-200"
                }
              >
                <tr>
                  <th
                    className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-[#A39180]" : "text-slate-500"}`}
                  >
                    Product
                  </th>
                  <th
                    className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-[#A39180]" : "text-slate-500"}`}
                  >
                    Type
                  </th>
                  <th
                    className={`px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? "text-[#A39180]" : "text-slate-500"}`}
                  ></th>
                </tr>
              </thead>
              <tbody
                className={
                  darkMode
                    ? "divide-y divide-neutral-700"
                    : "divide-y divide-slate-200"
                }
              >
                {displayProducts.map((product) => (
                  <React.Fragment key={product.productId}>
                    {/* Product Row */}
                    <tr
                      className={`transition-colors cursor-pointer ${darkMode ? "hover:bg-neutral-700" : "hover:bg-slate-50"}`}
                      onClick={() => handleRowClick(product)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {expandedProductId === product.productId ? (
                            <ChevronDown
                              className={`w-4 h-4 mr-2 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                            />
                          ) : (
                            <ChevronRight
                              className={`w-4 h-4 mr-2 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                            />
                          )}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${darkMode ? "bg-[#8B7355]/20" : "bg-purple-100"}`}
                          >
                            <Package
                              className={`w-4 h-4 ${darkMode ? "text-[#E8DDD0]" : "text-purple-600"}`}
                            />
                          </div>
                          <div
                            className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}
                          >
                            {product.productName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={PRODUCT_TYPE_BADGES[product.productType]}
                        >
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
                            className={
                              darkMode
                                ? "text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20"
                                : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            }
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
                        <td
                          colSpan={3}
                          className={`px-4 py-4 ${darkMode ? "bg-neutral-900" : "bg-slate-50"}`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3
                                className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}
                              >
                                Variants
                              </h3>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentProductId(product.productId);
                                  setEditingVariant(null);
                                  setShowVariantForm(true);
                                }}
                                className={`${darkMode ? "bg-[#8B7355] hover:bg-[#7A6854]" : "bg-[#8B7355] hover:bg-[#7A6854]"} text-white`}
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Variant
                              </Button>
                            </div>

                            {loadingVariants ? (
                              <p
                                className={`text-xs text-center py-4 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                              >
                                Loading variants...
                              </p>
                            ) : displayVariants.length === 0 ? (
                              <p
                                className={`text-xs text-center py-4 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                              >
                                {searchQuery
                                  ? "No matching variants"
                                  : "No variants yet"}
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {displayVariants.map((v) => (
                                  <VariantCard
                                    key={v.productVariantId}
                                    variant={v}
                                    onEdit={(variant) => {
                                      setEditingVariant(variant);
                                      setShowVariantForm(true);
                                    }}
                                    onDelete={handleDeleteVariant}
                                    highlight={
                                      highlightVariantId === v.productVariantId
                                    }
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
            {displayProducts.map((product) => (
              <div
                key={product.productId}
                className={`rounded-xl shadow-sm ${darkMode ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-slate-200"}`}
              >
                {/* Product Header */}
                <button
                  className="w-full p-4 text-left"
                  onClick={() => handleRowClick(product)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? "bg-[#8B7355]/20" : "bg-purple-100"}`}
                      >
                        <Package
                          className={`w-5 h-5 ${darkMode ? "text-[#E8DDD0]" : "text-purple-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
                        >
                          {product.productName}
                        </div>
                        <Badge
                          className={`${PRODUCT_TYPE_BADGES[product.productType]} mt-1`}
                        >
                          {PRODUCT_TYPE_LABELS[product.productType]}
                        </Badge>
                      </div>
                      {expandedProductId === product.productId ? (
                        <ChevronDown
                          className={`w-5 h-5 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                        />
                      ) : (
                        <ChevronRight
                          className={`w-5 h-5 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                        />
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
                      className={`h-8 w-8 ${darkMode ? "text-[#E8DDD0] hover:text-white hover:bg-[#8B7355]/20" : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"}`}
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
                  <div
                    className={`border-t p-4 ${darkMode ? "border-neutral-700 bg-neutral-900" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}
                        >
                          Variants
                        </h3>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCurrentProductId(product.productId);
                            setEditingVariant(null);
                            setShowVariantForm(true);
                          }}
                          className={`${darkMode ? "bg-[#8B7355] hover:bg-[#7A6854]" : "bg-[#8B7355] hover:bg-[#7A6854]"} text-white`}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                      </div>

                      {loadingVariants ? (
                        <p
                          className={`text-xs text-center py-4 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                        >
                          Loading variants...
                        </p>
                      ) : displayVariants.length === 0 ? (
                        <p
                          className={`text-xs text-center py-4 ${darkMode ? "text-[#A39180]" : "text-slate-400"}`}
                        >
                          {searchQuery
                            ? "No matching variants"
                            : "No variants yet"}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {displayVariants.map((v) => (
                            <VariantCard
                              key={v.productVariantId}
                              variant={v}
                              onEdit={(variant) => {
                                setEditingVariant(variant);
                                setShowVariantForm(true);
                              }}
                              onDelete={handleDeleteVariant}
                              highlight={
                                highlightVariantId === v.productVariantId
                              }
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
        <DialogContent
          className={`w-full sm:max-w-2xl max-h-[90vh] sm:rounded-lg overflow-y-auto ${
            darkMode ? "bg-neutral-800 border-neutral-700" : "bg-white"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
            >
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
        <DialogContent
          className={`sm:max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? "bg-neutral-800 border-neutral-700" : "bg-white"}`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
            >
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
