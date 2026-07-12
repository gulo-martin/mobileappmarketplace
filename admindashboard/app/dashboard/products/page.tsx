"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PlusIcon, PencilSquareIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import BGImage from "@/public/home.jpg";
import { db } from "@/app/lib/firebase";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl?: string;
  images?: string[] | string;
  isActive?: boolean;
  createdAt?: { seconds: number } | null;
};

type ProductForm = {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  imageUrl: string;
  isActive: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  price: "",
  description: "",
  category: "",
  stock: "",
  imageUrl: "",
  isActive: true,
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [erroredImages, setErroredImages] = useState<Record<string, boolean>>({});
  const [resolvedImageUrls, setResolvedImageUrls] = useState<Record<string, string>>({});
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  function normalizeImageUrl(raw?: string) {
    if (!raw) return "";

    const s = raw.trim().replace(/^['"]|['"]$/g, "");
    if (!s) return "";
    if (s.startsWith("data:")) return s;
    if (s.startsWith("//")) return `https:${s}`;

    const urlMatch = s.match(/https?:\/\/[^\s"'<>]+/i);
    if (urlMatch) {
      const matchedUrl = urlMatch[0];
      const url = new URL(matchedUrl);
      const host = url.hostname.toLowerCase();

      if (host === "ibb.co" || host === "www.ibb.co") {
        const directImageMatch = matchedUrl.match(/https?:\/\/i\.ibb\.co\/[^"'\s]+/i);
        if (directImageMatch) {
          return directImageMatch[0];
        }

        return matchedUrl;
      }

      if (host === "imgbb.com" || host === "www.imgbb.com") {
        return matchedUrl;
      }

      return matchedUrl;
    }

    if (/^[^/]+\.[^/]+/.test(s)) return `https://${s}`;
    return s;
  }

  const resolveImageUrl = React.useCallback(async (raw?: string) => {
    const normalized = normalizeImageUrl(raw);
    if (!normalized) return "";

    try {
      const url = new URL(normalized);
      const host = url.hostname.toLowerCase();

      if (host === "ibb.co" || host === "www.ibb.co") {
        const response = await fetch(`${normalized.replace(/\/$/, "")}/oembed.json`, {
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          return normalizeImageUrl(data?.url || data?.thumbnail_url || "");
        }
      }

      if (host === "imgbb.com" || host === "www.imgbb.com") {
        const response = await fetch(`${normalized.replace(/\/$/, "")}/oembed.json`, {
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          return normalizeImageUrl(data?.url || data?.thumbnail_url || "");
        }
      }
    } catch {
      // fall back to the original normalized URL
    }

    return normalized;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, "id">),
      })) as Product[];
      setProducts(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const resolveProducts = async () => {
      const resolved: Record<string, string> = {};

      for (const product of products) {
        const resolvedUrl = await resolveImageUrl(product.imageUrl);
        if (!cancelled && resolvedUrl) {
          resolved[product.id] = resolvedUrl;
        }
      }

      if (!cancelled) {
        setResolvedImageUrls(resolved);
      }
    };

    if (products.length > 0) {
      void resolveProducts();
    }

    return () => {
      cancelled = true;
    };
  }, [products, resolveImageUrl]);

  useEffect(() => {
    let cancelled = false;

    const resolvePreview = async () => {
      const resolvedUrl = await resolveImageUrl(formData.imageUrl);
      if (!cancelled) {
        setPreviewImageUrl(resolvedUrl);
      }
    };

    if (formData.imageUrl.trim()) {
      void resolvePreview();
    }

    return () => {
      cancelled = true;
    };
  }, [formData.imageUrl, resolveImageUrl]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      setError("Please fill in the required product details.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const imageUrl = normalizeImageUrl(formData.imageUrl);

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock || 0),
        imageUrl,
        isActive: formData.isActive,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
      isActive: product.isActive ?? true,
    });
    setError("");
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Delete this product from your catalog?")) return;

    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete the product.");
    }
  };

  return (
    <div className="desktop-view-shell">
      <div className="w-[95%] mx-auto space-y-6 py-4">
      <div className="relative overflow-hidden rounded-[28px]">
        <Image
          src={BGImage}
          alt="Products dashboard banner"
          className="h-60 w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-900/55 to-blue-600/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
            Product management
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Manage your catalog beautifully</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
            Add new products, update details, and remove outdated items with a clean admin experience.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Your products</h2>
              <p className="text-sm text-slate-500">Live inventory from Firestore</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
              {products.length} items
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              No products yet. Add your first one using the form.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => {
                const productImageUrl = resolvedImageUrls[product.id] || normalizeImageUrl(product.imageUrl);
                const imageFailed = Boolean(erroredImages[product.id]);

                return (
                  <article key={product.id} className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50">
                    <div className="relative h-44 w-full bg-slate-200">
                        <Image
                          src={ imageFailed || !productImageUrl ? productImageUrl : productImageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          width={200}
                          height={200}
                          onError={() => setErroredImages((prev) => ({ ...prev, [product.id]: true }))}
                        />
                   
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-500">{product.category}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                          {`MWK ${Number(product.price).toLocaleString()}`}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-3">{product.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                        <span>Stock: {product.stock}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="ml-auto flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-full bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            aria-label={`Edit ${product.name}`}
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-full bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                            aria-label={`Delete ${product.name}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {editingId ? "Update product" : "Add a new product"}
              </h2>
              <p className="text-sm text-slate-500">Upload an image and keep Firestore in sync.</p>
            </div>
            <button
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {editingId ? "Cancel" : "Reset"}
            </button>
          </div>

          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Product name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="e.g. Premium Headphones"
                />
              </div>
              <div>
                <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-slate-700">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="Describe your product"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>
              <div>
                <label htmlFor="stock" className="mb-1.5 block text-sm font-medium text-slate-700">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active product</label>
            </div>

            <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4">
              <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-slate-700">Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {previewImageUrl ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={previewImageUrl}
                    alt="Product preview"
                    className="h-40 w-full object-cover"
                  />
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              <PlusIcon className="h-5 w-5" />
              {submitting ? "Saving..." : editingId ? "Update product" : "Save product"}
            </button>
          </form>
        </section>
      </div>

      {/* bottom-text */}
      <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ZipMarketPlace. All rights reserved.
      </div>
    </div>
    </div>
  );
}

export default ProductsPage;