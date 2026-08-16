"use client";

import React, { useState, useEffect } from 'react';
import supabase from '@/lib/db';
import { NotificationItem } from '../types';
import { NotificationHeader } from '@/components/notification/NotificationHeader';
import { NotificationEmpty, NotificationSkeleton } from '@/components/notification/NotificationStates';
import { NotificationItemCard } from '@/components/notification/NotificationItemCard';

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('id, title, message, created_at, type, is_read, user_id, sender_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        console.error("Gagal mengambil data notifikasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    if (notifications.length === 0) return;

    const updatedLocal = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updatedLocal);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    } catch (err) {
      console.error("Gagal memperbarui status baca di database:", err);
    }
  };

  const markAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return;

    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  };

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    setNotifications(notifications.filter(n => n.id !== id));

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.error("Gagal menghapus notifikasi dari database:", err);
    }
  };

  const hasUnread = notifications.some(n => !n.is_read);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 md:pt-12 lg:pt-4 overflow-x-hidden text-slate-900 dark:text-slate-100 transition-colors">
      {/* Bagian Header */}
      <NotificationHeader 
        hasUnread={hasUnread} 
        loading={loading} 
        onMarkAllAsRead={markAllAsRead} 
      />

      {/* Bagian List Notifikasi */}
      <div className="space-y-3">
        {loading ? (
          <NotificationSkeleton />
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItemCard
              key={notif.id}
              notif={notif}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        ) : (
          <NotificationEmpty />
        )}
      </div>
    </div>
  );
};

export default Notification;