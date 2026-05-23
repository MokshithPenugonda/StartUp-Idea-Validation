import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lightbulb, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-aurora-surface/60 backdrop-blur-xl border-b border-white/5 shadow-glow-cyan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gradient-to-br from-aurora-cyan to-aurora-purple rounded-2xl shadow-glow-cyan group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight drop-shadow-md">
                Startup<span className="text-aurora-cyan">Scope</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-slate-300 hover:text-aurora-cyan font-bold text-sm tracking-wide transition-colors">
              Idea Feed
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 text-slate-300 hover:text-aurora-purple font-bold text-sm tracking-wide transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="h-6 w-px bg-slate-700"></div>
                
                <div className="flex items-center space-x-6">
                  <NotificationBell />
                  
                  <div className="flex items-center space-x-4 pl-2">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-white leading-none">{user.username}</span>
                      <span className="text-[10px] uppercase tracking-widest text-aurora-cyan font-bold mt-1">
                        {user.role}
                      </span>
                    </div>
                    <div className="relative group">
                       <div className="w-11 h-11 bg-aurora-dark rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-aurora-cyan/50 group-hover:shadow-glow-cyan transition-all duration-300">
                          <UserIcon className="w-5 h-5 text-slate-300" />
                       </div>
                       <button 
                         onClick={logout}
                         className="absolute -top-1 -right-1 w-5 h-5 bg-aurora-surface shadow-glow-cyan rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:scale-110 transition-all border border-white/10"
                         title="Logout"
                       >
                         <LogOut className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-300 hover:text-white font-bold text-sm tracking-wide drop-shadow">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-premium !py-2.5 !px-6">
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
