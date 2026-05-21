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
<h4 className=" ms-2 mb-4">Contenidos Multimedia</h4>
<div className="row mb-4" style={{ paddingBottom: "50px", overflowX: "auto" }}>
  <div className="d-flex gap-2" style={{ width: 'max-content' }}>
    {contenidos.map((contenido, index) => (
      <div className="ms-2" key={index} style={{ width: '100%', flexShrink: 0 }}>
        <h3 style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {contenido.titulo}
        </h3>
        <a href={contenido.url} target="_blank" rel="noopener noreferrer">
          <img style={{ width: '100%', height: '195px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} src={getMultimedia(contenido.url)} alt={contenido.titulo} />
        </a>
      </div>
    ))}
  </div>
</div>
</>
)

}
export default Multimedia;