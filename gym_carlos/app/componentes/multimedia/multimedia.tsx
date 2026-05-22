"use client"
import {useState, useEffect} from "react"
import { createClient } from "@/utils/supabase/client"

const Multimedia = () => {
const [contenidos, setContenidos] = useState<{url: string; titulo: string}[]>([])
const supabase = createClient()

function getMultimedia(url: string) {
    const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    const videoId = match ? match[1] : null;

    return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : '/placeholder.jpg';  
}

useEffect(() => {
    async function fetchContenidos() {
        const { data, error } = await supabase
        .from('recursos_media')
        .select('url, titulo')
        .order ('created_at', { ascending: false })
        .limit(8)

        if(!error && data){ setContenidos(data)}
    }
    fetchContenidos()
}, [])

return (
<>
<h4 className="ms-2 mb-4">Contenidos Multimedia</h4>
<div className="row mb-4" style={{ paddingBottom: "100px", overflowX: "auto" }}>
  <div className="d-flex position-relative" style={{ width: 'max-content' }}>
    {contenidos.map((contenido, index) => (
      <div className="ms-2" key={index} style={{ width: '220px', flexShrink: 0 }}>
        <h3 style={{ fontSize: '12px', overflow: 'hidden'}}>
          {contenido.titulo}
        </h3>
        <div className="position-relative">
        <a href={contenido.url} target="_blank" rel="noopener noreferrer">
          <img style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '8px', display: 'block' }} src={getMultimedia(contenido.url)} alt={contenido.titulo} />
        </a>
        <button className="btn btn-success position-absolute top-0 start-0"><i className="bi bi-check-circle-fill"></i></button>
        <button className="btn btn-danger position-absolute top-0 end-0"><i className="bi bi-x-circle-fill"></i></button>
        </div>

    </div>
    ))}
  </div>
</div>
</>
)

}
export default Multimedia;