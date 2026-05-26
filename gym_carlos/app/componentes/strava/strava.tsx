'use client';
import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date_local: string;
}

const typeConfig: Record<string, { label: string; icon: string; colorClass: string }> = {
  Run:   { label: 'Carrera',  icon: 'ti-run',  colorClass: 'badge-run' },
  Ride:  { label: 'Ciclismo', icon: 'ti-bike', colorClass: 'badge-ride' },
  Swim:  { label: 'Natación', icon: 'ti-swimming', colorClass: 'badge-swim' },
};

export default function StravaActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/strava')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setActivities(data);
        else setError(JSON.stringify(data));
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const toKm = (m: number) => (m / 1000).toFixed(1);
  const toPace = (seconds: number, meters: number) => {
    const pace = seconds / (meters / 1000);
    const min = Math.floor(pace / 60);
    const sec = Math.floor(pace % 60).toString().padStart(2, '0');
    return `${min}:${sec} /km`;
  };
  const toTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };
  const toDate = (d: string) => new Date(d).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  if (loading) return <p>Cargando actividades...</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
      {activities.map(act => {
        const cfg = typeConfig[act.type] ?? { label: act.type, icon: 'ti-activity', colorClass: 'badge-other' };
        const isRide = act.type === 'Ride';
        return (
          <div key={act.id} style={{
            background: 'white', border: '1px solid #eee',
            borderRadius: 12, padding: '1rem 1.25rem'
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 500, padding: '3px 8px',
              borderRadius: 6, marginBottom: 10,
              background: isRide ? '#EAF3DE' : '#E6F1FB',
              color: isRide ? '#27500A' : '#0C447C'
            }}>
              <i className={`ti ${cfg.icon}`} /> {cfg.label}
            </span>

            <p style={{ fontSize: 15, fontWeight: 500, margin: '0 0 12px' }}>{act.name}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Distancia', val: `${toKm(act.distance)} km` },
                { label: isRide ? 'Vel. media' : 'Ritmo', val: isRide
                    ? `${(act.distance / act.moving_time * 3.6).toFixed(1)} km/h`
                    : toPace(act.moving_time, act.distance) },
                { label: 'Tiempo', val: toTime(act.moving_time) },
                { label: 'Desnivel', val: `+${Math.round(act.total_elevation_gain)} m` },
              ].map(s => (
                <div key={s.label} style={{ background: '#f7f7f7', borderRadius: 8, padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, color: '#888', margin: '0 0 2px' }}>{s.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>{s.val}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: '#aaa', margin: '10px 0 0' }}>
              📅 {toDate(act.start_date_local)}
            </p>
          </div>
        );
      })}
    </div>
  );
}