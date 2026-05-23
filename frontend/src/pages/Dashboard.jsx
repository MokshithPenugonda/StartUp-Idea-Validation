import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, ThumbsUp, MessageSquare, Users, 
  Plus, LayoutGrid, List, ChevronRight, Activity, Target, Zap, Clock, Rocket
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Main Dashboard Router ───────────────────────────────────────────────────
const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (role) => {
    setFetchLoading(true);
    setError(null);
    try {
      const endpoint = role === 'founder' || role === 'admin'
        ? '/analytics/founder'
        : '/analytics/user';
      const res = await api.get(endpoint);
      setData(res.data.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err?.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to settle
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAnalytics(user.role);
  }, [authLoading, user?.role]); // Only re-fetch if role changes, not on every render

  // ── Spinner while auth resolves or data is loading ─────────────────────────
  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen bg-aurora-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-32 space-y-6">
          <div className="w-14 h-14 border-4 border-aurora-surface border-t-aurora-cyan rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Loading Intelligence...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-aurora-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-32 space-y-6 text-center">
          <div className="text-5xl">⚠️</div>
          <h3 className="text-2xl font-black text-white">Dashboard Error</h3>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={() => fetchAnalytics(user?.role)}
            className="btn-premium shadow-glow-cyan"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Role-based render ──────────────────────────────────────────────────────
  if (user?.role === 'user') {
    return <UserDashboard data={data} navigate={navigate} />;
  }

  return <FounderDashboard data={data} navigate={navigate} onRefresh={() => fetchAnalytics(user?.role)} />;
};

// ─── Founder Dashboard ────────────────────────────────────────────────────────
const FounderDashboard = ({ data, navigate, onRefresh }) => {
  const safeData = Array.isArray(data) ? data : [];

  const totalVotes    = safeData.reduce((acc, curr) => acc + (curr.votes      || 0), 0);
  const totalComments = safeData.reduce((acc, curr) => acc + (curr.comments   || 0), 0);
  const totalWaiting  = safeData.reduce((acc, curr) => acc + (curr.waitingList || 0), 0);

  const COLORS = ['#22d3ee', '#c084fc', '#f43f5e', '#10b981', '#f59e0b'];

  const categoryData = safeData.reduce((acc, curr) => {
    const index = acc.findIndex(item => item.name === curr.category);
    if (index > -1) {
      acc[index].value += 1;
    } else {
      acc.push({ name: curr.category, value: 1 });
    }
    return acc;
  }, []);

  // Bar chart needs named labels — truncate long titles
  const chartData = safeData.map(idea => ({
    ...idea,
    shortTitle: idea.title?.length > 15 ? idea.title.substring(0, 13) + '…' : idea.title,
  }));

  return (
    <div className="min-h-screen pb-32 bg-aurora-dark text-slate-100">
      <Navbar />

      <div className="page-container mt-16 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora-cyan/10 blur-[150px] -translate-y-1/2 pointer-events-none"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 animate-fade-in relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-3 drop-shadow">
              Founder Intelligence
            </h1>
            <p className="text-slate-400 font-medium text-lg">
              Decipher innovation signals and scale your vision with data.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onRefresh}
              className="px-5 py-3 rounded-2xl bg-aurora-surface border border-white/10 text-slate-400 hover:text-aurora-cyan hover:border-aurora-cyan/30 transition-all text-sm font-bold uppercase tracking-widest"
            >
              ↻ Refresh
            </button>
            <Link to="/post-idea" className="btn-premium flex items-center space-x-3 group shadow-glow-cyan">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Initiate New Concept</span>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-slide-up relative z-10">
          <StatCard
            title="Active Concepts"
            value={safeData.length}
            icon={<LayoutGrid className="w-6 h-6" />}
            colorClass="text-aurora-cyan border-aurora-cyan/30 shadow-glow-cyan"
          />
          <StatCard
            title="Market Validation"
            value={totalVotes}
            icon={<ThumbsUp className="w-6 h-6" />}
            colorClass="text-aurora-purple border-aurora-purple/30 shadow-glow-purple"
          />
          <StatCard
            title="Strategic Feedback"
            value={totalComments}
            icon={<MessageSquare className="w-6 h-6" />}
            colorClass="text-[#f43f5e] border-[#f43f5e]/30 shadow-lg shadow-[#f43f5e]/20"
          />
          <StatCard
            title="Interest Pipeline"
            value={totalWaiting}
            icon={<Users className="w-6 h-6" />}
            colorClass="text-[#10b981] border-[#10b981]/30 shadow-lg shadow-[#10b981]/20"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 animate-fade-in delay-100 relative z-10">
          {/* Bar Chart */}
          <div className="lg:col-span-2 glass-card p-12 rounded-[3.5rem] bg-aurora-surface/60 shadow-glow-cyan border-white/5">
            <h3 className="text-2xl font-display font-black text-white mb-10 flex items-center">
              <Activity className="w-6 h-6 mr-4 text-aurora-cyan" />
              Engagement Performance Hub
            </h3>
            {safeData.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-slate-600 font-bold text-lg">No data to chart yet.</p>
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis
                      dataKey="shortTitle"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#1e293b' }}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)',
                        padding: '20px',
                        color: '#fff',
                      }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '13px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', color: '#94a3b8' }} />
                    <Bar dataKey="votes"       fill="#22d3ee" radius={[6,6,0,0]} name="Validation Votes"  barSize={36} />
                    <Bar dataKey="comments"    fill="#f43f5e" radius={[6,6,0,0]} name="Feedback Comments" barSize={36} />
                    <Bar dataKey="waitingList" fill="#c084fc" radius={[6,6,0,0]} name="Market Interest"   barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="glass-card p-12 rounded-[3.5rem] flex flex-col items-center bg-aurora-surface/60 shadow-glow-purple border-white/5">
            <h3 className="text-2xl font-display font-black text-white mb-10 self-start">
              <Target className="w-6 h-6 mr-4 inline text-aurora-purple" />
              Domain Spread
            </h3>
            {categoryData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-600 font-bold">No categories yet.</p>
              </div>
            ) : (
              <>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                  {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-extrabold truncate">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Intelligence Matrix Table */}
        <div className="glass-card rounded-[3.5rem] overflow-hidden animate-fade-in delay-200 bg-aurora-surface/60 border-white/5 relative z-10">
          <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-2xl font-display font-black text-white flex items-center">
              <List className="w-6 h-6 mr-4 text-aurora-cyan" />
              Global Interaction Matrix
            </h3>
            <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">{safeData.length} concept{safeData.length !== 1 ? 's' : ''}</span>
          </div>

          {safeData.length === 0 ? (
            <div className="p-20 text-center">
              <Rocket className="w-16 h-16 mx-auto mb-6 text-slate-700" />
              <h4 className="text-2xl font-bold text-white mb-3">No Concepts Yet</h4>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                You haven't posted any startup ideas yet. Launch your first concept to see live analytics here.
              </p>
              <Link to="/post-idea" className="btn-premium inline-flex items-center space-x-2 shadow-glow-cyan">
                <Plus className="w-5 h-5" />
                <span>Post Your First Idea</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-aurora-dark/50">
                    <th className="px-12 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Project Vector</th>
                    <th className="px-12 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Classification</th>
                    <th className="px-6 py-6 text-center text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Votes</th>
                    <th className="px-6 py-6 text-center text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Feedback</th>
                    <th className="px-6 py-6 text-center text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Waitlist</th>
                    <th className="px-12 py-6 text-right text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {safeData.map((idea) => (
                    <tr
                      key={idea.id}
                      className="hover:bg-aurora-dark/80 transition-all group cursor-pointer"
                      onClick={() => navigate(`/ideas/${idea.id}`)}
                    >
                      <td className="px-12 py-8">
                        <div className="text-white font-black text-lg tracking-tight group-hover:text-aurora-cyan transition-colors">
                          {idea.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 flex items-center">
                          <Clock className="w-3 h-3 mr-2" />
                          Engagement Score: {idea.engagement}
                        </div>
                      </td>
                      <td className="px-12 py-8">
                        <span className="px-4 py-1.5 bg-aurora-dark border border-aurora-cyan/30 text-aurora-cyan text-[10px] font-black rounded-full uppercase tracking-widest shadow-glow-cyan">
                          {idea.category}
                        </span>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="text-aurora-cyan font-black text-2xl">{idea.votes ?? 0}</div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="text-[#f43f5e] font-black text-2xl">{idea.comments ?? 0}</div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="text-aurora-purple font-black text-2xl">{idea.waitingList ?? 0}</div>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-aurora-dark border border-white/5 group-hover:bg-gradient-to-r group-hover:from-aurora-cyan group-hover:to-aurora-purple group-hover:text-white transition-all duration-300">
                          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── User/Community Dashboard ─────────────────────────────────────────────────
const UserDashboard = ({ data, navigate }) => {
  const totals   = data?.totals    || { votesCasted: 0, commentsMade: 0, waitlistsJoined: 0 };
  const portfolio = data?.portfolio || [];

  return (
    <div className="min-h-screen pb-32 bg-aurora-dark text-slate-100">
      <Navbar />

      <div className="page-container mt-16 relative">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-aurora-purple/10 blur-[150px] -translate-y-1/2 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 animate-fade-in relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-3 drop-shadow">
              Impact Portfolio
            </h1>
            <p className="text-slate-400 font-medium text-lg">
              Track the startups and visions you are bringing to life.
            </p>
          </div>
          <Link to="/insights" className="btn-premium-outline flex items-center space-x-3 group shadow-glow-cyan">
            <Activity className="w-5 h-5 transition-colors" />
            <span>Discover More</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 animate-slide-up relative z-10">
          <StatCard
            title="Votes Casted"
            value={totals.votesCasted}
            icon={<ThumbsUp className="w-6 h-6" />}
            colorClass="text-aurora-cyan border-aurora-cyan/30 shadow-glow-cyan"
          />
          <StatCard
            title="Discussions"
            value={totals.commentsMade}
            icon={<MessageSquare className="w-6 h-6" />}
            colorClass="text-aurora-purple border-aurora-purple/30 shadow-glow-purple"
          />
          <StatCard
            title="Waitlists Joined"
            value={totals.waitlistsJoined}
            icon={<Zap className="w-6 h-6" />}
            colorClass="text-[#10b981] border-[#10b981]/30 shadow-lg shadow-[#10b981]/20"
          />
        </div>

        {/* Catalyzed Projects */}
        <h3 className="text-2xl font-display font-black text-white mb-8 animate-fade-in delay-100 drop-shadow">
          Catalyzed Projects
        </h3>

        {portfolio.length === 0 ? (
          <div className="glass-card p-16 text-center rounded-[3rem] animate-fade-in delay-200 border-white/5 bg-aurora-surface/40">
            <Target className="w-16 h-16 mx-auto mb-6 text-slate-600" />
            <h4 className="text-2xl font-bold text-white mb-2">No Impact Yet</h4>
            <p className="text-slate-400 text-lg">
              You haven't supported any startup visions yet. Head to the feed to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in delay-200">
            {portfolio.map((idea) => (
              <div
                key={idea.id}
                onClick={() => navigate(`/ideas/${idea.id}`)}
                className="glass-card glass-card-hover group p-10 rounded-[2.5rem] flex flex-col h-full cursor-pointer relative overflow-hidden bg-aurora-surface/60 border-white/5"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-aurora-cyan/10 rounded-full blur-3xl group-hover:bg-aurora-purple/20 transition-colors"></div>

                <div className="flex items-center space-x-2 mb-8 relative z-10">
                  <div className="p-2 bg-aurora-dark border border-white/5 rounded-lg shadow-glow-cyan">
                    <Activity className="w-4 h-4 text-aurora-cyan" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aurora-cyan">
                    {idea.category}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-aurora-cyan transition-colors tracking-tight leading-tight">
                  {idea.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-10 flex-grow leading-relaxed font-medium">
                  {idea.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center space-x-3 relative z-10 flex-wrap gap-y-2">
                  {idea.userInteractions.map((interaction, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-aurora-dark border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm"
                    >
                      {interaction}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="glass-card p-10 rounded-[3rem] group hover:scale-[1.02] transition-all duration-500 bg-aurora-surface/60 border-white/5">
    <div className={`p-4 rounded-2xl bg-aurora-dark w-fit mb-8 border ${colorClass} transition-all`}>
      {React.cloneElement(icon, { className: 'w-7 h-7 text-current' })}
    </div>
    <div className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4">{title}</div>
    <div className="text-5xl font-display font-black text-white tracking-tight drop-shadow">{value ?? 0}</div>
  </div>
);

export default Dashboard;
