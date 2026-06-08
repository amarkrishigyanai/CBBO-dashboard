import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmersPerTenant, getRevenueStats } from '../../store/thunks/cbboThunk';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { Building2, Search, ArrowUpDown, TrendingUp, Users, IndianRupee } from 'lucide-react';

const COLORS = [
  '#16a34a', // brand-600
  '#10b981', // emerald-500
  '#15803d', // brand-700
  '#059669', // emerald-600
  '#22c55e', // brand-500
  '#34d399', // emerald-400
  '#166534', // brand-800
  '#047857', // emerald-700
  '#4ade80', // brand-400
  '#065f46', // emerald-800
  '#14532d', // brand-900
  '#064e3b', // emerald-900
  '#86efac', // brand-300
  '#a7f3d0', // emerald-200
  '#bbf7d0', // brand-200
];

const DEMO_SHARE = [
  { name: 'Nagar FPO Hanumangarh', value: 11.2 },
  { name: 'Marwar Kisan Samridhi FPO', value: 10.6 },
  { name: 'Mewar Krishi Vikas FPO', value: 9.8 },
  { name: 'Shekhawati Agri Producer', value: 9.0 },
  { name: 'Brij Kisan Utpadak Sangh', value: 8.3 },
  { name: 'Bikaner Dryland FPO', value: 6.8 },
  { name: 'Aravalli Green Producers', value: 6.2 },
  { name: 'Chambal Valley FPO', value: 7.5 },
  { name: 'Hadoti Farmers Collective', value: 6.0 },
  { name: 'Dhundhar Kisan Producer Co.', value: 5.4 },
  { name: 'Malani Seed Farmers FPO', value: 4.8 },
  { name: 'Godwar Agri Collective', value: 4.6 },
  { name: 'Thar Organic Producers', value: 3.9 },
  { name: 'Vagad Tribal Farmers FPO', value: 3.3 },
  { name: 'Mewat Agri Producer Society', value: 2.6 },
];

const fmtINR = (v) => {
  const n = Number(v) || 0;
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

export default function FpoAnalytics() {
  const dispatch = useDispatch();
  const { farmersPerTenant, farmersPerTenantLoading, revenueStats, revenueLoading } = useSelector((s) => s.cbbo);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('farmers');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedFpo, setSelectedFpo] = useState(null);
  const PER_PAGE = 50;

  const demoMode = useSelector((s) => s.layout.demoMode);
  useEffect(() => {
    dispatch(getFarmersPerTenant());
    dispatch(getRevenueStats());
  }, [dispatch, demoMode]);
  useEffect(() => { setPage(1); }, [search, sortField]);

  const handleViewRevenue = (fpo) => {
    setSelectedFpo(prev => prev?.tenantId === fpo.tenantId ? null : fpo);
    dispatch(getRevenueStats(fpo.tenantId));
  };

  if (farmersPerTenantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
      </div>
    );
  }

  const tenants = Array.isArray(farmersPerTenant) ? farmersPerTenant : (farmersPerTenant?.tenants ?? []);
  const totalFarmers = tenants.reduce((s, t) => s + (t.totalFarmers ?? 0), 0);
  const totalFpos = tenants.length;
  const avgFarmers = totalFpos ? Math.round(totalFarmers / totalFpos) : 0;

  // Build top-10 by salesRevenue from global revenueStats
  const revenuePerTenant = revenueStats?.revenuePerTenant ?? [];
  const top10 = [...revenuePerTenant]
    .sort((a, b) => (b.salesRevenue ?? 0) - (a.salesRevenue ?? 0))
    .slice(0, 10)
    .map(r => ({ name: r.tenantName, salesRevenue: r.salesRevenue, procurementExpense: r.procurementExpense, netRevenue: r.netRevenue }));

  // Sales share donut data
  const donutData = revenuePerTenant
    .filter(r => (r.salesRevenue ?? 0) > 0)
    .map(r => ({ name: r.tenantName, value: r.salesRevenue }));

  const toggleSort = (field) => {
    if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const filtered = [...tenants]
    .filter(t => {
      const q = search.toLowerCase();
      return (t.tenantName ?? '').toLowerCase().includes(q) || (t.tenantCode ?? '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let vA = a[sortField === 'farmers' ? 'totalFarmers' : sortField] ?? 0;
      let vB = b[sortField === 'farmers' ? 'totalFarmers' : sortField] ?? 0;
      return sortOrder === 'asc' ? (vA > vB ? 1 : -1) : (vA < vB ? 1 : -1);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-8 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            FPO Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Read-only performance indices and member metrics across FPOs in the cluster</p>
        </div>
        <span className="px-3.5 py-1.5 bg-brand-50 border border-brand-200/70 text-brand-800 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm self-start sm:self-auto">
          🔒 Cluster View Only
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Total Active FPOs', value: totalFpos, icon: Building2, color: 'text-brand-600', bg: 'bg-brand-50 border-brand-100/50' },
          { label: 'Aggregated Farmers', value: totalFarmers.toLocaleString('en-IN'), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50/60 border-emerald-100/50' },
          { label: 'Avg Farmers / FPO', value: avgFarmers, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50/60 border-teal-100/50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5">
            <div className={`${bg.split(' ')[0]} ${bg.split(' ')[1]} border w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-black text-slate-800 mt-0.5 tracking-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top FPOs by Sales Revenue */}
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6 flex flex-col">
          <div className="flex items-start gap-3.5 mb-6">
            <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100/40 text-brand-600"><IndianRupee className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Top FPOs by Sales Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by commercial sales volume across cluster tenants</p>
            </div>
          </div>
          {top10.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-16 text-slate-400 font-medium text-xs border border-dashed border-slate-100 rounded-xl">
              No commercial revenue data returned from API
            </div>
          ) : (
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={fmtINR} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#334155', fontWeight: 700 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-100 shadow-xl rounded-xl p-4 text-xs space-y-1">
                          <p className="font-extrabold text-slate-800 mb-1 border-b border-slate-100 pb-1 truncate max-w-[180px]">{d.name}</p>
                          <p className="text-brand-600 font-bold flex items-center justify-between gap-4">Sales: <span>{fmtINR(d.salesRevenue)}</span></p>
                          <p className="text-amber-500 font-bold flex items-center justify-between gap-4">Procurement: <span>{fmtINR(d.procurementExpense)}</span></p>
                          <p className={`font-black flex items-center justify-between gap-4 border-t border-slate-50 pt-1 ${d.netRevenue >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            Net: <span>{fmtINR(d.netRevenue)}</span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="salesRevenue" radius={[0, 4, 4, 0]} maxBarSize={12}>
                    {top10.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Sales Revenue Share */}
        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-start gap-3.5 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100/40 text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Sales Revenue Share</h3>
              <p className="text-xs text-slate-400 mt-0.5">% share contribution per FPO to aggregated sales</p>
            </div>
          </div>
          {(() => {
            const isLive = donutData.length > 0 && (revenueStats?.totalSalesRevenueAllTenants ?? 0) > 0;
            const shareData = isLive
              ? donutData.map(d => ({ name: d.name, value: +((d.value / revenueStats.totalSalesRevenueAllTenants) * 100).toFixed(1) }))
              : DEMO_SHARE;
            const totalLabel = isLive ? fmtINR(revenueStats.totalSalesRevenueAllTenants) : 'Demo';
            const pieData = shareData.map(d => ({ ...d }));

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Donut Chart */}
                <div className="flex justify-center relative">
                  <div className="relative w-[180px] h-[180px]">
                    <PieChart width={180} height={180}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx={90} cy={90}
                        innerRadius={56} outerRadius={80}
                        paddingAngle={2.5}
                        strokeWidth={2}
                        stroke="#ffffff"
                      >
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white border border-slate-100 shadow-2xl rounded-xl px-3 py-2 text-[11px]">
                              <p className="font-extrabold text-slate-800 max-w-[150px] leading-tight truncate">{d.name}</p>
                              <p className="text-brand-600 font-black mt-0.5 text-xs">{d.value}% Share</p>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                    {/* Center details */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                      <span className="text-base font-extrabold text-slate-800 leading-tight mt-0.5">{totalLabel}</span>
                      {!isLive && (
                        <span className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full mt-1.5 select-none">
                          Preview
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Legend list - Compact scrollable */}
                <div className="overflow-y-auto max-h-[190px] pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
                  {shareData.map((d, i) => (
                    <div key={d.name} className="group cursor-default">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-[11px] text-slate-600 font-semibold truncate leading-tight group-hover:text-slate-800 transition">{d.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-800 ml-2 flex-shrink-0">{d.value}%</span>
                      </div>
                      <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-1 overflow-hidden">
                        <div
                          className="h-1 rounded-full transition-all duration-500"
                          style={{
                            width: `${(d.value / Math.max(...shareData.map(x => x.value))) * 100}%`,
                            backgroundColor: COLORS[i % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

      </div>

           {/* FPOs cluster table card */}
      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">All FPOs in Cluster</h3>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} FPO records matching filters</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or FPO name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-52 bg-white transition-all focus:border-brand-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 text-center w-16">#</th>
                <th className="px-6 py-4">FPO Name</th>
                <th className="px-6 py-4 w-32">Tenant Code</th>
                <th className="px-6 py-4 w-36 cursor-pointer hover:bg-slate-100/40 select-none transition" onClick={() => toggleSort('farmers')}>
                  <div className="flex items-center gap-1.5">Farmers <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 w-40">District</th>
                <th className="px-6 py-4 text-right pr-8 w-36">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">No FPOs match your search filters.</td>
                </tr>
              ) : paginated.map((t, idx) => {
                const isExpanded = selectedFpo?.tenantId === t.tenantId;
                return (
                  <React.Fragment key={t.tenantId}>
                    <tr className={`transition duration-150 ${isExpanded ? 'bg-brand-50/10' : 'hover:bg-slate-50/40'}`}>
                      <td className="px-6 py-4 text-slate-400 font-bold text-center">{(page - 1) * PER_PAGE + idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{t.tenantName}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-mono rounded-md font-bold shadow-inner">
                          {t.tenantCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-700">
                        {(t.totalFarmers ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">{t.district ?? '—'}</td>
                      <td className="px-6 py-4 text-right pr-8">
                        <button
                          onClick={() => handleViewRevenue(t)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-150 ${
                            isExpanded
                              ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 shadow-sm'
                          }`}
                        >
                          {isExpanded ? 'Hide Revenue' : 'View Revenue'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row Card details */}
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={6} className="px-6 py-4">
                          {revenueLoading ? (
                            <div className="flex items-center gap-2.5 text-xs text-brand-600 animate-pulse font-bold p-4 justify-center">
                              <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                              Fetching tenant ledger balances...
                            </div>
                          ) : revenueStats ? (() => {
                            const tenantRev = revenueStats.revenuePerTenant?.find(r => r.tenantId === selectedFpo.tenantId) ?? revenueStats;
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 border border-slate-200/40 rounded-2xl bg-white shadow-sm max-w-4xl mx-auto my-2">
                                {[
                                  { label: 'Sales Revenue', value: fmtINR(tenantRev.salesRevenue ?? 0), color: 'text-emerald-700 border-l-emerald-500', bg: 'bg-white' },
                                  { label: 'Procurement Expense', value: fmtINR(tenantRev.procurementExpense ?? 0), color: 'text-amber-700 border-l-amber-500', bg: 'bg-white' },
                                  { label: 'Net Revenue Surplus', value: fmtINR(tenantRev.netRevenue ?? 0), color: (tenantRev.netRevenue ?? 0) >= 0 ? 'text-brand-800 border-l-brand-500' : 'text-rose-700 border-l-rose-500', bg: 'bg-white' },
                                ].map(({ label, value, color, bg }) => (
                                  <div key={label} className={`${bg} rounded-xl p-3.5 border-l-4 ${color.split(' ')[1]} border border-y-slate-100 border-r-slate-100 shadow-inner flex flex-col justify-center`}>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                                    <p className={`text-base font-black mt-1 ${color.split(' ')[0]}`}>{value}</p>
                                  </div>
                                ))}
                              </div>
                            );
                          })() : (
                            <div className="text-xs text-slate-400 font-semibold p-4 text-center">No tenant records returned from API logs.</div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3.5 py-1.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-600 hover:bg-slate-50 font-bold transition disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3.5 py-1.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-600 hover:bg-slate-50 font-bold transition disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
