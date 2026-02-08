import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/layout/Layout";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // URL State values
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  // 1. Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/products/categories");
      return res.data;
    }
  });

  // 2. Fetch Products with Filters
  const { data, isLoading } = useQuery({
    queryKey: ["products", search, category, page],
    queryFn: async () => {
      let url = `/products?limit=${limit}&skip=${skip}`;
      if (search) url = `/products/search?q=${search}&limit=${limit}&skip=${skip}`;
      else if (category) url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
      const res = await api.get(url);
      return res.data;
    }
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
    }
  });

  // Helper to update URL params
  const updateParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    if (key !== "page") newParams.set("page", "1"); // Reset to page 1 on new filter
    setSearchParams(newParams);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Products</h2>
        <button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-colors">
          + Add New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          placeholder="Search products..."
          className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 w-full sm:max-w-xs text-white outline-none focus:border-purple-500 transition-all"
          value={search}
          onChange={(e) => updateParams("search", e.target.value)}
        />
        <select
          className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 w-full sm:w-auto text-white outline-none focus:border-purple-500 cursor-pointer"
          value={category}
          onChange={(e) => updateParams("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map((c: any) => (
            <option key={c.slug || c} value={c.slug || c}>{c.name || c}</option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-purple-500/10 text-purple-300">
              <tr>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Product</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Stock</th>
                <th className="p-4 text-xs uppercase tracking-wider font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {isLoading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500">Loading products...</td></tr>
              ) : data?.products.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500">No products found.</td></tr>
              ) : data?.products.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} className="w-10 h-10 rounded-lg object-cover bg-black border border-white/5" alt={p.title} />
                      <span className="text-sm font-medium truncate max-w-[200px] text-white">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-200 font-semibold">${p.price}</td>
                  <td className={`p-4 text-sm ${p.stock < 10 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                    {p.stock} units
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-500/20 transition-all">Edit</button>
                      <button onClick={() => setDeleteId(p.id)} className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111] p-4 rounded-xl border border-white/5">
        <p className="text-xs text-slate-500">Showing {skip + 1} - {Math.min(skip + limit, data?.total || 0)} of {data?.total || 0} products</p>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            disabled={page === 1}
            onClick={() => updateParams("page", (page - 1).toString())}
            className="flex-1 sm:flex-none px-4 py-2 bg-white/5 text-white rounded-lg disabled:opacity-20 hover:bg-white/10 transition-all"
          >
            Previous
          </button>
          <button
            disabled={!data || (skip + limit) >= data.total}
            onClick={() => updateParams("page", (page + 1).toString())}
            className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-20 hover:bg-purple-700 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
            <p className="text-slate-400 mb-6 text-sm">Are you sure you want to remove this item? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-white/5 text-white py-2 rounded-xl hover:bg-white/10 transition-all">Cancel</button>
              <button 
                onClick={() => deleteMutation.mutate(deleteId)} 
                disabled={deleteMutation.isPending} 
                className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}