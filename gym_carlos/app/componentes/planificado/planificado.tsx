"use client"

import Link from "next/link"
import Image from "next/image"
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
    // ESTA LÍNEA ES LA CLAVE
    console.log("Índice actual:", indiceEjercicio);
    console.log("Objeto del ejercicio en ese índice:", ejercicios[indiceEjercicio]);

    const idRelacion = ejercicios[indiceEjercicio]?.id_relacion; 

    if (!idRelacion) {
        alert("Error: id_relacion no encontrado. Mira la consola (F12).");
        return;
    }

    const supabase = createClient();
    
    // 2. Borrado directo en la tabla puente
    const { error } = await supabase
        .from("rutina_ejercicios")
        .delete()
        .eq("id", idRelacion);

    if (error) {
        console.error("Error de Supabase:", error);
        alert("Error al borrar: " + error.message);
    } else {
        // 3. Eliminación exitosa: actualizamos el estado local
        setEjercicios(prev => {
            const nuevosEjercicios = prev.filter((_, i) => i !== indiceEjercicio);
            
            // Ajuste seguro de índice para que no se quede en el vacío
            if (indiceEjercicio >= nuevosEjercicios.length) {
                setIndiceEjercicio(Math.max(0, nuevosEjercicios.length - 1));
            }
            
            return nuevosEjercicios;
        });
    }
};

    return (
        <div className="container-fluid" style={{ paddingBottom: "20px" }} >
            <div className="row">
                <div className="card col-12">
                    <h5 className="card-title mt-3">Ejercicios planificados para hoy</h5>
                    {loading ? (
                        <p className="text-muted">Cargando...</p>
                    ) : rutina && ejercicioActual ? (
            
            <div className="d-flex tarjeta align-items-center rounded bg-light position-relative">
                    <div className="">
                            <span className="badge bg-primary position-absolute top-0 end-0 m-2">{indiceEjercicio + 1}/{ejercicios.length}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <i className="bi bi-chevron-left flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev - 1 + ejercicios.length) % ejercicios.length)}></i>
                        <div className="d-flex align-items-center gap-5 ">
                            <img
                            src={ejercicioActual.imagen}
                            alt={ejercicioActual.ejercicio}
                            style={{ width: 200, height: 150, objectFit: 'contain' }}
                            />
                            <span className="fw-medium">{ejercicioActual?.ejercicio}</span>
                    </div>
                         <i className="bi bi-chevron-right flecha fs-4" onClick={() => setIndiceEjercicio((prev) => (prev + 1) % ejercicios.length)}></i>
                    </div>
 
                     <span className="badge bg-secondary position-absolute top-0 start-0 m-2">{ejercicioActual?.musculo}</span>
                <div className="position-absolute end-0 bottom-0 d-flex gap-3 m-2">
                    <button className="btn btn-outline-primary btn-sm"><i className="bi bi-box-arrow-up-right"></i></button>
                    <button className="btn btn-outline-danger btn-sm " onClick={borrarEjercicio}>
                        <i className="bi bi-trash"></i>
                    </button>
                    <Link href="Ejercicios#registrar_ejercicio" className="d-flex align-items-center btn btn-outline-success btn-sm ">
                        <i className="bi bi-save"></i>
                    </Link>
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

