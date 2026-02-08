import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon 
} from "@heroicons/react/24/outline";

import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from "recharts";

export default function Dashboard() {
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products-stats"],
    queryFn: async () => {
      const res = await api.get("/products?limit=100");
      return res.data;
    },
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users-stats"],
    queryFn: async () => {
      const res = await api.get("/users?limit=1");
      return res.data;
    },
  });

  if (loadingProducts || loadingUsers) {
    return (
      <Layout>
        <div className="text-white p-10 flex items-center justify-center">
          <img 
            src="https://cdn.pixabay.com/animation/2023/11/30/10/11/10-11-02-622_512.gif" 
            className="w-24 h-24" 
            alt="loading"
          />
        </div>
      </Layout>
    );
  }

  const products = productsData?.products || [];

  // --- DATA PROCESSING ---
  const categoryMap: Record<string, number> = {};
  products.forEach((p: any) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 5);

  const ranges = [
    { name: "$0-50", value: products.filter((p: any) => p.price <= 50).length },
    { name: "$51-200", value: products.filter((p: any) => p.price > 50 && p.price <= 200).length },
    { name: "$201-500", value: products.filter((p: any) => p.price > 200 && p.price <= 500).length },
    { name: "$500+", value: products.filter((p: any) => p.price > 500).length },
  ];

  const topRatedData = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((p: any) => ({ name: p.title.substring(0, 15), rating: p.rating }));

  const COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#e879f9", "#2e1065"];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-500">Analytics and inventory distribution</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Products" value={productsData?.total || 0} icon={ShoppingBagIcon} />
        <StatsCard title="Total Users" value={usersData?.total || 0} icon={UsersIcon} />
        <StatsCard title="Low Stock" value={products.filter((p: any) => p.stock < 10).length} icon={ExclamationTriangleIcon} />
        <StatsCard title="Avg Price" value={`$${(products.reduce((acc: number, p: any) => acc + p.price, 0) / (products.length || 1)).toFixed(2)}`} icon={CurrencyDollarIcon} />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Donut */}
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
          <h3 className="text-white font-semibold mb-4 text-center">Top Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" className="outline-none">
              <PieChart className="outline-none">
                <Pie 
                  data={categoryData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value" 
                  stroke="none"
                  className="outline-none"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} 
                  itemStyle={{ color: "#fff" }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vertical Bar */}
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
          <h3 className="text-white font-semibold mb-4 text-center">Price Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" className="outline-none">
              <BarChart data={ranges} className="outline-none">
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={false} 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} 
                  itemStyle={{ color: "#fff" }} 
                />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Horizontal Bar */}
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Top 10 Rated Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" className="outline-none">
              <BarChart data={topRatedData} layout="vertical" margin={{ left: 40 }} className="outline-none">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={120} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={false} 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} 
                  itemStyle={{ color: "#fff" }} 
                />
                <Bar dataKey="rating" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}