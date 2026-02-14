import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import VariantCard from "../products/VariantCard";
import { PRODUCT_TYPE_BADGES, PRODUCT_TYPE_LABELS } from "@/constants/productType";
import type { ProductDTO, ProductVariantDTO } from "@/api/types";

export interface ProductsTableProps {
  products: ProductDTO[];
  expandedProductId: number | null;
  variants: ProductVariantDTO[];
  loadingProducts: boolean;
  loadingVariants: boolean;
  onRowClick: (row: ProductDTO) => void;
  onEditProduct: (product: ProductDTO) => void;
  onDeleteProduct: (productId: number) => void;
  onAddVariant: (productId: number) => void;
  onEditVariant: (variant: ProductVariantDTO) => void;
  onDeleteVariant: (variantId: number) => void;
  highlightVariantId?: number | null;
}

export default function ProductsTable({
  products,
  expandedProductId,
  variants,
  loadingProducts,
  loadingVariants,
  onRowClick,
  onEditProduct,
  onDeleteProduct,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  highlightVariantId,
}: Readonly<ProductsTableProps>) {
  if (loadingProducts) {
    return <p className="text-center text-slate-400">Loading products…</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">No products yet. Click "New Product" to add one.</p>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-100">
              <TableHead>Product Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <React.Fragment key={product.productId}>
                {/* Product row */}
                <TableRow
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick(product)}
                >
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>
                    <Badge className={PRODUCT_TYPE_BADGES[product.productType]}>
                      {PRODUCT_TYPE_LABELS[product.productType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct(product.productId);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded variants row */}
                {expandedProductId === product.productId && (
                  <TableRow>
                    <td colSpan={3} className="p-4 bg-slate-100/60 rounded-xl">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Variants</h3>

                        {loadingVariants && (
                          <p className="text-xs text-slate-400 text-center">Loading variants…</p>
                        )}

                        {!loadingVariants && variants.length === 0 && (
                          <p className="text-xs text-slate-400 text-center">No variants yet</p>
                        )}

                        {!loadingVariants && variants.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {variants.map((v) => (
                              <VariantCard
                                key={v.productVariantId}
                                variant={v}
                                onEdit={onEditVariant}
                                onDelete={onDeleteVariant}
                                highlight={highlightVariantId === v.productVariantId}
                              />
                            ))}
                          </div>
                        )}

                        <Button
                          className="w-full bg-black hover:bg-gray-900 text-white mt-4"
                          onClick={() => onAddVariant(product.productId)}
                        >
                          Add Variant
                        </Button>
                      </div>
                    </td>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
