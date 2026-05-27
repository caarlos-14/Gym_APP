"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

const Rutina = () => {
    const [diaActivo, setDiaActivo] = useState<number | null>(null)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [nombreRutina, setNombreRutina] = useState("")
    const [rutinas, setRutinas] = useState<any[]>([])

    useEffect(() => {
        document.body.style.overflow = modalAbierto ? "hidden" : "auto"
    }, [modalAbierto])

    useEffect(() => {
        async function fetchRutina() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            const { data } = await supabase.from("rutinas").select("*").eq("user_id", user?.id)
            if (data) setRutinas(data)
        }
        fetchRutina()
    }, [])

    async function eliminarRutina() {
        if (diaActivo === null) return
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from("rutinas").delete().eq("user_id", user?.id).eq("dia_semana", diaActivo)
        setRutinas(rutinas.filter(r => r.dia_semana !== diaActivo))
        setModalAbierto(false)
    }

    async function guardarRutina() {
        if (diaActivo === null) return
        const supabase = createClient()

        if (!nombreRutina.trim()) {
            await eliminarRutina()
            setNombreRutina("")
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        const rutinaExistente = rutinas.find(r => r.dia_semana === diaActivo)

        await supabase.from("rutinas").upsert({
            ...(rutinaExistente && { id: rutinaExistente.id }),
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
        <>
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">

                    {/* Header */}
                    <div className="px-4 pt-4 pb-3 border-bottom">
                        <h5 className="fw-semibold mb-1">Rutina Semanal</h5>
                        <p className="text-secondary mb-0" style={{ fontSize: "13px" }}>
                            Toca un día para configurar tu rutina
                        </p>
                    </div>

                    {/* Lista de días */}
                    <div className="p-3 d-flex flex-column gap-2">
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
                                    className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 border border-transparent"
                                    style={{ cursor: "pointer", transition: "background 0.15s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    {/* Dot indicador */}
                                    <span
                                        className="rounded-circle flex-shrink-0"
                                        style={{
                                            width: 8,
                                            height: 8,
                                            background: rutinaExistente ? "#1D9E75" : "#dee2e6",
                                            display: "inline-block"
                                        }}
                                    />

                                    {/* Nombre del día */}
                                    <span className="fw-medium flex-grow-1" style={{ fontSize: "14px" }}>
                                        {dia}
                                    </span>

                                    {/* Badge */}
                                    {rutinaExistente ? (
                                        <span
                                            className="badge rounded-pill fw-medium"
                                            style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: "12px" }}
                                        >
                                            {rutinaExistente.nombre}
                                        </span>
                                    ) : (
                                        <span
                                            className="badge rounded-pill fw-normal text-secondary border"
                                            style={{ background: "#f8f9fa", fontSize: "12px" }}
                                        >
                                            Sin rutina
                                        </span>
                                    )}

                                    {/* Chevron */}
                                    <span className="text-secondary" style={{ fontSize: "18px", lineHeight: 1 }}>›</span>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>

            {/* Modal */}
            {modalAbierto && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(0,0,0,0.45)", zIndex: 1055 }}
                    onClick={() => setModalAbierto(false)}
                >
                    <div
                        className="bg-white rounded-4 overflow-hidden"
                        style={{ width: "90%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
                            <h6 className="fw-semibold mb-0">
                                Rutina del {dias[diaActivo!]}
                            </h6>
                            <button
                                className="btn btn-sm btn-light rounded-3 border p-1 lh-1"
                                style={{ width: 28, height: 28, fontSize: 14 }}
                                onClick={() => setModalAbierto(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-4 py-3">
                            <label
                                className="text-uppercase text-secondary fw-semibold mb-2 d-block"
                                style={{ fontSize: 11, letterSpacing: "0.06em" }}
                            >
                                Nombre de la rutina
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                placeholder="Ej: Pecho y Tríceps"
                                value={nombreRutina}
                                onChange={e => setNombreRutina(e.target.value)}
                                style={{ fontSize: 14 }}
                            />
                        </div>

                        {/* Modal footer */}
                        <div className="d-flex gap-2 justify-content-end px-4 py-3 border-top">
                            <button
                                className="btn btn-light btn-sm rounded-3 border"
                                onClick={() => setModalAbierto(false)}
                            >
                                Cerrar
                            </button>
                            <button
                                className="btn btn-sm rounded-3"
                                style={{ background: "#FCEBEB", color: "#A32D2D", border: "1px solid #F7C1C1" }}
                                onClick={eliminarRutina}
                            >
                                Eliminar
                            </button>
                            <button
                                className="btn btn-dark btn-sm rounded-3"
                                onClick={guardarRutina}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Rutina