"use client"

import { useState, useEffect } from "react"
import { useRutinaDia } from "@/hooks/useRutinaDia"
import {createClient} from "@/utils/supabase/client"

const Registro_Ejercicio = () =>{
    const diaActual = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const { rutina, loading } = useRutinaDia(diaActual)
    const [ejercicios, setEjercicios] = useState<any[]>([])
    const [indiceEjercicio, setIndiceEjercicio] = useState(0)
    const ejercicioActual = ejercicios[indiceEjercicio]
    const [peso, setPeso] = useState("")
    const [repeticiones, setRepeticiones] = useState("")
    const [seriesAgregadas, setSeriesAgregadas] = useState<any[]>([])

    useEffect(() => {
        if (rutina) setEjercicios(rutina.ejercicios)
    }, [rutina])

const agregarSerie = () => {
    console.log("peso:", peso, "repeticiones:", repeticiones)
    if (!peso || !repeticiones) return
    setSeriesAgregadas(prev => [...prev, { peso, repeticiones }])
    setPeso("")
    setRepeticiones("")
}

const guardar = async () => {
    if (seriesAgregadas.length === 0) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    for (let i = 0; i < seriesAgregadas.length; i++) {
        await supabase.from("Registro").insert({
            ejercicio_id: ejercicioActual.id,
            uuid: user?.id,
            series: i + 1,
            peso: seriesAgregadas[i].peso,
            repeticiones: seriesAgregadas[i].repeticiones
        })
    }

    setSeriesAgregadas([])
    window.location.reload()
}
    return(
        <>
        <div className="container-fluid card">
            <div className="card-title mt-4">
                <h5 className="text-center">Registro Ejercicio</h5>
                <div className="card-body">
                        <div className="mt-1 mb-4">
                            <span>Ejercicio a registrar: <strong>{ejercicioActual?.ejercicio || "Cargando..."}</strong></span>
                        </div>
                    {seriesAgregadas.map((serie, index) => (
    <div key={index} className="row mb-2">
        <div className="d-flex flex-column col-6">
            <label>Peso Set {index + 1}</label>
            <input type="text" className="form-control" value={serie.peso} disabled />
        </div>
        <div className="d-flex flex-column col-6">
            <label>Repeticiones Set {index + 1}</label>
            <input type="text" className="form-control" value={serie.repeticiones} disabled />
        </div>
    </div>
))}
                    
    <div className="row">
    <div className="d-flex flex-column col-6">
        <label>Peso Set {seriesAgregadas.length + 1}</label>
        <input type="text" className="form-control" value={peso} onChange={(e) => setPeso(e.target.value)} />
    </div>
    <div className="d-flex flex-column col-6">
        <label>Repeticiones Set {seriesAgregadas.length + 1}</label>
        <input type="text" className="form-control" value={repeticiones} onChange={(e) => setRepeticiones(e.target.value)} />
    </div>
    <div className="d-flex flex-column col-8 mt-3">
        <button type="button" className="btn btn-secondary" onClick={agregarSerie}>Agregar Serie</button>
    </div>
    <div className="d-flex flex-column col-4 mt-3">
        <button className="btn btn-success" onClick={guardar}>Guardar</button>
    </div>
    </div>
                   
                    <div className="d-flex justify-content-between align-items-center gap-2 mt-3 ">
                            <i className="bi bi-chevron-left flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev - 1 + ejercicios.length) % ejercicios.length)}></i>
                            <i className="bi bi-chevron-right flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev + 1) % ejercicios.length)}></i>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}
export default Registro_Ejercicio