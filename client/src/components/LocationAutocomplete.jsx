import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const DEBOUNCE_MS = 500;
const MIN_CHARS = 2;

async function searchLocations(query, signal) {
  if (!query.trim()) return [];
  const res = await fetch(`${API_BASE}/api/locations/search?q=${encodeURIComponent(query)}`, { signal });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function LocationAutocomplete({ value, onChange, placeholder, label, disabled }) {
  const [input, setInput] = useState(value?.display_name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInput(value?.display_name || '');
  }, [value?.display_name]);

  useEffect(() => {
    const query = input.trim();
    if (!query || query.length < MIN_CHARS) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      setLoading(true);
      searchLocations(query, signal)
        .then((list) => {
          if (!signal.aborted) {
            setSuggestions(list);
            setOpen(true);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError' && !signal.aborted) setSuggestions([]);
        })
        .finally(() => {
          if (!signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [input]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const select = (item) => {
    onChange(item);
    setInput(item.display_name);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full py-3 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-uber-green focus:border-transparent transition-all"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500">Searching...</span>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-56 overflow-auto z-20">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => select(s)}
              className="px-4 py-3 text-neutral-800 text-sm cursor-pointer hover:bg-neutral-50 border-b border-neutral-100 last:border-0 first:rounded-t-xl last:rounded-b-xl"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
