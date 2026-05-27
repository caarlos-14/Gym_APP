'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";

interface Pelicula {
  id: string;
  titulo: string;
  url: string;
  tipo: 'youtube' | 'netflix' | 'otro';
  poster_url: string;
}

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Inicializar JS de Bootstrap para que funcionen los modales
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    // 2. Fetch de datos
    const supabase = createClient();
    async function fetchPeliculas() {
      const { data, error } = await supabase.from('recursos_media').select('*');
      if (error) {
        console.error('Error al cargar:', error);
      } else {
        setPeliculas(data || []);
      }
      setLoading(false);
    }
    fetchPeliculas();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{paddingBottom:"160px"}}>
      <div className="row g-4">
        {peliculas.map((item) => (
          <div className="col-12 col-md-6 col-lg-3" key={item.id}>
            <div className="card h-100 shadow-sm border-0">
              <img 
                src={item.poster_url} 
                className="card-img-top" 
                alt={item.titulo} 
                style={{ height: '350px', objectFit: 'cover' }} 
              />
              <div className="card-body">
                <h5 className="card-title text-truncate">{item.titulo}</h5>
                <button 
                  className="btn btn-primary w-100 mt-2" 
                  data-bs-toggle="modal" 
                  data-bs-target={`#modal-${item.id}`}
                >
                  {item.tipo === 'youtube' ? 'Ver video' : 'Ir a la plataforma'}
                </button>
              </div>
            </div>

            {/* Modal para cada película */}
            <div className="modal fade" id={`modal-${item.id}`} tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{item.titulo}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body p-0">
                    {item.tipo === 'youtube' ? (
                      <div className="ratio ratio-16x9">
                        <iframe 
                          src={item.url} 
                          title={item.titulo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="text-center p-5">
                        <p className="lead">El contenido se abrirá en una pestaña nueva.</p>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-danger btn-lg"
                        >
                          Abrir {(item.tipo || 'otro').toUpperCase()}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}