"use client"

import "./planificado.css"
import { useRutinaDia } from "@/hooks/useRutinaDia"
import { useState } from "react"

const Planificado = () => {
    const diaActual = 1
    const { rutina, loading } = useRutinaDia(diaActual)
    const [indiceEjercicio, setIndiceEjercicio] = useState(0)
    const ejercicioActual = rutina?.ejercicios[indiceEjercicio]
    

    return (
        <div className="container-fluid" style={{ paddingBottom: "20px" }} >
            <div className="row">
                <div className="card col-12">
                    <h5 className="card-title mt-3">Ejercicios planificados para hoy</h5>
                    {loading ? (
                        <p className="text-muted">Cargando...</p>
                    ) : rutina && ejercicioActual ? (
            <div className="d-flex flex-column gap-2">

                <div className="p-3 rounded bg-light">
                <div className="d-flex align-items-center gap-2 mb-1 position-relative">
                    <i className="bi bi-chevron-left flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev - 1 + rutina.ejercicios.length) % rutina.ejercicios.length)}></i>
                    <span className="badge bg-primary">{indiceEjercicio + 1}/{rutina.ejercicios.length}</span>
                    <span className="fw-medium">{ejercicioActual?.ejercicio} | <span className="badge bg-secondary">{ejercicioActual?.musculo}</span></span>
                    
                <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm"><i className="bi bi-box-arrow-up-right"></i></button>
                    <button className="btn btn-outline-danger btn-sm"><i className="bi bi-trash"></i> </button>
                    <i className="bi bi-chevron-right flecha ms-5 fs-4" onClick={() => setIndiceEjercicio((prev) => (prev + 1) % rutina.ejercicios.length)}></i>
                </div>
                </div>

                </div>
            </div>
                    ) : (
                        <p className="text-muted">No hay rutina para hoy.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Planificado