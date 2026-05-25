"use client"

import "./planificado.css"
import { useRutinaDia } from "@/hooks/useRutinaDia"
import { createClient } from "@/utils/supabase/client"
import { useState,useEffect } from "react"

const Planificado = () => {
    const diaActual = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const { rutina, loading } = useRutinaDia(diaActual)
    const [indiceEjercicio, setIndiceEjercicio] = useState(0)
    const [ejercicios, setEjercicios] = useState<any[]>([])
    const ejercicioActual = ejercicios[indiceEjercicio]
    useEffect(() => {
        if(rutina){
            setEjercicios(rutina.ejercicios)
        }
    }, [rutina])

    const borrarEjercicio = async () => {
    if (indiceEjercicio >= ejercicios.length - 1)
        setIndiceEjercicio(Math.max(0, ejercicios.length - 2))
    setEjercicios(prev => prev.filter((_, i) => i !== indiceEjercicio))
    }

    return (
        <div className="container-fluid" style={{ paddingBottom: "20px" }} >
            <div className="row">
                <div className="card col-12">
                    <h5 className="card-title mt-3">Ejercicios planificados para hoy</h5>
                    {loading ? (
                        <p className="text-muted">Cargando...</p>
                    ) : rutina && ejercicioActual ? (
            
            <div className="d-flex tarjeta align-items-center rounded bg-light position-relative">
                <div className="p-3">
                        <div className="d-flex align-items-center gap-2 mb-1 ">
                            <i className="bi bi-chevron-left flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev - 1 + ejercicios.length) % ejercicios.length)}></i>
                            <span className="badge bg-primary">{indiceEjercicio + 1}/{ejercicios.length}</span>
                            <span className="fw-medium">{ejercicioActual?.ejercicio}</span>
                            <span className="badge bg-secondary position-absolute top-0 start-0 m-2">{ejercicioActual?.musculo}</span>
                        </div>
                    </div> 
                <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm"><i className="bi bi-box-arrow-up-right"></i></button>
                    <button className="btn btn-outline-danger btn-sm " onClick={borrarEjercicio}>
                        <i className="bi bi-trash"></i>
                    </button>
                    <i className="bi bi-chevron-right flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev + 1) % ejercicios.length)}></i>
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

