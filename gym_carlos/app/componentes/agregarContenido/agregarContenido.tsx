'use client';
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";

export default function AgregarContenidoUsuario() {
  const [formData, setFormData] = useState({ 
    titulo: '', 
    url: '', 
    tipo: 'youtube', 
    poster_url: '' 
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [buscando, setBuscando] = useState(false);
  
  const supabase = createClient();

  const buscarEnTMDB = async () => {
    if (!formData.titulo) return alert("Escribe el nombre de la película o serie");
    setBuscando(true);
    
    // Usamos una API KEY pública de TMDB (asegúrate de tener la tuya si es para producción)
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
        alert("No se encontró el contenido. Intenta con otro nombre.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBuscando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Debes iniciar sesión");

    const { error } = await supabase.from('recursos_media').insert([{
      ...formData,
      user_id: user.id
    }]);

    if (error) {
      setMensaje({ texto: 'Error: ' + error.message, tipo: 'danger' });
    } else {
      setMensaje({ texto: '¡Contenido agregado correctamente!', tipo: 'success' });
      setFormData({ titulo: '', url: '', tipo: 'youtube', poster_url: '' });
    }
  };

  return (
    <div className="card p-4 shadow-sm border-0 rounded-4 mt-4">
      <h5 className="mb-3">Agregar contenido al catálogo</h5>
      
      {mensaje.texto && <div className={`alert alert-${mensaje.tipo} small`}>{mensaje.texto}</div>}

      <form onSubmit={handleSubmit}>
        {/* Paso 1: Búsqueda */}
        <label className="form-label small text-muted">Nombre del contenido</label>
        <div className="input-group mb-3">
          <input type="text" className="form-control" value={formData.titulo} 
            onChange={(e) => setFormData({...formData, titulo: e.target.value})} placeholder="Ej: Interestelar" />
          <button type="button" className="btn btn-outline-primary" onClick={buscarEnTMDB} disabled={buscando}>
            {buscando ? 'Buscando...' : 'Autocompletar Info'}
          </button>
        </div>

        {/* Paso 2: Vista previa del póster (si se encontró) */}
        {formData.poster_url && (
          <div className="mb-3 text-center">
            <img src={formData.poster_url} alt="Poster" style={{ width: '120px', borderRadius: '8px' }} />
            <p className="small text-muted mt-2">¡Información cargada!</p>
          </div>
        )}
        
        {/* Paso 3: URL y Plataforma */}
        <div className="mb-3">
          <label className="form-label small text-muted">URL del video</label>
          <input type="url" className="form-control" required value={formData.url} 
            onChange={(e) => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
        </div>

        <div className="mb-3">
          <label className="form-label small text-muted">Plataforma</label>
          <select className="form-select" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})}>
            <option value="youtube">YouTube</option>
            <option value="netflix">Netflix</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <button type="submit" className="btn btn-dark w-100">Agregar al catálogo</button>
      </form>
    </div>
  );
}