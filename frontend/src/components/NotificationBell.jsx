import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Bell, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all duration-300"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-indigo-600 animate-pulse' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-indigo-200">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-100 overflow-hidden z-50 animate-slide-up">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Activity</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-indigo-100/50">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`px-6 py-5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all duration-300 ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
                >
                  <div className="flex space-x-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      n.type === 'vote' ? 'bg-blue-50 text-blue-600' : 
                      n.type === 'comment' ? 'bg-indigo-50 text-indigo-600' : 
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {n.type === 'vote' ? <CheckCircle className="w-5 h-5" /> : 
                       n.type === 'comment' ? <MessageSquare className="w-5 h-5" /> : 
                       <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed mb-1.5 ${!n.isRead ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {!n.isRead && (
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 ring-4 ring-indigo-50"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Bell className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-medium font-display">No updates yet</p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-slate-50/50 text-center border-t border-slate-50">
             <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-[0.2em]">
                Manage Dashboard
             </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
