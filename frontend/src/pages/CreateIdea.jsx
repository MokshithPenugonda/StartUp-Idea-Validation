import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Rocket, Lightbulb, Target, Sparkles, 
  ArrowRight, AlertCircle, Info, ChevronRight
} from 'lucide-react';

const CreateIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'SaaS',
    problem: '',
    solution: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        problemStatement: formData.problem,
        description: formData.solution,
      };
      await api.post('/ideas', payload);
      navigate('/');
    } catch (err) {
      console.error("Backend Error Details:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Transaction failed. Please retry.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurora-dark relative pb-32 overflow-hidden">
      <Navbar />
      
      {/* Mesh Decoration */}
      <div className="mesh-gradient opacity-20 h-[800px]"></div>

      <div className="page-container mt-20 max-w-5xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-aurora-surface border border-aurora-purple text-aurora-purple text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-glow-purple">
            <Rocket className="w-4 h-4" />
            <span>Founders Portal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-md">Initiate Vision</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Formulate your startup concept and broadcast it to a community of technical evaluators and early believers.
          </p>
        </div>

        <div className="glass-card p-12 md:p-20 rounded-[4rem] relative overflow-hidden animate-slide-up shadow-glow-cyan border-white/5 bg-aurora-surface/40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora-cyan/20 blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          
          {error && (
            <div className="mb-12 p-5 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-bold rounded-2xl flex items-center shadow-lg">
              <AlertCircle className="w-5 h-5 mr-4 text-red-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-3 flex items-center">
                   <Lightbulb className="w-4 h-4 mr-3 text-aurora-purple" />
                   Project Identity
                </label>
                <input
                  type="text"
                  required
                  maxLength="150"
                  className="premium-input text-sm"
                  placeholder="e.g. QuantumFlow — AI-powered supply chain optimizer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-3 flex items-center">
                   <Target className="w-4 h-4 mr-3 text-aurora-cyan" />
                   Market Domain
                </label>
                <div className="relative group">
                   <select
                    className="premium-input appearance-none cursor-pointer pr-12 font-bold text-slate-100 bg-aurora-dark"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="SaaS">Enterprise SaaS</option>
                    <option value="AI">Artificial Intelligence</option>
                    <option value="Fintech">Financial Tech</option>
                    <option value="Healthtech">Health Infrastructure</option>
                    <option value="E-commerce">Modern E-commerce</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-aurora-cyan transition-colors">
                     <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-3 flex items-center">
                 <AlertCircle className="w-4 h-4 mr-3 text-slate-400" />
                 What is the critical Pain Point?
              </label>
              <textarea
                required
                rows="7"
                className="premium-input min-h-[200px] resize-none leading-relaxed text-sm"
                placeholder="Deep dive into the problem your technology resolves..."
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-3 flex items-center">
                 <Sparkles className="w-4 h-4 mr-3 text-aurora-cyan" />
                 The Architectural Solution
              </label>
              <textarea
                required
                rows="7"
                className="premium-input min-h-[200px] resize-none leading-relaxed text-sm border-aurora-cyan/30 focus:border-aurora-cyan bg-aurora-cyan/5 focus:bg-aurora-dark"
                placeholder="Explain the technical innovation and value prop..."
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              ></textarea>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full py-6 text-xl shadow-glow-cyan flex items-center justify-center space-x-4"
              >
                <Rocket className="w-7 h-7" />
                <span>{loading ? 'Initializing Launch Process...' : 'Publish Vision to Community'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default CreateIdea;
