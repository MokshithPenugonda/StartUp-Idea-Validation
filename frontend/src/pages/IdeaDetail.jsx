import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  ThumbsUp, MessageSquare, Users, ChevronLeft, 
  Send, Sparkles, AlertCircle, Calendar, Tag, ShieldCheck
} from 'lucide-react';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIdeaAndComments();
  }, [id]);

  const fetchIdeaAndComments = async () => {
    try {
      const [ideaRes, commentRes] = await Promise.all([
        api.get(`/ideas/${id}`),
        api.get(`/interactions/comment/${id}`),
      ]);
      setIdea(ideaRes.data.data);
      setComments(commentRes.data.data);
    } catch (err) {
      setError('Could not retrieve vision details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/interactions/vote/${id}`);
      fetchIdeaAndComments();
    } catch (err) {
      console.error('Vote failed');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await api.post(`/interactions/comment/${id}`, { commentText: newComment });
      setNewComment('');
      fetchIdeaAndComments();
    } catch (err) {
      console.error('Comment failed');
    }
  };

  const handleJoinWaitingList = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/interactions/waitinglist/${id}`);
      alert("Success! You've joined the vision waiting list.");
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center p-32">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="page-container mt-20 text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-8 opacity-50" />
        <h2 className="text-4xl font-display font-black text-slate-900 mb-6">{error}</h2>
        <button onClick={() => navigate('/')} className="btn-premium">Return to Feed</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 bg-aurora-dark text-slate-100">
      <Navbar />
      
      {/* Background Decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aurora-cyan/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aurora-purple/20 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="page-container relative z-10 mt-16">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 text-slate-400 hover:text-aurora-cyan transition-all mb-12 group font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <div className="w-8 h-8 rounded-xl bg-aurora-surface border border-white/10 flex items-center justify-center group-hover:bg-aurora-cyan/20 group-hover:border-aurora-cyan transition-all shadow-glow-cyan">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Feed</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Vision Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-card p-12 md:p-16 rounded-[3.5rem] animate-fade-in shadow-glow-cyan">
              <div className="flex items-center space-x-4 mb-10">
                 <div className="px-5 py-2 bg-aurora-dark border border-aurora-cyan/30 text-aurora-cyan text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                    {idea.category}
                 </div>
                 <div className="h-1.5 w-1.5 bg-aurora-border rounded-full"></div>
                 <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(idea.createdAt).toLocaleDateString()}
                 </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-12 tracking-tight leading-tight drop-shadow-md">
                {idea.title}
              </h1>

              <div className="space-y-12">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center">
                     <AlertCircle className="w-4 h-4 mr-3 text-slate-500" />
                     The Core Problem
                  </h3>
                  <div className="text-xl text-slate-300 leading-relaxed font-medium pl-4 border-l-4 border-aurora-border">
                    {idea.problem}
                  </div>
                </section>

                <section className="p-10 rounded-[2.5rem] bg-gradient-to-br from-aurora-cyan/10 to-aurora-purple/10 border border-white/5 shadow-glow-cyan animate-slide-up">
                  <h3 className="text-[10px] font-black text-aurora-cyan uppercase tracking-[0.3em] mb-6 flex items-center">
                     <Sparkles className="w-4 h-4 mr-3" />
                     The Innovation
                  </h3>
                  <p className="text-2xl md:text-3xl leading-snug font-black font-display tracking-tight text-white drop-shadow">
                    {idea.solution}
                  </p>
                </section>
              </div>
            </div>

            {/* High-Contrast Feedback Section */}
            <div className="glass-card p-12 md:p-16 rounded-[3.5rem] animate-fade-in delay-100 shadow-glow-purple">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-display font-black text-white tracking-tight">
                    Feedback <span className="text-aurora-purple">Loop</span>
                  </h3>
                  <div className="px-4 py-2 bg-aurora-dark border border-white/10 rounded-2xl text-slate-400 text-xs font-bold shadow-glow-purple">
                    {comments.length} Contributions
                  </div>
               </div>

               <form onSubmit={handleComment} className="mb-12 relative group">
                  <textarea 
                    className="premium-input min-h-[140px] resize-none pr-16 text-lg"
                    placeholder="Share your technical perspective..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button 
                    type="submit"
                    className="absolute bottom-5 right-5 p-4 bg-gradient-to-r from-aurora-cyan to-aurora-purple text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-glow-purple"
                  >
                    <Send className="w-6 h-6" />
                  </button>
               </form>

               <div className="space-y-8">
                  {comments.length > 0 ? (
                    comments.map((c, idx) => (
                      <div key={c._id} className="p-8 rounded-[2.5rem] bg-aurora-dark border border-white/5 group hover:bg-aurora-surface hover:shadow-glow-cyan hover:border-aurora-cyan/30 transition-all animate-fade-in" style={{animationDelay: `${idx * 100}ms`}}>
                        <div className="flex items-center justify-between mb-5">
                           <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-2xl bg-aurora-surface border border-white/10 text-aurora-cyan flex items-center justify-center font-black text-lg shadow-glow-cyan">
                                 {c.userId?.username?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-black text-sm tracking-tight">{c.userId?.username}</span>
                           </div>
                           <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                              {new Date(c.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed">{c.commentText}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-aurora-dark/50 rounded-[2.5rem] border-2 border-dashed border-aurora-border">
                       <MessageSquare className="w-12 h-12 text-aurora-border mx-auto mb-4" />
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No activity yet</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Dynamic Sidebar Actions */}
          <div className="space-y-10 animate-fade-in delay-200">
             <div className="glass-card p-10 rounded-[3.5rem] sticky top-32 shadow-glow-cyan border-white/5">
                <div className="mb-12">
                   <div className="flex items-center space-x-4 mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-aurora-dark flex items-center justify-center border border-white/10 shadow-glow-cyan">
                         <ShieldCheck className="w-7 h-7 text-aurora-cyan" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Architect</span>
                        <span className="text-white font-black text-xl tracking-tight">{idea.createdBy?.username}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center space-x-4 mb-10">
                   <div className="flex-1 p-6 rounded-[2.5rem] bg-aurora-dark border border-aurora-cyan/30 text-center shadow-glow-cyan">
                      <div className="text-aurora-cyan font-display font-black text-4xl mb-1 drop-shadow">{idea.engagement?.votes || 0}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Votes</div>
                   </div>
                   <div className="flex-1 p-6 rounded-[2.5rem] bg-aurora-dark border border-white/10 text-center">
                      <div className="text-white font-display font-black text-4xl mb-1">{idea.engagement?.comments || 0}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Feedbacks</div>
                   </div>
                </div>

                <div className="space-y-5">
                  <button 
                    onClick={handleVote}
                    className="btn-premium w-full flex items-center justify-center space-x-3 h-20 text-xl shadow-glow-cyan cursor-pointer"
                  >
                    <ThumbsUp className="w-6 h-6" />
                    <span>Back Vision</span>
                  </button>

                  <button 
                    onClick={handleJoinWaitingList}
                    className="btn-premium-outline w-full flex items-center justify-center space-x-3 h-20 text-xl cursor-pointer"
                  >
                    <Users className="w-6 h-6" />
                    <span>Join Early Pool</span>
                  </button>
                </div>

                <div className="mt-10 p-6 rounded-3xl bg-aurora-dark border border-white/5">
                  <p className="text-center text-[10px] text-slate-500 leading-relaxed font-black uppercase tracking-widest">
                    Your interaction represents a high-signal indicator for technical feasibility.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
