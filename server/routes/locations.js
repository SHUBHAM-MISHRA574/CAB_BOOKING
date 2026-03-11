import express from 'express';

const router = express.Router();
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

// Nominatim requires a valid User-Agent (usage policy). Use env or a descriptive default.
const USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'CabBook/1.0 (https://github.com/cabbook; contact@example.com)';

const fetchOptions = (extra = {}) => ({
  headers: { 'User-Agent': USER_AGENT, ...extra },
  signal: AbortSignal.timeout(Number(process.env.LOCATION_FETCH_TIMEOUT_MS) || 10000),
});

// Location search (Nominatim)
router.get('/search', async (req, res) => {
  const rawQuery = (req.query.q || '').trim();
  const q = encodeURIComponent(rawQuery);
  console.log('[locations/search] request', { rawQuery, encoded: q });
  if (!q) {
    console.log('[locations/search] empty query, returning []');
    return res.json([]);
  }
  const url = `${NOMINATIM_URL}?q=${q}&format=json&limit=5`;
  const opts = fetchOptions();
  console.log('[locations/search] fetching', { url, userAgent: opts.headers['User-Agent']?.slice(0, 50) + '...' });
  try {
    const resp = await fetch(url, opts);
    console.log('[locations/search] response', { status: resp.status, ok: resp.ok, headers: Object.fromEntries(resp.headers.entries()) });
    if (!resp.ok) {
      const text = await resp.text();
      console.error('[locations/search] Nominatim error', { status: resp.status, bodyPreview: text?.slice(0, 300) });
      return res.status(502).json({ message: 'Location service temporarily unavailable. Try again in a moment.' });
    }
    const data = await resp.json();
    console.log('[locations/search] parsed', { isArray: Array.isArray(data), length: Array.isArray(data) ? data.length : 0 });
    if (!Array.isArray(data)) return res.json([]);
    res.json(data.map((p) => ({ display_name: p.display_name, lat: p.lat, lon: p.lon })));
  } catch (err) {
    console.error('[locations/search] catch', {
      name: err.name,
      message: err.message,
      cause: err.cause,
      causeCode: err.cause?.code,
      causeMessage: err.cause?.message,
      stack: err.stack,
    });
    if (err.name === 'AbortError') {
      return res.status(504).json({ message: 'Location search timed out. Try again.' });
    }
    res.status(500).json({
      message: err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'ECONNREFUSED'
        ? 'Cannot reach location service. Check your internet connection.'
        : 'Location search failed. Try again later.',
    });
  }
});

// Distance between two points (OSRM)
router.get('/distance', async (req, res) => {
  const { pickupLon, pickupLat, dropLon, dropLat } = req.query;
  console.log('[locations/distance] request', { pickupLon, pickupLat, dropLon, dropLat });
  if ([pickupLon, pickupLat, dropLon, dropLat].some((v) => v == null || v === '')) {
    console.log('[locations/distance] missing params, 400');
    return res.status(400).json({ message: 'pickupLon, pickupLat, dropLon, dropLat required' });
  }
  const coords = `${pickupLon},${pickupLat};${dropLon},${dropLat}`;
  const url = `${OSRM_URL}/${coords}?overview=false`;
  console.log('[locations/distance] fetching', { url });
  try {
    const resp = await fetch(url, fetchOptions());
    const data = await resp.json();
    console.log('[locations/distance] response', { status: resp.status, ok: resp.ok, code: data?.code, routesLength: data?.routes?.length });
    if (!resp.ok || data.code !== 'Ok' || !data.routes?.[0]) {
      console.error('[locations/distance] bad response', { data: JSON.stringify(data).slice(0, 200) });
      return res.status(400).json({ message: 'Could not compute route between these points' });
    }
    const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
    console.log('[locations/distance] ok', { distanceKm });
    res.json({ distanceKm: Number(distanceKm) });
  } catch (err) {
    console.error('[locations/distance] catch', {
      name: err.name,
      message: err.message,
      cause: err.cause,
      causeCode: err.cause?.code,
      causeMessage: err.cause?.message,
      stack: err.stack,
    });
    if (err.name === 'AbortError') {
      return res.status(504).json({ message: 'Distance service timed out. Try again.' });
    }
    res.status(500).json({
      message: err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'ECONNREFUSED'
        ? 'Cannot reach distance service. Check your internet connection.'
        : 'Distance calculation failed. Try again later.',
    });
  }
});

export default router;
