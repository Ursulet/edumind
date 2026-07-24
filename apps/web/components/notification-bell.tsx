"use client";

import { useState } from "react";
import { Badge } from "@educariera/ui";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Mock Notifications
  const notifications = [
    {
      id: "n-1",
      title: "Rezultat Test Disponibil",
      message: "Rezultatul testului RIASEC pentru Matei a fost publicat.",
      category: "RESULT_RECEIVED",
      readAt: null,
      createdAt: "Acum 2 ore",
    },
    {
      id: "n-2",
      title: "Plată Confirmată",
      message: "Plata pentru pachetul 'Consiliere Premium' a fost procesată cu succes.",
      category: "PAYMENT_CONFIRMED",
      readAt: new Date().toISOString(),
      createdAt: "Ieri",
    },
  ];

  const unreadCount = notifications.filter(n => !n.readAt).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-forest-accent/10 transition-colors focus:outline-none"
      >
        <svg className="w-6 h-6 text-warm-surface md:text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white border border-border overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border bg-ivory-background flex items-center justify-between">
            <h3 className="font-semibold text-primary-ink text-sm">Notificări</h3>
            <button className="text-xs text-forest-accent hover:underline">Marchează toate citite</button>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 transition-colors hover:bg-muted-surface/50 ${!n.readAt ? 'bg-sage-surface/20' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-medium ${!n.readAt ? 'text-primary-ink' : 'text-primary-text'}`}>
                    {n.title}
                  </h4>
                  {!n.readAt && <span className="w-2 h-2 rounded-full bg-forest-accent mt-1.5" />}
                </div>
                <p className="text-xs text-muted-text mb-2 line-clamp-2">{n.message}</p>
                <span className="text-[10px] text-muted-text uppercase font-semibold tracking-wider">
                  {n.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
