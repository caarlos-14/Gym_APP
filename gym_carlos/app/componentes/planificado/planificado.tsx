"use client"

import Link from "next/link"
import { useRutinaDia } from "@/hooks/useRutinaDia"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

const Planificado = () => {
    const diaActual = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const { rutina, loading } = useRutinaDia(diaActual)
    const [indiceEjercicio, setIndiceEjercicio] = useState(0)
    const [ejercicios, setEjercicios] = useState<any[]>([])
    const ejercicioActual = ejercicios[indiceEjercicio]

    useEffect(() => {
        if (rutina) setEjercicios(rutina.ejercicios)
    }, [rutina])

    const borrarEjercicio = async () => {
        const idRelacion = ejercicios[indiceEjercicio]?.id_relacion
        if (!idRelacion) { alert("Error: id_relacion no encontrado."); return }

        const supabase = createClient()
        const { error } = await supabase.from("rutina_ejercicios").delete().eq("id", idRelacion)

        if (error) {
            alert("Error al borrar: " + error.message)
        } else {
            setEjercicios(prev => {
                const nuevos = prev.filter((_, i) => i !== indiceEjercicio)
                if (indiceEjercicio >= nuevos.length) setIndiceEjercicio(Math.max(0, nuevos.length - 1))
                return nuevos
            })
        }
    }

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

    const dificultadColor: Record<string, { bg: string; color: string }> = {
        principiante: { bg: "#E1F5EE", color: "#0F6E56" },
        intermedio:   { bg: "#FFF3CD", color: "#856404" },
        avanzado:     { bg: "#FCEBEB", color: "#A32D2D" },
    }
    const dif = (d: string) => dificultadColor[d?.toLowerCase()] ?? { bg: "#f0f0f0", color: "#555" }

    return (
        <div className="container mt-4" style={{ paddingBottom: 80 }}>

            {/* Cabecera */}
            <div className="mb-4">
                <h4 className="fw-semibold mb-1">Hoy — {dias[diaActual]}</h4>
                <p className="text-secondary mb-0" style={{ fontSize: 13 }}>
                    {loading ? "Cargando rutina..." : rutina ? `Rutina: ${rutina.nombre}` : "Sin rutina asignada para hoy"}
                </p>
            </div>

            {/* Estado: cargando */}
            {loading && (
                <div className="text-center py-5 text-secondary">
                    <div className="spinner-border spinner-border-sm mb-2" role="status" />
                    <p className="mb-0" style={{ fontSize: 14 }}>Cargando ejercicios...</p>
                </div>
            )}

            {/* Estado: sin rutina */}
            {!loading && (!rutina || ejercicios.length === 0) && (
                <div className="text-center py-5 text-secondary">
                    <i className="bi bi-calendar-x" style={{ fontSize: 36 }}></i>
                    <p className="mt-2 mb-0" style={{ fontSize: 14 }}>No hay ejercicios planificados para hoy</p>
                </div>
            )}

            {/* Tarjeta principal */}
            {!loading && rutina && ejercicioActual && (
                <div className="card border rounded-4 overflow-hidden">

                    {/* Imagen */}
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ background: "#f8f9fa", height: 220, position: "relative" }}
                    >
                        {/* Badge músculo */}
                        <span
                            className="position-absolute badge rounded-pill fw-medium text-capitalize"
                            style={{ top: 12, left: 12, background: "#111", color: "#fff", fontSize: 11 }}
                        >
                            {ejercicioActual.musculo}
                        </span>

                        {/* Badge dificultad */}
                        <span
                            className="position-absolute badge rounded-pill fw-medium text-capitalize"
                            style={{
                                top: 12, right: 12,
                                fontSize: 11,
                                background: dif(ejercicioActual.dificultad).bg,
                                color: dif(ejercicioActual.dificultad).color
                            }}
                        >
                            {ejercicioActual.dificultad}
                        </span>

                        <img
                            src={ejercicioActual.imagen}
                            alt={ejercicioActual.ejercicio}
                            style={{ maxHeight: 180, maxWidth: "80%", objectFit: "contain" }}
                        />
                    </div>

                    {/* Info + navegación */}
                    <div className="card-body px-4 py-3">
                        <div className="d-flex align-items-center justify-content-between gap-3">

                            {/* Flecha izquierda */}
                            <button
                                className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: 40, height: 40 }}
                                onClick={() => setIndiceEjercicio(prev => (prev - 1 + ejercicios.length) % ejercicios.length)}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            {/* Nombre + contador */}
                            <div className="text-center flex-grow-1">
                                <h6 className="fw-semibold mb-1" style={{ fontSize: 16 }}>
                                    {ejercicioActual.ejercicio}
                                </h6>
                                <span className="text-secondary" style={{ fontSize: 12 }}>
                                    {indiceEjercicio + 1} / {ejercicios.length}
                                </span>
                            </div>

                            {/* Flecha derecha */}
                            <button
                                className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: 40, height: 40 }}
                                onClick={() => setIndiceEjercicio(prev => (prev + 1) % ejercicios.length)}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                        {/* Indicadores de posición */}
                        <div className="d-flex justify-content-center gap-1 mt-3">
                            {ejercicios.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndiceEjercicio(i)}
                                    className="border-0 p-0 rounded-pill"
                                    style={{
                                        width: i === indiceEjercicio ? 20 : 6,
                                        height: 6,
                                        background: i === indiceEjercicio ? "#111" : "#dee2e6",
                                        transition: "all 0.2s",
                                        cursor: "pointer"
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Footer con acciones */}
                    <div className="px-4 py-3 border-top d-flex gap-2">
                        <button className="btn btn-light btn-sm rounded-3 border flex-grow-1">
                            <i className="bi bi-box-arrow-up-right me-1"></i> Ver detalle
                        </button>
                        <Link
                            href="Ejercicios#registrar_ejercicio"
                            className="btn btn-sm rounded-3 flex-grow-1 fw-medium"
                            style={{ background: "#111", color: "#fff", border: "none" }}
                        >
                            <i className="bi bi-save me-1"></i> Registrar
                        </Link>
                        <button
                            className="btn btn-sm rounded-3 flex-shrink-0"
                            style={{ background: "#FCEBEB", color: "#A32D2D", border: "1px solid #F7C1C1" }}
                            onClick={borrarEjercicio}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Planificado