'use client';
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    url: '',
    tipo: 'youtube',
    poster_url: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [buscando, setBuscando] = useState(false);

  const supabase = createClient();

  const buscarPelicula = async () => {
    if (!formData.titulo) return alert("Escribe un título primero");
    setBuscando(true);
    const API_KEY = "9aa7b1b6cb905bb791cb7a8e3a88fcc8"; 
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(formData.titulo)}&language=es-ES`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const peli = data.results[0];
        setFormData(prev => ({
          ...prev,
          titulo: peli.title,
          poster_url: `https://image.tmdb.org/t/p/w500${peli.poster_path}`
        }));
      } else {
        alert("No se encontró la película");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBuscando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Asegúrate de que el nombre de la tabla sea 'recursos_media' o 'contenido' según lo que uses en tu otro archivo
    const { error } = await supabase.from('recursos_media').insert([formData]);
    if (error) setMensaje('Error: ' + error.message);
    else {
      setMensaje('¡Guardado con éxito!');
      setFormData({ titulo: '', url: '', tipo: 'youtube', poster_url: '' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2>Agregar contenido</h2>
        {mensaje && <div className="alert alert-info">{mensaje}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Título y Autocompletar */}
          <div className="mb-3">
            <label className="form-label">Título</label>
            <div className="input-group">
              <input type="text" className="form-control" required value={formData.titulo} 
                onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
              <button type="button" className="btn btn-secondary" onClick={buscarPelicula} disabled={buscando}>
                {buscando ? 'Buscando...' : 'Autocompletar'}
              </button>
            </div>
          </div>

          {/* URL */}
          <div className="mb-3">
            <label className="form-label">URL del video/plataforma</label>
            <input type="url" className="form-control" required value={formData.url} 
              onChange={(e) => setFormData({...formData, url: e.target.value})} />
          </div>

          {/* Tipo */}
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={formData.tipo} 
              onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}>
              <option value="youtube">YouTube</option>
              <option value="netflix">Netflix</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Poster URL */}
          <div className="mb-3">
            <label className="form-label">URL del Póster</label>
            <input type="url" className="form-control" required value={formData.poster_url} 
              onChange={(e) => setFormData({...formData, poster_url: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary w-100">Guardar en Catálogo</button>
        </form>
      </div>
    </div>
  );
}