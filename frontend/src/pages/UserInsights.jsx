import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  ThumbsUp, MessageSquare, Zap, ArrowLeft,
  Target, TrendingUp, Star, Activity,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Custom Tooltip for Recharts ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-xl">
        {label && <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} className="font-black text-sm" style={{ color: entry.color || entry.fill }}>
            {entry.name}: <span className="text-white">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const UserInsights = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setFetchLoading(true);
    setError(null);
    try {
      const res = await api.get('/analytics/user');
      setData(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your insights.');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [authLoading, user?.role]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen bg-aurora-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-32 space-y-6">
          <div className="w-14 h-14 border-4 border-aurora-surface border-t-aurora-cyan rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Decoding your impact...</p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-aurora-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-32 space-y-6 text-center">
          <p className="text-5xl">⚠️</p>
          <h3 className="text-2xl font-black text-white">Failed to Load</h3>
          <p className="text-slate-400">{error}</p>
          <button onClick={fetchData} className="btn-premium shadow-glow-cyan">Retry</button>
        </div>
      </div>
    );
  }

  const totals   = data?.totals    || { votesCasted: 0, commentsMade: 0, waitlistsJoined: 0 };
  const portfolio = data?.portfolio || [];
  const totalEngagement = totals.votesCasted + totals.commentsMade + totals.waitlistsJoined;

  // ── Build chart datasets ────────────────────────────────────────────────────
  // Radial bar (activity breakdown)
  const radialData = [
    { name: 'Votes',     value: totals.votesCasted,    fill: '#22d3ee' },
    { name: 'Comments',  value: totals.commentsMade,   fill: '#c084fc' },
    { name: 'Waitlists', value: totals.waitlistsJoined, fill: '#10b981' },
  ];

  // Pie chart (share breakdown)
  const pieData = totalEngagement > 0
    ? radialData.filter(d => d.value > 0)
    : [{ name: 'No Activity', value: 1, fill: '#1e293b' }];

  // Category distribution among interacted ideas
  const categoryMap = {};
  portfolio.forEach(idea => {
    categoryMap[idea.category] = (categoryMap[idea.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Area chart — simulate a cumulative timeline based on portfolio order
  const timelineData = portfolio.map((idea, i) => ({
    name: `#${i + 1}`,
    Ideas: i + 1,
    Actions: idea.userInteractions.length + (i > 0 ? portfolio[i-1].userInteractions.length : 0),
  }));

  // Action tags frequency
  const actionFreq = { voted: 0, commented: 0, waitlisted: 0 };
  portfolio.forEach(idea => {
    idea.userInteractions.forEach(action => {
      if (actionFreq[action] !== undefined) actionFreq[action]++;
    });
  });

  const COLORS = ['#22d3ee', '#c084fc', '#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div className="min-h-screen pb-32 bg-aurora-dark text-slate-100 overflow-x-hidden">
      <Navbar />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-aurora-cyan/5 blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-aurora-purple/5 blur-[160px] pointer-events-none" />

      <div className="page-container mt-16 relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 animate-fade-in">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 text-slate-500 hover:text-aurora-cyan transition-colors text-sm font-bold uppercase tracking-widest mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight drop-shadow mb-3">
              My <span className="text-gradient">Impact</span> Insights
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              A visual breakdown of your contributions to the startup ecosystem.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="self-start px-5 py-3 rounded-2xl bg-aurora-surface border border-white/10 text-slate-400 hover:text-aurora-cyan hover:border-aurora-cyan/30 transition-all text-sm font-bold uppercase tracking-widest mt-12 md:mt-0"
          >
            ↻ Refresh
          </button>
        </div>

        {/* ── Summary Metric Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-slide-up">
          {[
            { label: 'Total Actions',     value: totalEngagement,           icon: <Activity className="w-5 h-5" />,      color: 'text-white border-white/20' },
            { label: 'Votes Casted',      value: totals.votesCasted,        icon: <ThumbsUp className="w-5 h-5" />,      color: 'text-aurora-cyan border-aurora-cyan/30 shadow-glow-cyan' },
            { label: 'Discussions',       value: totals.commentsMade,       icon: <MessageSquare className="w-5 h-5" />, color: 'text-aurora-purple border-aurora-purple/30 shadow-glow-purple' },
            { label: 'Waitlists Joined',  value: totals.waitlistsJoined,    icon: <Zap className="w-5 h-5" />,           color: 'text-[#10b981] border-[#10b981]/30' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`glass-card p-8 rounded-[2.5rem] flex flex-col gap-4 border bg-aurora-surface/60 border-white/5`}>
              <div className={`p-3 rounded-xl bg-aurora-dark w-fit border ${color}`}>
                {React.cloneElement(icon, { className: 'w-5 h-5 text-current' })}
              </div>
              <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{label}</div>
              <div className="text-4xl font-display font-black text-white">{value ?? 0}</div>
            </div>
          ))}
        </div>

        {/* ── Main Chart Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 animate-fade-in delay-100">

          {/* Radial Activity Bar */}
          <div className="glass-card p-12 rounded-[3.5rem] bg-aurora-surface/60 border-white/5 shadow-glow-cyan">
            <h3 className="text-2xl font-display font-black text-white mb-2 flex items-center">
              <TrendingUp className="w-6 h-6 mr-4 text-aurora-cyan" />
              Activity Breakdown
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-10">How your actions are distributed.</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  barSize={20}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={10}
                    background={{ fill: '#1e293b' }}
                    clockWise
                    dataKey="value"
                    cornerRadius={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie — Engagement Share */}
          <div className="glass-card p-12 rounded-[3.5rem] bg-aurora-surface/60 border-white/5 shadow-glow-purple">
            <h3 className="text-2xl font-display font-black text-white mb-2 flex items-center">
              <Star className="w-6 h-6 mr-4 text-aurora-purple" />
              Engagement Share
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-10">Your contribution type as a percentage.</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {radialData.map(({ name, value, fill }) => (
                <div key={name} className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-aurora-dark border border-white/5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fill }} />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black">{name}</span>
                  <span className="text-xl font-display font-black text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Second Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 animate-fade-in delay-200">

          {/* Sector Distribution */}
          <div className="glass-card p-12 rounded-[3.5rem] bg-aurora-surface/60 border-white/5">
            <h3 className="text-2xl font-display font-black text-white mb-2 flex items-center">
              <Target className="w-6 h-6 mr-4 text-[#f59e0b]" />
              Sectors You Back
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-10">Industries you've engaged with the most.</p>
            {categoryData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-slate-600 font-bold">No sector data yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map(({ name, value }, i) => {
                    const pct = Math.round((value / portfolio.length) * 100);
                    return (
                      <div key={name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white uppercase tracking-wider">{name}</span>
                          <span className="text-xs font-black text-slate-500">{value} idea{value !== 1 ? 's' : ''} · {pct}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-aurora-dark rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: COLORS[i % COLORS.length],
                              boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}80`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Cumulative Engagement Timeline */}
          <div className="glass-card p-12 rounded-[3.5rem] bg-aurora-surface/60 border-white/5">
            <h3 className="text-2xl font-display font-black text-white mb-2 flex items-center">
              <Activity className="w-6 h-6 mr-4 text-[#10b981]" />
              Involvement Timeline
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-10">Cumulative ideas you've touched over time.</p>
            {timelineData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-slate-600 font-bold">No timeline data yet.</p>
              </div>
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="gradIdeas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="gradActions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Ideas"   stroke="#22d3ee" fill="url(#gradIdeas)"   strokeWidth={2} name="Ideas Engaged" dot={{ fill: '#22d3ee', r: 4 }} />
                    <Area type="monotone" dataKey="Actions" stroke="#10b981" fill="url(#gradActions)" strokeWidth={2} name="Total Actions"  dot={{ fill: '#10b981', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── Catalyzed Projects Cards ── */}
        {portfolio.length > 0 && (
          <div className="animate-fade-in delay-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display font-black text-white drop-shadow">
                Your Catalyzed Projects
              </h3>
              <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">{portfolio.length} project{portfolio.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((idea, i) => (
                <Link
                  key={idea.id}
                  to={`/ideas/${idea.id}`}
                  className="glass-card glass-card-hover group p-8 rounded-[2.5rem] flex flex-col relative overflow-hidden bg-aurora-surface/60 border-white/5 cursor-pointer"
                >
                  {/* Ambient glow */}
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />

                  {/* Category badge */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border"
                      style={{ color: COLORS[i % COLORS.length], borderColor: `${COLORS[i % COLORS.length]}40`, backgroundColor: `${COLORS[i % COLORS.length]}10` }}
                    >
                      {idea.category}
                    </span>
                    <div className="flex space-x-1">
                      {idea.userInteractions.map((action, idx) => {
                        const icons = { voted: '👍', commented: '💬', waitlisted: '⚡' };
                        return (
                          <span key={idx} className="text-sm" title={action}>{icons[action] || '•'}</span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-display font-black text-white group-hover:text-aurora-cyan transition-colors tracking-tight leading-tight mb-3 relative z-10">
                    {idea.title}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-6 flex-grow font-medium relative z-10">
                    {idea.description}
                  </p>

                  {/* Interaction tags */}
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {idea.userInteractions.map((action, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                        style={{
                          color: { voted: '#22d3ee', commented: '#c084fc', waitlisted: '#10b981' }[action] || '#94a3b8',
                          borderColor: `${{ voted: '#22d3ee', commented: '#c084fc', waitlisted: '#10b981' }[action] || '#94a3b8'}30`,
                          backgroundColor: `${{ voted: '#22d3ee', commented: '#c084fc', waitlisted: '#10b981' }[action] || '#94a3b8'}10`,
                        }}
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {portfolio.length === 0 && (
          <div className="glass-card p-20 text-center rounded-[3rem] border-white/5 bg-aurora-surface/40 animate-fade-in delay-200">
            <Target className="w-16 h-16 mx-auto mb-6 text-slate-700" />
            <h4 className="text-2xl font-bold text-white mb-3">No Activity Yet</h4>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Start voting, commenting, or joining waitlists on the feed to see your impact visualized here.
            </p>
            <Link to="/" className="btn-premium inline-flex items-center space-x-2 shadow-glow-cyan">
              <TrendingUp className="w-5 h-5" />
              <span>Explore the Feed</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInsights;
