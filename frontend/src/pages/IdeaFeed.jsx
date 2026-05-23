import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Filter, TrendingUp, 
  ThumbsUp, MessageSquare, ChevronRight, User, Rocket,
  Sparkles, Globe, Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IdeaFeed = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await api.get(`/ideas?search=${searchTerm}&category=${category}`);
        setIdeas(res.data.data);
      } catch (err) {
        console.error('Error fetching ideas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, [searchTerm, category]);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden bg-aurora-dark text-slate-100">
      <Navbar />

      {/* Hero Section with Mesh Gradient */}
      <div className="relative pt-24 pb-32 border-b border-white/10 bg-aurora-dark">
        <div className="mesh-gradient opacity-10"></div>
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-aurora-surface border border-aurora-purple/50 text-aurora-purple text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-glow-purple">
             <Sparkles className="w-4 h-4" />
             <span>The Frontier of Innovation</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tight animate-slide-up drop-shadow-lg">
            Validate <span className="text-gradient">Ideas.</span><br />
            Build <span className="text-aurora-cyan">Futures.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 animate-slide-up delay-100 font-medium leading-relaxed">
            StartupScope is where world-class visionaries test their concepts with high-signal community indicators.
          </p>

          {/* Premium Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto animate-slide-up delay-200">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-cyan transition-colors" />
              <input 
                type="text" 
                placeholder="Search innovative concepts..." 
                className="premium-input pl-14 text-lg shadow-glow-cyan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-56 group">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-aurora-cyan transition-colors" />
              <select 
                className="premium-input pl-12 appearance-none cursor-pointer bg-aurora-dark text-slate-100 shadow-glow-cyan"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Domains</option>
                <option value="SaaS">SaaS</option>
                <option value="AI">AI</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthtech">Healthtech</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="page-container mt-20 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-display font-black text-white flex items-center tracking-tight drop-shadow">
              <TrendingUp className="w-8 h-8 mr-4 text-aurora-cyan" />
              Pulse of Progress
            </h2>
            <p className="text-slate-400 font-medium mt-1">Discover what the community is backing today.</p>
          </div>
          {user?.role === 'founder' && (
             <Link to="/post-idea" className="btn-premium flex items-center space-x-3 shadow-glow-cyan">
                <Plus className="w-5 h-5" />
                <span>Publish Vision</span>
             </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-32">
            <div className="w-12 h-12 border-4 border-aurora-surface border-t-aurora-cyan rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ideas.map((idea, idx) => (
              <Link 
                key={idea._id} 
                to={`/ideas/${idea._id}`}
                className="glass-card glass-card-hover group p-10 rounded-[2.5rem] flex flex-col h-full relative overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-aurora-cyan/10 rounded-full blur-3xl group-hover:bg-aurora-purple/20 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center space-x-2">
                     <div className="p-2 bg-aurora-dark border border-white/5 rounded-lg shadow-glow-cyan">
                        {idea.category === 'AI' ? <Cpu className="w-4 h-4 text-aurora-cyan" /> : <Globe className="w-4 h-4 text-aurora-cyan" />}
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aurora-cyan">
                        {idea.category}
                     </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-aurora-dark px-3 py-1 rounded-full border border-white/5">
                    <User className="w-3.5 h-3.5" />
                    <span>{idea.createdBy?.username}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-aurora-cyan transition-colors tracking-tight leading-tight">
                  {idea.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-10 flex-grow leading-relaxed font-medium">
                  {idea.problem}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                   <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 text-slate-500 group-hover:text-aurora-cyan transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-black tracking-tight">{idea.engagement?.votes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500 group-hover:text-aurora-purple transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-black tracking-tight">{idea.engagement?.comments || 0}</span>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-aurora-dark border border-white/10 flex items-center justify-center group-hover:bg-aurora-cyan group-hover:text-aurora-dark group-hover:shadow-glow-cyan transition-all">
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaFeed;
