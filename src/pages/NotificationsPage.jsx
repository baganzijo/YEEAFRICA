import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../Context/AuthContext';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const categorizeNotification = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diff = today - thatDay;
  const oneDay = 1000 * 60 * 60 * 24;

  if (diff === 0) return 'Today';
  if (diff === oneDay) return 'Yesterday';
  if (diff <= 6 * oneDay) return 'This Week';
  if (now.getMonth() === date.getMonth()) return 'This Month';
  return 'Earlier';
};

const Notifications = () => {
  const { session } = UserAuth();
  const [notifications, setNotifications] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async () => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (data?.role) setRole(data.role);
  };

  const fetchNotifications = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setNotifications(data);
    }

    setLoading(false);
  };

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', session.user.id);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    fetchNotifications();
  };

  useEffect(() => {
    fetchUserRole();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const groupedNotifications = notifications.reduce((acc, note) => {
    const category = categorizeNotification(note.created_at);
    if (!acc[category]) acc[category] = [];
    acc[category].push(note);
    return acc;
  }, {});

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-gray-700 dark:text-white">Please log in to view your notifications.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Mark all as read
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No notifications yet.</p>
      ) : (
        Object.entries(groupedNotifications).map(([group, notes]) => (
          <div key={group} className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">{group}</h2>
            <ul className="space-y-4">
              {notes.map((note) => {
                let linkPath = '#';
                const jobId = note.job_id;

                if (role === 'student' && note.id) {
                  linkPath = `/notification/job/${note.id}`; // ✅ directs student to custom notification job view
                } else if (role === 'employer' && jobId) {
                  linkPath = `/employer/view-job/${jobId}/applicants`; // ✅ employer to view applicants
                }

                return (
                  <li key={note.id}>
                    <Link
                      to={linkPath}
                      onClick={() => markAsRead(note.id)}
                      className={`block p-4 rounded shadow transition ${
                        note.is_read
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'bg-yellow-50 border-l-4 border-yellow-500 dark:bg-yellow-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {note.message}
                            {!note.is_read && (
                              <span className="ml-2 text-xs font-semibold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            deleteNotification(note.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
