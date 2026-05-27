'use client';
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Definimos la estructura completa de tus datos
interface Contenido {
  id: string;
  titulo: string;
  url: string;
  poster_url: string; // Este es el campo clave
}

const Multimedia = () => {
  const [contenidos, setContenidos] = useState<Contenido[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchContenidos() {
      // Pedimos 'poster_url' y 'id' además de url y titulo
      const { data, error } = await supabase
        .from('recursos_media')
        .select('id, titulo, url, poster_url')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setContenidos(data);
      }
    }
    fetchContenidos();
  }, []);

  return (
    <>
      <h4 className="ms-2 mb-4">Contenidos Multimedia</h4>
      <div className="row mb-4" style={{ paddingBottom: "100px", overflowX: "auto" }}>
        <div className="d-flex position-relative" style={{ width: 'max-content' }}>
          
          {contenidos.map((item) => (
            <div className="ms-2" key={item.id} style={{ width: '220px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '12px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {item.titulo}
              </h3>
              
              <div className="position-relative">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img 
                    style={{ 
                      width: '100%', 
                      height: '280px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      display: 'block' 
                    }} 
                    // Usamos directamente el poster_url que guardaste
                    src={item.poster_url || '/placeholder.jpg'} 
                    alt={item.titulo} 
                  />
                </a>
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
};

export default Multimedia;