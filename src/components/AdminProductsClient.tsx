"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  updateProductAction,
  createProductAction,
  deleteProductAction,
  adjustStockAction,
} from "@/actions/adminActions";
import {
  AlertCircle,
  Check,
  Edit2,
  Plus,
  Trash2,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
} from "lucide-react";

interface VariantItem {
  id: string;
  stock: number;
  color?: { colorName: string } | null;
  size?: { sizeName: string } | null;
}

interface ProductItem {
  id: string;
  name: string;
  nameNe?: string | null;
  slug: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  lowStockLimit: number;
  homepagePriority: number;
  featuredCategory?: string | null;
  status: string;
  category?: { id: string; name: string } | null;
  images: { imageUrl: string }[];
  colors?: { colorName: string }[];
  sizes?: { sizeName: string }[];
  variants: VariantItem[];
}

interface CategoryItem {
  id: string;
  name: string;
  nameNe?: string | null;
  slug: string;
}

export default function AdminProductsClient({
  products,
  categories,
}: {
  products: ProductItem[];
  categories: CategoryItem[];
}) {
  const [productList, setProductList] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  // Modal State for "Add New Product"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [newProdError, setNewProdError] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("ACTIVE");
  const [lowStockLimit, setLowStockLimit] = useState(5);
  const [homepagePriority, setHomepagePriority] = useState(0);
  const [featuredCategory, setFeaturedCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState<number | string>("");

  // Expandable variants drawer per product
  const [expandedVariantsId, setExpandedVariantsId] = useState<string | null>(null);

  // Quick stock action loading indicator
  const [stockActionLoading, setStockActionLoading] = useState<string | null>(null);

  // Filter products
  const filteredProducts = productList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nameNe && p.nameNe.includes(searchTerm)) ||
      p.slug.includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === "ALL" || p.category?.id === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const startEdit = (p: ProductItem) => {
    setEditingId(p.id);
    setStatus(p.status);
    setLowStockLimit(p.lowStockLimit);
    setHomepagePriority(p.homepagePriority);
    setFeaturedCategory(p.featuredCategory || "");
    setPrice(p.price);
    setDiscountPrice(p.discountPrice || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    formData.append("lowStockLimit", String(lowStockLimit));
    formData.append("homepagePriority", String(homepagePriority));
    formData.append("featuredCategory", featuredCategory);
    formData.append("price", String(price));
    if (discountPrice !== "") {
      formData.append("discountPrice", String(discountPrice));
    }

    try {
      const res = await updateProductAction(formData);
      if (res.success) {
        setEditingId(null);
        window.location.reload();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Stock Adjustment (+ / -)
  const handleStockDelta = async (productId: string, variantId: string | null, delta: number) => {
    setStockActionLoading(`${productId}-${variantId || "total"}`);
    try {
      const res = await adjustStockAction(productId, variantId, delta, true);
      if (res.success) {
        // Optimistically update
        setProductList((prev) =>
          prev.map((p) => {
            if (p.id === productId) {
              const updatedStock = Math.max(0, p.stock + delta);
              return {
                ...p,
                stock: updatedStock,
                status: updatedStock === 0 ? "OUT_OF_STOCK" : p.status === "OUT_OF_STOCK" ? "ACTIVE" : p.status,
                variants: p.variants.map((v) =>
                  v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v
                ),
              };
            }
            return p;
          })
        );
      }
    } finally {
      setStockActionLoading(null);
    }
  };

  // Delete / Remove Product
  const handleDelete = async (productId: string, productName: string) => {
    if (
      !confirm(
        `Are you sure you want to remove "${productName}" from the website? \n\nIf it has past customer orders, it will be safely hidden while keeping order records intact.`
      )
    ) {
      return;
    }

    try {
      const res = await deleteProductAction(productId);
      if (res.success) {
        alert(res.message);
        setProductList((prev) => prev.filter((p) => p.id !== productId));
      } else {
        alert("Failed to delete product.");
      }
    } catch (e: any) {
      alert(e.message || "Error deleting product");
    }
  };

  // Handle Add New Product Form Submission
  const handleAddNewProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingNew(true);
    setNewProdError("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createProductAction(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        window.location.reload();
      } else {
        setNewProdError(res.error || "Failed to create product");
      }
    } catch (err: any) {
      setNewProdError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Add Button Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 font-semibold text-gray-700 bg-white"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.nameNe ? `(${c.nameNe})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Product Trigger Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-orange-600/30 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product to Store</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Price (NPR)</th>
                <th className="py-4 px-4">Stock & Restock</th>
                <th className="py-4 px-4">Homepage Priority</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isEditing = editingId === p.id;
                const isLow = p.stock <= p.lowStockLimit;
                const isExpanded = expandedVariantsId === p.id;
                const img =
                  p.images[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";

                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-gray-50/60 transition">
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border">
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block line-clamp-1">
                              {p.name}
                            </span>
                            {p.nameNe && (
                              <span className="text-[11px] text-orange-700 font-medium block">
                                {p.nameNe}
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              {p.category?.name} • Slug: {p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="number"
                              value={price}
                              onChange={(e) => setPrice(parseFloat(e.target.value))}
                              placeholder="Price"
                              className="w-24 px-2 py-1 border rounded-lg text-xs"
                            />
                            <input
                              type="number"
                              value={discountPrice}
                              onChange={(e) => setDiscountPrice(e.target.value)}
                              placeholder="Sale Price"
                              className="w-24 px-2 py-1 border rounded-lg text-xs block"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className="font-black text-gray-900 block">
                              {formatPrice(p.discountPrice || p.price)}
                            </span>
                            {p.discountPrice && (
                              <span className="text-gray-400 line-through text-[11px]">
                                {formatPrice(p.price)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Stock Restock Controls */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black text-xs px-2 py-0.5 rounded-md ${
                                p.stock === 0
                                  ? "bg-red-100 text-red-700"
                                  : isLow
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-emerald-100 text-emerald-900"
                              }`}
                            >
                              {p.stock} in stock
                            </span>

                            {isLow && (
                              <span
                                className="text-amber-600 flex items-center gap-0.5 text-[10px] font-bold"
                                title={`Low stock limit: ${p.lowStockLimit}`}
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Low</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Add / Restock Buttons */}
                          <div className="flex items-center gap-1 text-[11px]">
                            <button
                              onClick={() => handleStockDelta(p.id, null, -1)}
                              disabled={p.stock <= 0 || stockActionLoading === `${p.id}-total`}
                              className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold disabled:opacity-30"
                              title="Decrease Stock by 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleStockDelta(p.id, null, 1)}
                              disabled={stockActionLoading === `${p.id}-total`}
                              className="px-1.5 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold"
                              title="Restock +1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleStockDelta(p.id, null, 5)}
                              disabled={stockActionLoading === `${p.id}-total`}
                              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold"
                              title="Restock Shipment +5"
                            >
                              +5
                            </button>

                            {p.variants.length > 0 && (
                              <button
                                onClick={() =>
                                  setExpandedVariantsId(isExpanded ? null : p.id)
                                }
                                className="ml-1 text-[10px] text-gray-500 hover:text-orange-600 flex items-center gap-0.5 underline font-medium"
                              >
                                <span>Variants ({p.variants.length})</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Homepage Priority & Featured Tag */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="number"
                              value={homepagePriority}
                              onChange={(e) =>
                                setHomepagePriority(parseInt(e.target.value, 10))
                              }
                              placeholder="Priority"
                              className="w-20 px-2 py-1 border rounded-lg text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={featuredCategory}
                              onChange={(e) => setFeaturedCategory(e.target.value)}
                              placeholder="e.g. SAREES, MENS"
                              className="w-28 px-2 py-1 border rounded-lg text-xs block"
                            />
                          </div>
                        ) : (
                          <div>
                            <span className="font-mono font-bold text-gray-800">
                              Priority: {p.homepagePriority}
                            </span>
                            {p.featuredCategory && (
                              <span className="text-[10px] text-orange-600 block uppercase font-bold">
                                {p.featuredCategory}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-2 py-1 border rounded-lg text-xs font-bold text-gray-800"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                            <option value="HIDDEN">HIDDEN</option>
                            <option value="DISCONTINUED">DISCONTINUED</option>
                          </select>
                        ) : (
                          <span
                            className={`font-black text-[10px] uppercase px-2.5 py-1 rounded-full ${
                              p.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "OUT_OF_STOCK"
                                ? "bg-amber-100 text-amber-800"
                                : p.status === "DISCONTINUED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {p.status}
                          </span>
                        )}
                      </td>

                      {/* Action buttons (Edit, Save, Delete) */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              disabled={isSaving}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
                              title="Save Changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(p)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition"
                              title="Edit Price & Settings"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                              title="Delete / Remove Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Variants Row */}
                    {isExpanded && p.variants.length > 0 && (
                      <tr className="bg-orange-50/40">
                        <td colSpan={6} className="py-3 px-6">
                          <div className="bg-white rounded-2xl border border-orange-200 p-4 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                              Individual Variant Restocking:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {p.variants.map((v) => (
                                <div
                                  key={v.id}
                                  className="flex items-center justify-between p-2 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-gray-900 block">
                                      {v.color?.colorName || "Standard Color"}{" "}
                                      {v.size?.sizeName ? `• ${v.size.sizeName}` : ""}
                                    </span>
                                    <span className="text-[11px] text-gray-500">
                                      Stock: <strong>{v.stock}</strong>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleStockDelta(p.id, v.id, -1)}
                                      disabled={v.stock <= 0}
                                      className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded font-bold disabled:opacity-30"
                                    >
                                      -1
                                    </button>
                                    <button
                                      onClick={() => handleStockDelta(p.id, v.id, 1)}
                                      className="px-2 py-0.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold"
                                    >
                                      +1
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* "Add New Product" Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-orange-600">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-black text-gray-900">
                  Add New Product to Store
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newProdError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {newProdError}
              </div>
            )}

            <form onSubmit={handleAddNewProduct} className="mt-5 space-y-4 text-xs">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Banarasi Georgette Party Saree"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Name (Nepali / नेपाली)
                  </label>
                  <input
                    type="text"
                    name="nameNe"
                    placeholder="जस्तै: बनारसी जर्जेट पार्टी साडी"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select name="categoryId" required className="w-full px-3 py-2 border rounded-xl">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.nameNe ? `(${c.nameNe})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue="Shree Traders"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Regular Price (NPR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    placeholder="3500"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Sale Price (Optional)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    min="0"
                    placeholder="2999"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Initial Stock (Qty) *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    defaultValue="5"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Low Stock Alert Limit
                  </label>
                  <input
                    type="number"
                    name="lowStockLimit"
                    defaultValue="3"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Homepage Priority & Featured Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Homepage Priority (0 - 10)
                  </label>
                  <input
                    type="number"
                    name="homepagePriority"
                    defaultValue="5"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                  <span className="text-[10px] text-gray-400">
                    Higher numbers show up at the very top of the homepage.
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Featured Tag (e.g. SAREES, KURTAS, MENS, KIDS)
                  </label>
                  <input
                    type="text"
                    name="featuredCategory"
                    placeholder="SAREES"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Primary Image URL *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Additional Image URLs (Comma or Newline separated)
                  </label>
                  <textarea
                    name="additionalImages"
                    rows={2}
                    placeholder="https://images.unsplash.com/image2.jpg, https://images.unsplash.com/image3.jpg"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Colors and Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Available Colors (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="colors"
                    placeholder="Red, Maroon, Navy Blue"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Available Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="sizes"
                    placeholder="Free Size (or M, L, XL)"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Description (English)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Product details, fabric quality, and drape..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Description (Nepali / नेपाली)
                  </label>
                  <textarea
                    name="descriptionNe"
                    rows={3}
                    placeholder="कपडाको विवरण, गुणस्तर तथा विशेषता..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold shadow-md hover:shadow-orange-600/30 transition flex items-center gap-2"
                >
                  {isSubmittingNew ? "Adding Product..." : "Add Product Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
