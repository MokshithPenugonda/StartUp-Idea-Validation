import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { UserPlus, Mail, Lock, User, Briefcase, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signup(formData);
      if (res.user?.role === 'founder') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-aurora-dark pb-20">
      <Navbar />
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aurora-purple/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aurora-cyan/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)] relative z-10">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="glass-card p-12 md:p-16 rounded-[4rem] relative shadow-glow-purple border-white/5 bg-aurora-surface/40">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-aurora-surface border border-aurora-purple text-aurora-purple text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-glow-purple">
                <Sparkles className="w-4 h-4" />
                <span>Global registration</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">Create Global Identity</h1>
              <p className="text-slate-400 font-medium">Join a community of premium builders and technical visionaries.</p>
            </div>

            {error && (
              <div className="mb-10 p-5 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-bold rounded-2xl flex items-center shadow-lg">
                <ShieldCheck className="w-5 h-5 mr-3 text-red-400" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-purple transition-colors" />
                  <input
                    type="text"
                    required
                    className="premium-input pl-14"
                    placeholder="visionary_dev"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Email Endpoint</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-purple transition-colors" />
                  <input
                    type="email"
                    required
                    className="premium-input pl-14"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Security Hash</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-purple transition-colors" />
                  <input
                    type="password"
                    required
                    className="premium-input pl-14"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Professional Role</label>
                <div className="relative group">
                  <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-purple transition-colors" />
                  <select
                    className="premium-input pl-14 appearance-none cursor-pointer text-slate-100 bg-aurora-dark"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">Community User</option>
                    <option value="founder">Project Founder</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full flex items-center justify-center space-x-3 py-5 text-xl"
                >
                  <span>{loading ? 'Processing Identity...' : 'Register Global Account'}</span>
                  {!loading && <ArrowRight className="w-6 h-6" />}
                </button>
              </div>
            </form>

            <div className="mt-16 text-center">
              <p className="text-slate-400 font-bold text-sm tracking-tight">
                Secure credentials found?{' '}
                <Link to="/login" className="text-aurora-cyan hover:text-white underline underline-offset-8 decoration-aurora-cyan/30 hover:decoration-white transition-all">
                  Access Identity
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
