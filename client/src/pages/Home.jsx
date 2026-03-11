import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50">
      {/* Hero */}
      <section className="relative bg-uber-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #00C853 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl">
            Book a ride in minutes
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-neutral-300 max-w-xl">
            Choose your ride, set pickup and drop, and get an instant fare. Simple and fast.
          </p>
          {user ? (
            <Link
              to="/book"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-uber-green text-white font-semibold text-base hover:bg-uber-green-hover transition-colors"
            >
              Book a ride
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/login"
                className="px-6 py-3.5 rounded-xl border border-neutral-500 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-uber-green text-white font-semibold hover:bg-uber-green-hover transition-colors"
              >
                Sign up to book
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Cab types */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">Ride types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'Mini', desc: 'Affordable, up to 4' },
            { type: 'Sedan', desc: 'Comfortable, up to 4' },
            { type: 'SUV', desc: 'Spacious, up to 6' },
            { type: 'Luxury', desc: 'Premium ride' },
          ].map(({ type, desc }) => (
            <div
              key={type}
              className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-uber-green/10 flex items-center justify-center mx-auto mb-3 text-uber-green font-bold">
                {type[0]}
              </div>
              <p className="font-semibold text-neutral-900">{type}</p>
              <p className="text-sm text-neutral-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
