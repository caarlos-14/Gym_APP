"use client"

import { useState, useEffect } from "react"
import { useRutinaDia } from "@/hooks/useRutinaDia"
import { createClient } from "@/utils/supabase/client"

const Registro_Ejercicio = () => {
    const diaActual = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const { rutina, loading } = useRutinaDia(diaActual)
    const [ejercicios, setEjercicios] = useState<any[]>([])
    const [indiceEjercicio, setIndiceEjercicio] = useState(0)
    const ejercicioActual = ejercicios[indiceEjercicio]
    const [peso, setPeso] = useState("")
    const [repeticiones, setRepeticiones] = useState("")
    const [seriesAgregadas, setSeriesAgregadas] = useState<any[]>([])
    const [confirmando, setConfirmando] = useState(false)
    const [ejercicioAGuardar, setEjercicioAGuardar] = useState<any>(null)
    const [nota, setNota] = useState("");

    useEffect(() => {
        if (rutina) setEjercicios(rutina.ejercicios)
    }, [rutina])

    const agregarSerie = () => {
        if (!peso || !repeticiones) return
        setSeriesAgregadas(prev => [...prev, { peso, repeticiones }])
        setPeso("")
        setRepeticiones("")
    }

    const guardar = async () => {
        if (seriesAgregadas.length === 0) return
        if (!ejercicioAGuardar) return

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        for (let i = 0; i < seriesAgregadas.length; i++) {
            await supabase.from("Registro").insert({
                ejercicio_id: ejercicioAGuardar.id,
                uuid: user?.id,
                series: i + 1,
                peso: seriesAgregadas[i].peso,
                repeticiones: seriesAgregadas[i].repeticiones
            })
        }

        setSeriesAgregadas([])
        setEjercicioAGuardar(null)
        window.location.reload()
    }

    const handleGuardarClick = () => {
        if (seriesAgregadas.length === 0) return
        if (!ejercicioActual) return
        setEjercicioAGuardar(ejercicioActual)
        setConfirmando(true)
    }

    return (
        <div style={{
            background: "var(--bs-body-bg)",
            border: "1px solid var(--bs-border-color)",
            borderRadius: "12px",
            padding: "1.25rem",
            maxWidth: "480px",
            margin: "1rem auto"
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                <div style={{
                    width: "36px", height: "36px",
                    background: "var(--bs-secondary-bg)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", color: "var(--bs-secondary-color)"
                }}>
                    <i className="bi bi-activity"></i>
                </div>
                <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "15px" }}>Registro ejercicio</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--bs-secondary-color)" }}>
                        {ejercicioActual ? `Ejercicio ${indiceEjercicio + 1} de ${ejercicios.length}` : "Carga tu rutina para comenzar"}
                    </p>
                </div>
            </div>

            {/* Ejercicio actual + navegación */}
            <div id="registrar_ejercicio" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "var(--bs-secondary-bg)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "1.25rem"
            }}>
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    {ejercicioActual?.ejercicio || "Sin ejercicio seleccionado"}
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                    <button
                        onClick={() => setIndiceEjercicio(prev => (prev - 1 + ejercicios.length) % ejercicios.length)}
                        style={{
                            width: "28px", height: "28px",
                            border: "1px solid var(--bs-border-color)",
                            borderRadius: "6px",
                            background: "var(--bs-body-bg)",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <i className="bi bi-chevron-left" style={{ fontSize: "13px" }}></i>
                    </button>
                    <button
                        onClick={() => setIndiceEjercicio(prev => (prev + 1) % ejercicios.length)}
                        style={{
                            width: "28px", height: "28px",
                            border: "1px solid var(--bs-border-color)",
                            borderRadius: "6px",
                            background: "var(--bs-body-bg)",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <i className="bi bi-chevron-right" style={{ fontSize: "13px" }}></i>
                    </button>
                </div>
            </div>

            {/* Lista de series guardadas */}
            {seriesAgregadas.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                    {seriesAgregadas.map((serie, index) => (
                        <div key={index} style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "6px 0",
                            borderBottom: "1px solid var(--bs-border-color)",
                            fontSize: "13px"
                        }}>
                            <div style={{
                                width: "22px", height: "22px", borderRadius: "50%",
                                background: "var(--bs-secondary-bg)",
                                border: "1px solid var(--bs-border-color)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "11px", fontWeight: 500,
                                color: "var(--bs-secondary-color)", flexShrink: 0
                            }}>
                                {index + 1}
                            </div>
                            <span>{serie.peso} <span style={{ fontSize: "11px", color: "var(--bs-secondary-color)" }}>kg</span></span>
                            <span style={{ color: "var(--bs-border-color)" }}>·</span>
                            <span>{serie.repeticiones} <span style={{ fontSize: "11px", color: "var(--bs-secondary-color)" }}>reps</span></span>
                        </div>
                    ))}
                </div>
            )}

            {/* Inputs nueva serie */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "12px", color: "var(--bs-secondary-color)" }}>
                        Peso · set {seriesAgregadas.length + 1}
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="kg"
                        value={peso}
                        onChange={e => setPeso(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "12px", color: "var(--bs-secondary-color)" }}>
                        Repeticiones · set {seriesAgregadas.length + 1}
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="reps"
                        value={repeticiones}
                        onChange={e => setRepeticiones(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "1rem" }}>
                    <label style={{ fontSize: "12px", color: "var(--bs-secondary-color)" }}>
                    Notas adicionales (opcional)
                    </label>
                    <textarea
                    className="form-control form-control-sm"
                    placeholder="Ej: Sentí molestias en la muñeca..."
                    value={nota}
                    onChange={e => setNota(e.target.value)}
                    rows={2}
                    />
                </div>
            </div>

            {/* Botones */}
            <div style={{ display: "flex", gap: "8px" }}>
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    onClick={agregarSerie}
                >
                    <i className="bi bi-plus"></i> Agregar serie
                </button>
                <button
                    className="btn btn-dark btn-sm"
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    onClick={handleGuardarClick}
                >
                    <i className="bi bi-floppy"></i> Guardar
                </button>
            </div>

            {/* Confirmación */}
            {confirmando && (
                <div style={{
                    marginTop: "1rem",
                    background: "var(--bs-warning-bg-subtle)",
                    border: "1px solid var(--bs-warning-border-subtle)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px"
                }}>
                    <span style={{ fontSize: "13px", color: "var(--bs-warning-text-emphasis)", flex: 1 }}>
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        ¿Guardar {seriesAgregadas.length} serie(s) de <strong>{ejercicioAGuardar?.ejercicio}</strong>?
                    </span>
                    <div style={{ display: "flex", gap: "6px" }}>
                        <button
                            className="btn btn-dark btn-sm"
                            onClick={() => { setConfirmando(false); guardar() }}
                        >
                            Confirmar
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => { setConfirmando(false); setEjercicioAGuardar(null) }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Registro_Ejercicio