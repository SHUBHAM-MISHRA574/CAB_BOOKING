import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/bookings')
      .then(setBookings)
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError(err.message || 'Cancel failed');
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const statusStyles = {
    confirmed: 'bg-amber-100 text-amber-800',
    completed: 'bg-uber-green/15 text-uber-green',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">My bookings</h1>
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">My bookings</h1>
        <p className="text-neutral-500 mb-6">View and manage your ride bookings.</p>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <p className="text-neutral-500 mb-4">No bookings yet.</p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-uber-green text-white font-semibold text-sm hover:bg-uber-green-hover transition-colors"
            >
              Book a ride
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900">
                    {b.cab?.type} – {b.cab?.name}
                  </p>
                  <p className="text-neutral-600 text-sm mt-1">
                    {b.pickup} → {b.drop}
                  </p>
                  <p className="text-neutral-500 text-sm mt-0.5">
                    {b.distanceKm} km · ₹{b.fare} · {formatDate(b.scheduledAt)}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      statusStyles[b.status] || 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                {b.status !== 'cancelled' && b.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(b._id)}
                    className="shrink-0 px-4 py-2 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
