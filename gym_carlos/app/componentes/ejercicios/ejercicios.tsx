"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

const musculos = ["hombros", "triceps", "biceps", "pecho", "espalda", "piernas", "abdomen", "antebrazo"]

const dificultadColor: Record<string, { bg: string; color: string }> = {
    principiante: { bg: "#E1F5EE", color: "#0F6E56" },
    intermedio:   { bg: "#FFF3CD", color: "#856404" },
    avanzado:     { bg: "#FCEBEB", color: "#A32D2D" },
}

const Ejercicios = () => {
    const [ejercicios, setEjercicios] = useState<any[]>([])
    const [filtro, setFiltro] = useState("")
    const supabase = createClient()

    useEffect(() => {
        async function fetchEjercicios() {
            const query = supabase.from("ejercicios").select("*")
            const { data, error } = filtro ? await query.eq("musculo", filtro) : await query
            if (!error && data) setEjercicios(data)
        }
        fetchEjercicios()
    }, [filtro])

    async function agregarEjercicio(ejercicio: any) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) { alert("Debes iniciar sesión."); return }

        const { data: rutinas, error: errorRutinas } = await supabase
            .from("rutinas").select("id, nombre").eq("user_id", user.id)

        if (errorRutinas || !rutinas || rutinas.length === 0) {
            alert("No tienes rutinas creadas."); return
        }

        const rutinaEncontrada = rutinas.find(r =>
            r.nombre.toLowerCase().includes(ejercicio.musculo.toLowerCase())
        )

        if (!rutinaEncontrada) {
            alert(`No hay rutina para: ${ejercicio.musculo}. Tienes: ${rutinas.map((r: any) => r.nombre).join(", ")}`)
            return
        }

        const { count } = await supabase
            .from("rutina_ejercicios").select("id", { count: "exact" })
            .eq("rutina_id", rutinaEncontrada.id)

        const { error: errorInsert } = await supabase.from("rutina_ejercicios").insert({
            rutina_id: rutinaEncontrada.id,
            ejercicio_id: ejercicio.id,
            orden: (count || 0) + 1
        })

        if (errorInsert) alert("Error al guardar: " + errorInsert.message)
        else alert(`"${ejercicio.ejercicio}" agregado a "${rutinaEncontrada.nombre}"`)
    }

    const dif = (d: string) => dificultadColor[d?.toLowerCase()] ?? { bg: "#f0f0f0", color: "#555" }

    return (
        <div className="container mt-4" style={{ paddingBottom: 80 }}>

            {/* Cabecera */}
            <div className="mb-4">
                <h4 className="fw-semibold mb-1">Ejercicios</h4>
                <p className="text-secondary mb-0" style={{ fontSize: 13 }}>
                    Explora el catálogo y agrégalos a tu planificación semanal.
                </p>
            </div>

            {/* Filtros */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setFiltro("")}
                    className={`btn btn-sm rounded-pill px-3 ${filtro === "" ? "btn-dark" : "btn-outline-secondary"}`}
                    style={{ fontSize: 13 }}
                >
                    Todos
                </button>
                {musculos.map(m => (
                    <button
                        key={m}
                        onClick={() => setFiltro(m)}
                        className={`btn btn-sm rounded-pill px-3 text-capitalize ${filtro === m ? "btn-dark" : "btn-outline-secondary"}`}
                        style={{ fontSize: 13 }}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Estado vacío */}
            {filtro !== "" && ejercicios.length === 0 && (
                <div className="text-center py-5 text-secondary">
                    <i className="bi bi-search" style={{ fontSize: 32 }}></i>
                    <p className="mt-2 mb-0" style={{ fontSize: 14 }}>Sin ejercicios para <strong>{filtro}</strong></p>
                </div>
            )}

            {/* Sin filtro seleccionado */}
            {filtro === "" && (
                <div className="text-center py-5 text-secondary">
                    <i className="bi bi-funnel" style={{ fontSize: 32 }}></i>
                    <p className="mt-2 mb-0" style={{ fontSize: 14 }}>Selecciona un grupo muscular para explorar ejercicios</p>
                </div>
            )}

            {/* Grid de tarjetas */}
            <div className="row g-3">
                {filtro && ejercicios.map((ejercicio, index) => (
                    <div key={index} className="col-12 col-md-6">
                        <div className="card border rounded-4 h-100" style={{ overflow: "hidden" }}>
                            <div className="card-body d-flex gap-3 p-3">

                                {/* Imagen */}
                                <div
                                    className="flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center"
                                    style={{ width: 110, height: 110, background: "#f8f9fa", overflow: "hidden" }}
                                >
                                    <img
                                        src={ejercicio.imagen}
                                        alt={ejercicio.ejercicio}
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                </div>

                                {/* Contenido */}
                                <div className="d-flex flex-column flex-grow-1 min-width-0">
                                    {/* Badge dificultad */}
                                    <div className="mb-1">
                                        <span
                                            className="badge rounded-pill fw-medium"
                                            style={{
                                                fontSize: 11,
                                                background: dif(ejercicio.dificultad).bg,
                                                color: dif(ejercicio.dificultad).color
                                            }}
                                        >
                                            {ejercicio.dificultad}
                                        </span>
                                    </div>

                                    {/* Nombre */}
                                    <h6 className="fw-semibold mb-1" style={{ fontSize: 14 }}>
                                        {ejercicio.ejercicio}
                                    </h6>

                                    {/* Descripción */}
                                    <p
                                        className="text-secondary mb-0 flex-grow-1"
                                        style={{
                                            fontSize: 12,
                                            lineHeight: 1.5,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {ejercicio.descripcion}
                                    </p>

                                    {/* Botones */}
                                    <div className="d-flex gap-2 mt-2">
                                        <button
                                            className="btn btn-sm rounded-3 fw-medium flex-grow-1"
                                            style={{ fontSize: 12, background: "#111", color: "#fff", border: "none" }}
                                            onClick={() => agregarEjercicio(ejercicio)}
                                        >
                                            Agregar <i className="bi bi-plus-circle"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-light rounded-3 border"
                                            style={{ fontSize: 12 }}
                                        >
                                            <i className="bi bi-info-circle"></i>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Ejercicios