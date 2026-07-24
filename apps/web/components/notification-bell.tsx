"use client";

import { useState, useEffect } from "react";
import { getNotifications, markAsRead } from "@/lib/actions/notifications";
import { Badge } from "@edumind/ui";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleMarkAllRead = async () => {
    // In a real app we'd call an endpoint to mark all as read. 
    // Here we'll just optimistically update the state.
    setNotifications(notifications.map(n => ({ ...n, readAt: new Date().toISOString() })));
    await markAsRead(); 
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#EDF4F0] text-[#6B746F] hover:text-[#2F6B57] transition-colors focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B4453A] text-[9px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-[#FFFDF8] border border-[#E3DED3] overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#E3DED3] bg-[#F7F5F0] flex items-center justify-between">
            <h3 className="font-semibold text-[#1F2622] text-sm">Notificări</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-[#2F6B57] hover:underline font-medium">
                Marchează toate citite
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-[#E3DED3]">
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B746F]">Se încarcă...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6B746F]">Nu ai nicio notificare nouă.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`p-4 transition-colors hover:bg-[#F7F5F0] ${!n.readAt ? 'bg-[#EDF4F0]/50' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-medium ${!n.readAt ? 'text-[#1F2622]' : 'text-[#6B746F]'}`}>
                      {n.title}
                    </h4>
                    {!n.readAt && <span className="w-2 h-2 rounded-full bg-[#2F6B57] mt-1.5 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[#6B746F] mb-2 line-clamp-2">{n.message}</p>
                  <span className="text-[10px] text-[#6B746F] uppercase font-semibold tracking-wider">
                    {new Date(n.createdAt).toLocaleDateString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

