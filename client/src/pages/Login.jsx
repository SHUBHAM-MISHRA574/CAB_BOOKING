import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data);
      navigate('/book');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Login</h1>
        <p className="text-neutral-500 mb-6">Sign in to book your ride.</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full py-3 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-uber-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-3 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-uber-green focus:border-transparent"
              />
            </div>
          </div>
          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3.5 px-4 rounded-xl bg-uber-green text-white font-semibold hover:bg-uber-green-hover disabled:opacity-50 transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-uber-green font-medium hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
