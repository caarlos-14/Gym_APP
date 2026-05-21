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
        <div className="container-fluid" style={{ paddingBottom: "40px" }} >
            <div className="row">
                <div className="card col-12">
                    <h5 className="card-title mt-3">Ejercicios planificados para hoy</h5>
                    {loading ? (
                        <p className="text-muted">Cargando...</p>
                    ) : rutina && ejercicioActual ? (
            <div className="d-flex flex-column gap-2">

                <div className="p-3 rounded bg-light">
                <div className="d-flex align-items-center gap-2 mb-1 position-relative">
                    <span className="badge bg-primary">{indiceEjercicio + 1}/{rutina.ejercicios.length}</span>
                    <span className="fw-medium">{ejercicioActual?.ejercicio}</span>
                <div className="ms-auto d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm"><i className="bi bi-box-arrow-up-right"></i></button>
                    <button className="btn btn-outline-danger btn-sm"><i className="bi bi-trash"></i> </button>
                </div>
                </div>
                <div className="d-flex justify-content-between align-items-center fs-2">
                    <i className="bi bi-chevron-left flecha" onClick={() => setIndiceEjercicio((prev) => (prev - 1 + rutina.ejercicios.length) % rutina.ejercicios.length)}></i>
                    <div className="d-flex gap-2 align-items-center">
                        <button className="btn btn-outline-primary btn-sm">
                            Agregar serie 
                        </button>
                        <button className="btn btn-outline-success btn-sm">
                            Registrar serie
                        </button>
                    </div>
                    <i className="bi bi-chevron-right flecha" onClick={() => setIndiceEjercicio((prev) => (prev + 1) % rutina.ejercicios.length)}></i>
                </div>
                  <div className="row">
                    <div className="col-6 col-md-3">
                      <label className="d-flex flex-column gap-1">Series:
                        <input type="text" className="form-control"  />
                    </label>
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="d-flex flex-column gap-1">Repeticiones:
                        <input type="text" className="form-control"  />
                    </label>
                    </div>
                    <div className="col-6 col-md-3">
                    <label className="d-flex flex-column gap-1">Peso (kg):
                        <input type="text" className="form-control"  />
                    </label>
                    </div>
                    <div className="col-6 col-md-3">
                    <label className="d-flex flex-column gap-1">RPE:
                        <input type="text" className="form-control"  />
                    </label>
                    </div>
                    <div className="col-12 ">
                    <label className="d-flex flex-column gap-1">Notas adicionales:
                        <textarea className="form-control form-control-sm" placeholder="Notas adicionales..." rows={2}></textarea>
                    </label>
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