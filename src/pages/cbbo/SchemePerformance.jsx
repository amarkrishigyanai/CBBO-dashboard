import { useEffect, useRef, useState } from 'react';
import {
  RefreshCw, Landmark, Users, Building2, Wallet,
  TrendingUp, TrendingDown, CheckCircle2, Clock,
  Wheat, Shield, BarChart2, Sprout, CreditCard,
  FlaskConical, ChevronRight, Zap, Globe, ArrowUpRight,
  Search, Filter, Activity, X, Sparkles, Check, Database, MapPin, Layers, FileText, Info
} from 'lucide-react';

/* ─── static scheme data ─── */
const SCHEMES = [
  {
    id: 'pmkisan',
    image: '/pm_kisan_banner.png',
    icon: Wheat,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    desc: 'Direct income support of ₹6,000/year to eligible farmer families in 3 installments.',
    stats: [
      { label: 'Farmers Enrolled', value: '11.8 Cr', icon: Users },
      { label: 'Amount Disbursed', value: '₹2.81L Cr', icon: Wallet },
      { label: 'Success Rate', value: '94.2%', icon: CheckCircle2 },
    ],
    badge: 'Central Scheme',
    trend: '+8.4%',
    trendUp: true,
    category: 'Direct Support',
    coverage: 'All 28 States & 8 UTs',
    funding: '100% Central Government funded',
    primaryBenefit: 'Direct Benefit Transfer (₹6,000 / year in three equal instalments)',
  },
  {
    id: 'pmfby',
    image: '/pmfby_banner.png',
    icon: Shield,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    name: 'PMFBY',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    desc: 'Comprehensive crop insurance covering sowing, standing crop, post-harvest losses.',
    stats: [
      { label: 'Claims Settled', value: '1.24 Cr', icon: CheckCircle2 },
      { label: 'Coverage', value: '5.5 Cr ha', icon: Globe },
      { label: 'Claim Ratio', value: '87.6%', icon: BarChart2 },
    ],
    badge: 'Insurance',
    trend: '+5.1%',
    trendUp: true,
    category: 'Crop Insurance',
    coverage: 'Multi-state insurance network',
    funding: 'Shared: 50% Center, 50% State',
    primaryBenefit: 'Financial support against crop loss due to natural calamities',
  },
  {
    id: 'enam',
    image: '/enam_banner.png',
    icon: BarChart2,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    name: 'eNAM',
    fullName: 'Electronic National Agriculture Market',
    desc: 'Online trading platform connecting farmers, traders, and buyers across mandis.',
    stats: [
      { label: 'Trading Volume', value: '₹8.74L Cr', icon: TrendingUp },
      { label: 'Mandis Linked', value: '1,361', icon: Building2 },
      { label: 'Participation', value: '1.75 Cr', icon: Users },
    ],
    badge: 'Digital Market',
    trend: '+12.3%',
    trendUp: true,
    category: 'Digital Mandis',
    coverage: '1,361 wholesale mandis across India',
    funding: 'Central sector scheme under DAC&FW',
    primaryBenefit: 'Unified national market for electronic agri-commodity trading',
  },
  {
    id: 'aif',
    image: '/aif_banner.png',
    icon: Sprout,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    name: 'Agri Infra Fund',
    fullName: 'Agriculture Infrastructure Fund',
    desc: '₹1 lakh crore financing facility for post-harvest management & community farm assets.',
    stats: [
      { label: 'Projects Funded', value: '74,246', icon: Building2 },
      { label: 'Investment', value: '₹45,180 Cr', icon: Wallet },
      { label: 'FPOs Benefited', value: '4,820', icon: Zap },
    ],
    badge: 'Infrastructure',
    trend: '+18.7%',
    trendUp: true,
    category: 'Agri-Infra',
    coverage: 'All rural and semi-urban hubs',
    funding: 'Interest subvention (3%) & Credit Guarantee support',
    primaryBenefit: 'Long-term debt financing for agricultural assets construction',
  },
  {
    id: 'kcc',
    image: '/kcc_banner.png',
    icon: CreditCard,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    name: 'KCC',
    fullName: 'Kisan Credit Card',
    desc: 'Flexible revolving credit for short-term crop, post-harvest, and allied activity needs.',
    stats: [
      { label: 'Cards Issued', value: '7.4 Cr', icon: CreditCard },
      { label: 'Credit Limit', value: '₹8.85L Cr', icon: Wallet },
      { label: 'Avg. Limit/Card', value: '₹1.19L', icon: TrendingUp },
    ],
    badge: 'Credit',
    trend: '-2.1%',
    trendUp: false,
    category: 'Credit/Finance',
    coverage: 'Commercial, Cooperative & Regional Rural banks',
    funding: 'Subsidized loan system via RBI and NABARD',
    primaryBenefit: 'Hassle-free revolving cash credit for cultivation expenses',
  },
  {
    id: 'shc',
    image: '/shc_banner.png',
    icon: FlaskConical,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    name: 'Soil Health Card',
    fullName: 'Soil Health Card Scheme',
    desc: 'Bi-annual soil testing and personalized fertilizer recommendations for every farm.',
    stats: [
      { label: 'Cards Issued', value: '23.1 Cr', icon: FlaskConical },
      { label: 'Samples Tested', value: '2.53 Cr', icon: CheckCircle2 },
      { label: 'Farms Covered', value: '14 Cr', icon: Wheat },
    ],
    badge: 'Advisory',
    trend: '+3.2%',
    trendUp: true,
    category: 'Soil Advisory',
    coverage: 'Soil testing laboratories national network',
    funding: '100% Center funded to State agriculture depts',
    primaryBenefit: 'Personalized fertilizer dosage recommendations to improve yield',
  },
];

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50/70', text: 'text-emerald-700', border: 'border-emerald-200/60', ring: 'ring-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100/80 text-emerald-800' },
  blue:    { bg: 'bg-blue-50/70',    text: 'text-blue-700',    border: 'border-blue-200/60',    ring: 'ring-blue-200',    icon: 'text-blue-600',    badge: 'bg-blue-100/80 text-blue-800' },
  violet:  { bg: 'bg-violet-50/70',  text: 'text-violet-700',  border: 'border-violet-200/60',  ring: 'ring-violet-200',  icon: 'text-violet-600',  badge: 'bg-violet-100/80 text-violet-800' },
  amber:   { bg: 'bg-amber-50/70',   text: 'text-amber-700',   border: 'border-amber-200/60',   ring: 'ring-amber-200',   icon: 'text-amber-600',   badge: 'bg-amber-100/80 text-amber-800' },
  rose:    { bg: 'bg-rose-50/70',    text: 'text-rose-700',    border: 'border-rose-200/60',    ring: 'ring-rose-200',    icon: 'text-rose-600',    badge: 'bg-rose-100/80 text-rose-800' },
  teal:    { bg: 'bg-teal-50/70',    text: 'text-teal-700',    border: 'border-teal-200/60',    ring: 'ring-teal-200',    icon: 'text-teal-600',    badge: 'bg-teal-100/80 text-teal-800' },
};

const SEGMENT_DETAILS = {
  'PM-KISAN': { value: '₹2.81L Cr', rate: '94.2%', beneficiaries: '11.8 Cr Farmers', desc: 'Direct support to farmer bank accounts' },
  'PMFBY': { value: '1.24 Cr Claims', rate: '87.6%', beneficiaries: '5.5 Cr ha Insured', desc: 'Comprehensive crop loss protection' },
  'eNAM': { value: '₹8.74L Cr Trade', rate: '81.4%', beneficiaries: '1.75 Cr registered', desc: 'Unified online agricultural trading' },
  'AIF': { value: '₹45,180 Cr funded', rate: '74.0%', beneficiaries: '74,246 Projects', desc: 'Post-harvest infrastructure capital' },
  'KCC': { value: '₹8.85L Cr Limit', rate: '68.3%', beneficiaries: '7.4 Cr Cards issued', desc: 'Revolving low-interest short term credit' },
  'SHC': { value: '23.1 Cr Issued', rate: '61.2%', beneficiaries: '14 Cr Farms tested', desc: 'Bi-annual soil testing & recommendations' },
};

const ZONE_DATA = {
  North: { name: 'North Zone', beneficiaries: '4.8 Cr', success: '94.6%', FPOs: '2,640', desc: 'High wheat and rice scheme penetration (PM-KISAN led)' },
  West: { name: 'West Zone', beneficiaries: '3.1 Cr', success: '89.2%', FPOs: '1,980', desc: 'Heavy crop insurance uptake across arid zones (PMFBY led)' },
  South: { name: 'South Zone', beneficiaries: '3.9 Cr', success: '91.8%', FPOs: '2,120', desc: 'High KCC card density and agricultural bank integration' },
  East: { name: 'East Zone', beneficiaries: '1.9 Cr', success: '86.4%', FPOs: '1,210', desc: 'Developing mandi linkings and infrastructure credit expansion' },
  Central: { name: 'Central Zone', beneficiaries: '3.3 Cr', success: '92.1%', FPOs: '1,890', desc: 'Diverse grain corridors with steady digital market trading volume' },
  Northeast: { name: 'Northeast Zone', beneficiaries: '0.8 Cr', success: '82.7%', FPOs: '620', desc: 'Advisory and soil testing schemes focus for organic farms' },
};

/* animated sync icon */
function SyncIcon({ size = 48 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
      <div className="relative bg-white rounded-full p-3 shadow-md ring-1 ring-emerald-100">
        <RefreshCw className="text-emerald-600 animate-spin" style={{ width: size * 0.42, height: size * 0.42, animationDuration: '2.5s' }} />
      </div>
    </div>
  );
}

/* donut SVG with hover logic */
function DonutChart({ hoveredSegment, setHoveredSegment }) {
  const segments = [
    { label: 'PM-KISAN', pct: 32, color: '#10b981' },
    { label: 'PMFBY',    pct: 20, color: '#3b82f6' },
    { label: 'eNAM',     pct: 18, color: '#8b5cf6' },
    { label: 'AIF',      pct: 14, color: '#f59e0b' },
    { label: 'KCC',      pct: 10, color: '#f43f5e' },
    { label: 'SHC',      pct:  6, color: '#14b8a6' },
  ];
  const r = 60, cx = 80, cy = 80, stroke = 20;
  let offset = 0;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[180px] h-[180px] flex items-center justify-center">
        <svg width={180} height={180} viewBox="0 0 160 160" className="transform -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f8fafc" strokeWidth={stroke} />
          {segments.map((s) => {
            const dash = (s.pct / 100) * circ;
            const gap  = circ - dash;
            const isHovered = hoveredSegment === s.label;
            const el = (
              <circle
                key={s.label}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={isHovered ? stroke + 3 : stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset * circ / 100}
                className="cursor-pointer transition-all duration-300 origin-center hover:opacity-90"
                onMouseEnter={() => setHoveredSegment(s.label)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  transition: 'stroke-width 0.25s ease, stroke-dasharray 0.6s ease'
                }}
              />
            );
            offset += s.pct;
            return el;
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {hoveredSegment ? (
            <>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight">{hoveredSegment}</span>
              <span className="text-base font-extrabold text-slate-800 leading-tight my-0.5">
                {SEGMENT_DETAILS[hoveredSegment].value}
              </span>
              <span className="text-[9px] text-slate-500 font-medium truncate max-w-[120px]">
                {SEGMENT_DETAILS[hoveredSegment].beneficiaries}
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">6</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Schemes</span>
              <span className="text-[8px] text-slate-500 font-medium">National Scope</span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Legend Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 w-full">
        {segments.map((s) => {
          const isHovered = hoveredSegment === s.label;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer border ${
                isHovered ? 'bg-slate-50 border-slate-200/80 shadow-sm scale-[1.02]' : 'border-transparent hover:bg-slate-50/50'
              }`}
              onMouseEnter={() => setHoveredSegment(s.label)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className={`text-[11px] font-semibold transition ${isHovered ? 'text-slate-800' : 'text-slate-600'}`}>{s.label}</span>
              <span className="ml-auto text-[10px] text-slate-400 font-bold">{s.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* sparkline with shaded area gradient */
function Sparkline({ id, up = true }) {
  const vals = up
    ? [30, 38, 34, 45, 42, 55, 52, 65, 61, 74]
    : [74, 65, 68, 58, 60, 50, 53, 43, 46, 36];
  const min = Math.min(...vals), max = Math.max(...vals);
  const norm = (v) => 28 - ((v - min) / (max - min)) * 24;
  const pts = vals.map((v, i) => `${i * 9},${norm(v)}`).join(' ');
  const areaD = `M 0,${norm(vals[0])} ` + vals.slice(1).map((v, i) => `L ${i * 9},${norm(v)}`).join(' ') + ` L ${(vals.length - 1) * 9},32 L 0,32 Z`;
  const safeId = id.replace(/[^a-zA-Z0-9]/g, '-');
  const gradId = `spark-grad-${safeId}-${up ? 'up' : 'down'}`;

  return (
    <svg width={82} height={32} viewBox="0 0 82 32" fill="none" className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={up ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <polyline points={pts} stroke={up ? '#10b981' : '#f43f5e'} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ─── main component ─── */
export default function SchemePerformance() {
  const API_READY = false; // flip to true once APIs are integrated

  // States for interactive simulations
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('12 mins ago');
  const [toast, setToast] = useState(null);



  // States for Tabs
  const [activeTab, setActiveTab] = useState('ranking'); // 'ranking' | 'map'
  const [hoveredZone, setHoveredZone] = useState('Central');

  // States for Donut Hover details
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // States for filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // States for Scheme Comparison
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const KPI_CARDS = [
    { label: 'Total Active Schemes', value: '24', sub: '+3 this quarter', icon: Landmark, color: 'emerald', trendUp: true },
    { label: 'Beneficiary Farmers',  value: '14.2 Cr', sub: '+8.4% YoY',   icon: Users,    color: 'blue',    trendUp: true },
    { label: 'Participating FPOs',   value: '8,640',   sub: '+420 joined',  icon: Building2, color: 'violet', trendUp: true },
    { label: 'Benefits Distributed', value: '₹4.2L Cr', sub: 'FY 2024–25', icon: Wallet,   color: 'amber',   trendUp: true },
  ];

  const RANKING = [
    { name: 'PM-KISAN',     pct: 94, beneficiaries: '11.8 Cr', rate: '94.2%', color: '#10b981', trendUp: true },
    { name: 'PMFBY',        pct: 87, beneficiaries: '5.5 Cr',  rate: '87.6%', color: '#3b82f6', trendUp: true },
    { name: 'eNAM',         pct: 81, beneficiaries: '1.75 Cr', rate: '81.4%', color: '#8b5cf6', trendUp: true },
    { name: 'Agri Infra',   pct: 74, beneficiaries: '74,246',  rate: '74.0%', color: '#f59e0b', trendUp: true },
    { name: 'KCC',          pct: 68, beneficiaries: '7.4 Cr',  rate: '68.3%', color: '#f43f5e', trendUp: false },
    { name: 'Soil Health',  pct: 61, beneficiaries: '14 Cr',   rate: '61.2%', color: '#14b8a6', trendUp: true },
  ];

  const categories = [
    'All', 'Direct Support', 'Crop Insurance', 'Digital Mandis', 'Agri-Infra', 'Credit/Finance', 'Soil Advisory'
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Sync Registry Simulation Handler
  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setToast({ type: 'info', message: 'Re-polling scheme registry catalogs from central portals...' });
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
      setToast({ type: 'success', message: 'Registry synchronized. 24 active schemes updated successfully.' });
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };



  // Filter & Search Logic
  const filteredSchemes = SCHEMES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Comparison toggle helper
  const handleSelectCompare = (schemeId) => {
    setSelectedSchemes(prev => {
      if (prev.includes(schemeId)) {
        return prev.filter(id => id !== schemeId);
      }
      if (prev.length >= 3) {
        setToast({ type: 'error', message: 'You can compare a maximum of 3 schemes.' });
        setTimeout(() => setToast(null), 2500);
        return prev;
      }
      return [...prev, schemeId];
    });
  };

  return (
    <div className="space-y-8 font-sans pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Toast Notifications ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white shadow-2xl animate-in slide-in-from-top duration-300 max-w-sm">
          {toast.type === 'success' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
          {toast.type === 'info' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />}
          {toast.type === 'error' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />}
          <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-600/90 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 flex-shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Scheme Intelligence
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Government scheme performance, eligibility mapping, and beneficiary analytics</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`px-4 py-2 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-2 ${
              isSyncing ? 'cursor-not-allowed opacity-75' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Registry
          </button>
          <span className="px-3.5 py-2 bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> Integration Pending
          </span>
          <span className="px-3.5 py-2 bg-slate-100/80 text-slate-700 text-xs font-bold rounded-xl shadow-inner border border-slate-200/40">
            FY 2024–25
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(({ label, value, sub, icon: Icon, color, trendUp }) => {
          const c = COLOR_MAP[color];
          return (
            <div
              key={label}
              className="group relative bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* hover highlight border */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${color === 'emerald' ? 'from-emerald-400 to-teal-400' : color === 'blue' ? 'from-blue-400 to-indigo-400' : color === 'violet' ? 'from-purple-400 to-violet-400' : 'from-amber-400 to-orange-400'} scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className={`w-5.5 h-5.5 ${c.icon}`} />
                </div>
                {trendUp ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-extrabold bg-emerald-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    {sub.split(' ')[0]}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-rose-600 font-extrabold bg-rose-50 px-2 py-1 rounded-lg">
                    <TrendingDown className="w-3 h-3" />
                    {sub.split(' ')[0]}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Activity className="w-3.5 h-3.5 text-slate-300" />
                <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DevOps Integration Control Center (API state banner) ── */}
      {!API_READY && (
        <div className="relative overflow-hidden bg-brand-50/70 rounded-[28px] border border-brand-200/80 shadow-md text-slate-800">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-300 rounded-full opacity-[0.12] blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full opacity-[0.12] blur-3xl animate-pulse" />
          </div>

          <div className="relative p-8 lg:p-10 flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* diagnostic visual column */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4 text-center lg:w-1/4">
              <SyncIcon size={80} />
              <div className="w-full space-y-2 max-w-[200px]">
                <div className="flex justify-between text-xs text-slate-500 font-bold">
                  <span>API INTEGRATION</span>
                  <span className="text-brand-600 font-black">62%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-brand-200/40">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-[10px] font-black tracking-widest uppercase shadow-sm">
                Dev Pipeline Active
              </span>
            </div>

            {/* center explanation column */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 border border-brand-200/60 text-brand-800 text-xs font-semibold">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                <span>Central Government Registries Integration</span>
              </div>
              <h2 className="text-2xl font-black text-brand-900 tracking-tight leading-tight">
                Government Scheme API Feeds
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                We are connecting this dashboard to official central government databases (like PM-KISAN, PMFBY, and eNAM). Once connection is complete, you will see real-time statistics, active registrations, and fund disbursement updates here. For now, you can explore the simulated data below.
              </p>

              {/* Status lights grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 pt-2">
                {[
                  { label: 'PM-KISAN', status: 'online', details: 'v3.1 Connected' },
                  { label: 'PMFBY Hub', status: 'online', details: 'v1.4 Syncing' },
                  { label: 'eNAM Node', status: 'pending', details: 'SSL Challenge' },
                  { label: 'AIF Portal', status: 'offline', details: 'Q3 Scheduled' },
                  { label: 'KCC Feed',  status: 'maintenance', details: '08 Jun Est' },
                ].map(({ label, status, details }) => {
                  const statusColors = {
                    online: 'bg-emerald-500 ring-emerald-500/20 text-emerald-700 border-emerald-500/20',
                    pending: 'bg-amber-500 ring-amber-500/20 text-amber-600 border-amber-500/20',
                    offline: 'bg-slate-400 ring-slate-400/20 text-slate-500 border-slate-700/20',
                    maintenance: 'bg-rose-500 ring-rose-500/20 text-rose-700 border-rose-500/20',
                  };
                  return (
                    <div key={label} className="bg-white border border-brand-200/60 rounded-2xl p-2.5 flex items-center gap-2 shadow-sm">
                      <span className={`w-2 h-2 rounded-full ring-4 ${status === 'online' || status === 'pending' || status === 'maintenance' ? 'animate-pulse' : ''} ${statusColors[status].split(' ')[0]} ${statusColors[status].split(' ')[1]}`} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{label}</p>
                        <p className="text-[9px] text-slate-500 font-semibold truncate">{details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Main Layout (Charts & Analytics) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabbed Performance Panel */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Scheme Analytics Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time enrollment rates and geographic reach index</p>
            </div>
            
            {/* Tab Switched Header buttons */}
            <div className="bg-slate-100 p-1 rounded-xl inline-flex gap-1 border border-slate-200/50">
              <button
                onClick={() => setActiveTab('ranking')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ranking' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Performance Ranking
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'map' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Coverage Map (Simulation)
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center">
            {activeTab === 'ranking' ? (
              <div className="space-y-5">
                {RANKING.map((s, i) => (
                  <div key={s.name} className="group/item hover:bg-slate-50/60 p-2 -mx-2 rounded-xl transition duration-150">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0 group-hover/item:bg-emerald-600 group-hover/item:text-white transition duration-200">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-800">{s.name}</span>
                      <div className="flex items-center gap-3">
                        <Sparkline id={s.name} up={s.trendUp} />
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                          s.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {s.rate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: mounted ? `${s.pct}%` : '0%',
                            background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)`
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-24 text-right font-semibold">{s.beneficiaries}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Coverage Map (Simulation) View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Simulated interactive India Map vector representation */}
                <div className="relative">
                  <svg viewBox="0 0 400 400" className="w-full max-w-[280px] h-auto mx-auto drop-shadow-xl filter saturate-[0.85]">
                    {/* Background decoration grid */}
                    <circle cx="200" cy="200" r="180" fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 6" />
                    
                    {/* Zone polygons */}
                    {/* North Zone */}
                    <polygon
                      points="120,60 280,60 300,140 100,140"
                      fill={hoveredZone === 'North' ? 'url(#north-glow)' : '#e2e8f0'}
                      stroke={hoveredZone === 'North' ? '#10b981' : '#cbd5e1'}
                      strokeWidth={hoveredZone === 'North' ? '2.5' : '1.5'}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                      onMouseEnter={() => setHoveredZone('North')}
                    />
                    
                    {/* West Zone */}
                    <polygon
                      points="40,140 170,140 150,230 60,230"
                      fill={hoveredZone === 'West' ? 'url(#west-glow)' : '#f1f5f9'}
                      stroke={hoveredZone === 'West' ? '#3b82f6' : '#cbd5e1'}
                      strokeWidth={hoveredZone === 'West' ? '2.5' : '1.5'}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                      onMouseEnter={() => setHoveredZone('West')}
                    />

                    {/* Central Zone */}
                    <polygon
                      points="170,140 300,140 280,230 150,230"
                      fill={hoveredZone === 'Central' ? 'url(#central-glow)' : '#f1f5f9'}
                      stroke={hoveredZone === 'Central' ? '#14b8a6' : '#cbd5e1'}
                      strokeWidth={hoveredZone === 'Central' ? '2.5' : '1.5'}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                      onMouseEnter={() => setHoveredZone('Central')}
                    />

                    {/* East Zone */}
                    <polygon
                      points="300,140 380,140 350,230 280,230"
                      fill={hoveredZone === 'East' ? 'url(#east-glow)' : '#f8fafc'}
                      stroke={hoveredZone === 'East' ? '#f59e0b' : '#cbd5e1'}
                      strokeWidth={hoveredZone === 'East' ? '2.5' : '1.5'}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                      onMouseEnter={() => setHoveredZone('East')}
                    />

                    {/* South Zone */}
                    <polygon
                      points="150,230 280,230 215,360"
                      fill={hoveredZone === 'South' ? 'url(#south-glow)' : '#e2e8f0'}
                      stroke={hoveredZone === 'South' ? '#8b5cf6' : '#cbd5e1'}
                      strokeWidth={hoveredZone === 'South' ? '2.5' : '1.5'}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                      onMouseEnter={() => setHoveredZone('South')}
                    />

                    {/* Northeast Zone */}
                    <polygon
                      points="320,80 390,80 380,130 310,130"
                      fill={hoveredZone === 'Northeast' ? 'url(#northeast-glow)' : '#f1f5f9'}
                      stroke={hoveredZone === 'Northeast' ? '#f43f5e' : '#cbd5e1'}
                      strokeWidth={hoveredZone === 'Northeast' ? '2.5' : '1.5'}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                      onMouseEnter={() => setHoveredZone('Northeast')}
                    />

                    {/* Zone Pulses */}
                    <circle cx="200" cy="100" r="4" className="fill-emerald-500 animate-ping" />
                    <circle cx="100" cy="190" r="4" className="fill-blue-500 animate-ping" />
                    <circle cx="215" cy="185" r="4" className="fill-teal-500 animate-ping" />
                    <circle cx="330" cy="180" r="4" className="fill-amber-500 animate-ping" />
                    <circle cx="215" cy="280" r="4" className="fill-purple-500 animate-ping" />
                    <circle cx="350" cy="105" r="4" className="fill-rose-500 animate-ping" />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="north-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="west-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="central-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="east-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="south-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="northeast-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" /> Hover zones to query database
                  </div>
                </div>

                {/* Zone detail display panel */}
                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h4 className="text-sm font-black text-slate-800">{ZONE_DATA[hoveredZone].name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">{ZONE_DATA[hoveredZone].desc}</p>
                  
                  <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Beneficiary</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{ZONE_DATA[hoveredZone].beneficiaries}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Success %</p>
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">{ZONE_DATA[hoveredZone].success}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">FPOs Link</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{ZONE_DATA[hoveredZone].FPOs}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Scheme Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Aggregated beneficiary volume share</p>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            <DonutChart hoveredSegment={hoveredSegment} setHoveredSegment={setHoveredSegment} />
          </div>
        </div>
      </div>

      {/* ── Scheme Cards & Registry Profiles ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Scheme Profiles</h3>
            <p className="text-xs text-slate-500 mt-0.5">Authorized registry catalogs and key parameters</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full sm:w-56 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl font-bold flex items-center gap-1 flex-shrink-0">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Central Repositories
            </span>
          </div>
        </div>

        {/* Category filtering horizontal pill list */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid display */}
        {filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No schemes match your filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching with different keywords.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSchemes.map((s) => {
              const Icon = s.icon;
              const isChecked = selectedSchemes.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 relative ${
                    isChecked ? 'ring-2 ring-brand-500 border-brand-200' : 'border-slate-100/80 shadow-sm'
                  }`}
                >
                  {/* card banner image */}
                  <div className="w-full overflow-hidden relative bg-slate-50 border-b border-slate-100/60 select-none">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Floating pill badges on image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/40 text-[9px] font-extrabold text-slate-700 shadow-sm uppercase tracking-wider">
                        {s.category}
                      </span>
                      <div className="flex gap-1.5 pointer-events-auto">
                        <button
                          onClick={() => handleSelectCompare(s.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isChecked 
                              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                              : 'bg-white/90 backdrop-blur-sm text-slate-600 border-slate-200/40 hover:bg-white shadow-sm'
                          }`}
                          title="Add to Comparison"
                        >
                          <Layers className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* body */}
                  <div className="p-4 flex-1 flex flex-col gap-3 bg-white">
                    {/* Title & Info */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100/50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-brand-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-slate-800 truncate tracking-tight">{s.name}</h4>
                        </div>
                        <span className={`ml-auto flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          s.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {s.trendUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          {s.trend}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{s.fullName}</p>
                    </div>

                    <div className="h-[1px] bg-slate-100/80 w-full" />

                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium min-h-[36px]">{s.desc}</p>

                    {/* Stats Grid using Dashboard Brand Green Palette */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {s.stats.map(({ label, value }) => (
                        <div key={label} className="bg-brand-50/40 rounded-2xl p-2 border border-brand-100/30 text-center transition hover:bg-white hover:shadow-sm">
                          <p className="text-[11px] font-black text-brand-800 mb-0.5">{value}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">{label.split(' ')[0]}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled
                      className="mt-auto w-full flex items-center justify-center gap-1.5 text-[10px] font-bold py-2 rounded-xl border border-brand-200/50 bg-brand-50/30 text-brand-700/60 cursor-not-allowed transition hover:opacity-80"
                      title="Available after API integration"
                    >
                      View Real-time Feeds <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Floating Comparison Toolbar ── */}
      {selectedSchemes.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white backdrop-blur-lg px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50 border border-slate-800 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold">
              {selectedSchemes.length} Scheme{selectedSchemes.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowCompareModal(true)}
              disabled={selectedSchemes.length < 2}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 shadow ${
                selectedSchemes.length < 2
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Compare Now
            </button>
            <button
              onClick={() => setSelectedSchemes([])}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-2"
            >
              Reset Selection
            </button>
          </div>
        </div>
      )}

      {/* ── Comparison Modal ── */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Scheme Comparison Matrix</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="p-6 overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 pr-6 text-xs font-black text-slate-400 uppercase tracking-wider w-1/4">Parameter</th>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return (
                        <th key={id} className="py-4 px-4 text-xs font-black text-slate-800 tracking-tight w-1/3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.gradient}`} />
                            {s.name}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Full Name</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 font-semibold text-slate-800">{s.fullName}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Category</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return (
                        <td key={id} className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200/40">
                            {s.category}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Volume Metric</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 font-bold text-slate-800">{s.stats[0].value} ({s.stats[0].label})</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Financial Outlay</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 font-bold text-emerald-600">{s.stats[1].value} ({s.stats[1].label})</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Success Rate</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 font-extrabold text-blue-600">{s.successRate || s.stats[2].value}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Core Benefit</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 text-slate-500 leading-relaxed font-medium">{s.primaryBenefit}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Coverage Area</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 text-slate-500 leading-relaxed font-medium">{s.coverage}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-slate-400 uppercase tracking-wide">Funding Model</td>
                    {selectedSchemes.map(id => {
                      const s = SCHEMES.find(x => x.id === id);
                      return <td key={id} className="py-4 px-4 text-slate-500 leading-relaxed font-medium">{s.funding}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50 gap-2">
              <button
                onClick={() => { setSelectedSchemes([]); setShowCompareModal(false); }}
                className="px-4 py-2 bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Clear Selection
              </button>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics Preview Widgets ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Analytics Widgets</h3>
            <p className="text-xs text-slate-500 mt-0.5">Simulated forecasting modules and cluster data visualization models</p>
          </div>
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pipeline Disabled
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              title: 'Scheme Adoption Trend',
              icon: TrendingUp,
              desc: 'Monthly enrollment growth rates across target groups',
              color: 'text-emerald-500',
              bg: 'bg-emerald-50/50',
              visual: (
                <div className="w-full flex items-end gap-1 h-10 px-4">
                  {[20, 40, 35, 60, 50, 75, 90, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500 transition-colors duration-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              )
            },
            {
              title: 'District-wise Coverage',
              icon: Globe,
              desc: 'Geographic heatmap concentration of beneficiaries',
              color: 'text-blue-500',
              bg: 'bg-blue-50/50',
              visual: (
                <div className="w-full flex items-center justify-center gap-2 h-10">
                  <div className="w-5 h-5 rounded-full border border-blue-500/30 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="w-7 h-0.5 bg-dashed border-b border-blue-200/50" />
                  <div className="w-5 h-5 rounded-full border border-blue-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                </div>
              )
            },
            {
              title: 'FPO Participation Index',
              icon: Building2,
              desc: 'Cluster-level FPO enrollment shares and activity ratios',
              color: 'text-purple-500',
              bg: 'bg-purple-50/50',
              visual: (
                <div className="w-full flex flex-col gap-1.5 h-10 px-4 justify-center">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500/50 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              )
            },
            {
              title: 'Farmer Enrollment Growth',
              icon: Users,
              desc: 'Quarterly incremental growth mapping patterns',
              color: 'text-amber-500',
              bg: 'bg-amber-50/50',
              visual: (
                <div className="w-full flex items-end gap-1.5 h-10 px-4 justify-center">
                  <div className="text-xs font-bold text-slate-300 group-hover:text-amber-600 transition-colors duration-300">Q1 +12%</div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  <div className="text-xs font-extrabold text-slate-400 group-hover:text-amber-600 transition-colors duration-300">Q2 +18%</div>
                </div>
              )
            },
          ].map(({ title, icon: Icon, desc, color, bg, visual }) => (
            <div
              key={title}
              className="group bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[220px] justify-between"
            >
              <div className={`w-12 h-12 ${bg} border border-slate-200/30 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-extrabold text-slate-800 leading-tight">{title}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold px-2">{desc}</p>
              </div>

              {visual}

              <div className="w-full">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" style={{ width: '62%' }} />
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2">Awaiting Central API Release</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
