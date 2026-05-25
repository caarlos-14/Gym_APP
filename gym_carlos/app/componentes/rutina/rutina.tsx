"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const Rutina = () => {
    const [diaActivo, setDiaActivo] = useState<number | null>(null)
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const [modalAbierto, setModalAbierto] = useState(false)
    const [nombreRutina, setNombreRutina] = useState("")
    const [rutinas, setRutinas] = useState<any[]>([])

    useEffect(() => {
        if (modalAbierto) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [modalAbierto])

    useEffect(() => {
        async function fetchRutina() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            const { data } = await supabase
                .from("rutinas")
                .select("*")
                .eq("user_id", user?.id)
            if (data) setRutinas(data)
        }
        fetchRutina()
    }, [])

    async function eliminarRutina() {
        // CORRECCIÓN: Control estricto de null para que el Lunes (0) se pueda borrar
        if (diaActivo === null) return 
        
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from("rutinas").delete().eq("user_id", user?.id).eq("dia_semana", diaActivo)
        setRutinas(rutinas.filter(r => r.dia_semana !== diaActivo))
        
        // UX: Cerramos el modal al eliminar de manera explícita
        setModalAbierto(false)
    }

    async function guardarRutina() {
        const supabase = createClient()

        if (diaActivo == null) return

        if (!nombreRutina.trim()) {
            await eliminarRutina()
            setNombreRutina("")
            // Quitamos el return colgado para asegurar que el modal se cierre si venía de aquí
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        
        // Buscamos si el día que estamos editando ya tenía una rutina guardada en el estado local
        const rutinaExistente = rutinas.find(r => r.dia_semana === diaActivo)

        // CAMBIO CLAVE: .upsert en lugar de .insert
        await supabase.from("rutinas").upsert({
            ...(rutinaExistente && { id: rutinaExistente.id }), // Si ya existía, pasamos su ID para sobreescribirla
            nombre: nombreRutina.trim(),
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
                    {dias.map((dia, index) => {
                        const rutinaExistente = rutinas.find(r => r.dia_semana === index)
                        return (
                            <div 
                                key={index} 
                                onClick={() => {
                                    setDiaActivo(index) 
                                    setModalAbierto(true)
                                    setNombreRutina(rutinaExistente?.nombre || "")
                                }} 
                                className="bg-dark rounded p-3 d-flex justify-content-between align-items-center" 
                                style={{ cursor: "pointer" }}
                            >
                                <h6 className="card-subtitle text-white">{dia}</h6>
                                <span className="badge bg-white text-dark p-2">
                                    {rutinaExistente?.nombre || "Sin Rutina Configurada"}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {modalAbierto && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rutina del {dias[diaActivo!]}</h5>
                                <button type="button" className="btn-close" onClick={() => setModalAbierto(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Nombre de la Rutina</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={nombreRutina} 
                                    onChange={(e) => setNombreRutina(e.target.value)} 
                                />
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