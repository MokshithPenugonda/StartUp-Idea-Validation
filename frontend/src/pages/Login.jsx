import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LogIn, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(formData.email, formData.password);
      if (res.user?.role === 'founder') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-aurora-dark">
      <Navbar />
      
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-aurora-cyan/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-aurora-purple/30 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)] relative z-10">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="glass-card p-12 md:p-16 rounded-[4rem] relative shadow-glow-cyan border-white/5 bg-aurora-surface/40">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-aurora-surface border border-aurora-cyan text-aurora-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-glow-cyan">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Access</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">Identity Check</h1>
              <p className="text-slate-400 font-medium">Welcome back to the epicentre of innovation.</p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-bold rounded-2xl flex items-center shadow-lg">
                <Sparkles className="w-5 h-5 mr-3 text-red-400" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Email Identity</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-cyan transition-colors" />
                  <input
                    type="email"
                    required
                    className="premium-input pl-14"
                    placeholder="architect@vision.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-aurora-cyan transition-colors" />
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

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full flex items-center justify-center space-x-3 py-5 text-lg"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In Now'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-400 font-bold text-sm tracking-tight">
                New to the scope?{' '}
                <Link to="/signup" className="text-aurora-cyan hover:text-white underline underline-offset-8 decoration-aurora-cyan/30 hover:decoration-white transition-all">
                  Create global identity
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
