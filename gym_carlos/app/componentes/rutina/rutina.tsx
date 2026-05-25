"use client"

import { useState,useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const Rutina = () => {

    const [diaActivo, setDiaActivo] = useState<number | null>(null)
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const [modalAbierto, setModalAbierto] = useState(false)
    const [nombreRutina, setNombreRutina] = useState("")
    const [rutinas, setRutinas] = useState<any[]>([])
    
    useEffect(() => {
        async function fetchRutina() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            const {data} = await supabase
            .from("rutinas")
            .select("*")
            .eq("user_id", user?.id)
        if (data) setRutinas(data)
        }
        fetchRutina()
    },[])

    async function eliminarRutina() {
        if (!diaActivo) return
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from("rutinas").delete().eq("user_id", user?.id).eq("dia_semana", diaActivo)
        setRutinas(rutinas.filter(r => r.dia_semana !== diaActivo))
    }

    async function guardarRutina() {
        const supabase = createClient()
        const {data:{user}} = await supabase.auth.getUser()

        await supabase.from("rutinas").insert({
            nombre: nombreRutina,
            dia_semana: diaActivo,
            user_id: user?.id
        })
        setModalAbierto(false)
            setNombreRutina("")

        const { data } = await supabase.from("rutinas").select("*").eq("user_id", user?.id)
        if (data) setRutinas(data)
    }
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Rutina Semanal</h5>
                <p className="card-text">Aquí puedes ver tu rutina semanal, agregar ejercicios a cada día y gestionar tu planificación.</p>
                <div className="d-flex flex-column justify-content-between gap-3">
                        {dias.map((dia,index) => {
                        const rutinaExistente = rutinas.find(r => r.dia_semana === index)
                        return(
                        <div key={index} onClick={() => {setDiaActivo(index) 
                        setModalAbierto(true)
                        setNombreRutina(rutinaExistente?.nombre || "")}} className="bg-dark rounded p-3 d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <h6 className="card-subtitle text-white">{dia}</h6>
                        <span className="badge bg-white text-dark p-2">{rutinaExistente?.nombre || "Sin Rutina Configurada"}</span>
                        </div>
                        );
                        })}
                </div>
            </div>
        {modalAbierto && (
            <div className="modal d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Rutina del {dias[diaActivo!]}</h5>
                            <button type="button" className="btn-close" onClick={() => setModalAbierto(false)}></button>
                        </div>
                        <div className="modal-body">
                            <label className="form-label">Nombre de la Rutina</label>
                            <input type="text" className="form-control" value={nombreRutina} onChange={(e) => setNombreRutina(e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cerrar</button>
                            <button type="button" className="btn btn-danger" onClick={eliminarRutina}>Eliminar</button>
                            <button type="button" className="btn btn-primary" onClick={guardarRutina}>Guardar Rutina</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}
export default Rutina