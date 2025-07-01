import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setNotification(data);

        // Mark as read if not already
        if (!data.is_read) {
          await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        }

        // If there's a link, redirect
        if (data.link) {
          navigate(data.link);
        }
      }

      setLoading(false);
    };

    fetchNotification();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!notification) {
    return <div className="p-8 text-red-500">Notification not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white dark:bg-gray-950 rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Notification</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{notification.message}</p>
      <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
    </div>
  );
};

export default NotificationDetails;
