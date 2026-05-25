"use client"
import { useState,useEffect } from "react";
import {createClient} from "@/utils/supabase/client";
const Ejercicios = () => {
const [ejercicios, setEjercicios] = useState<any[]>([]);
const [filtro, setFiltro] = useState("");
const supabase = createClient();

useEffect(() => {
    async function fetchEjercicios(){
        const query = supabase.from("ejercicios").select("*");

        const {data,error} = filtro ? await query.eq("musculo",filtro) : await query;
        if(!error && data) setEjercicios(data);
    }
    fetchEjercicios()
},[filtro]);

async function agregarEjercicio(ejercicio: any) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        alert("Debes iniciar sesión.");
        return;
    }

    // CAMBIO 1: Buscamos por "nombre" en lugar de "musculo"
    // Asegúrate de que el nombre que buscas (ejercicio.musculo o el que prefieras) 
    // exista en la columna 'nombre' de tu tabla 'rutinas'
    const { data: rutina, error: errorRutina } = await supabase
        .from("rutinas")
        .select("id")
        .eq("user_id", user.id)
        .ilike("nombre", ejercicio.musculo) // <--- AQUÍ CAMBIA 'musculo' POR 'nombre'
        .single();

    if (errorRutina || !rutina) {
        // CAMBIO 2: Ajusta el mensaje para que sea coherente
        alert(`No tienes una rutina con el nombre: ${ejercicio.musculo}`);
        return;
    }

    // El resto de la función se mantiene igual
    const { count } = await supabase
        .from("rutina_ejercicios")
        .select("*", { count: "exact", head: true })
        .eq("rutina_id", rutina.id);

    const { error } = await supabase
        .from("rutina_ejercicios")
        .insert({
            rutina_id: rutina.id, 
            ejercicio_id: ejercicio.id,
            orden: (count || 0) + 1
        });

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        alert(`¡Ejercicio "${ejercicio.ejercicio}" agregado a la rutina: ${ejercicio.musculo}!`);
    }
}

    return (
        <div className="container mt-4 " style={{ paddingBottom: "300px" }}>
            <h2>Ejercicios</h2>
            <p>Aquí puedes ver y gestionar tus ejercicios, Ademas de poder agregarlos a tu planificación semanal.</p>
                <div className="d-flex gap-2 mb-3">
                    <button className=" w-100 btn btn-sm btn-outline-secondary" onClick={() => setFiltro("")}>
                        <i className="bi bi-arrow-clockwise"></i> Limpiar Filtro
                    </button>
                    <select value={filtro} className="form-select" onChange={(e) => setFiltro(e.target.value)}>
                        <option value="" disabled>Seleccione Músculo</option>
                        <option value="hombros">Hombros</option>
                        <option value="triceps">Triceps</option>
                        <option value="biceps">Biceps</option>
                        <option value="pecho">Pecho</option>
                        <option value="espalda">Espalda</option>
                        <option value="piernas">Piernas</option>
                        <option value="abdomen">Abdomen</option>\
                        <option value="antebrazo">Antebrazo</option>
                    </select>
                 </div>
            <div className="row">
                {filtro !== "" && ejercicios.length === 0 && <p className="text-muted text-center mt-3">No se encontraron ejercicios para esta zona muscular.</p>}
                {filtro && ejercicios.map((ejercicio,index) =>(
                    <div key={index}>
                        <div className="card mb-3">
                                <div className="card-body d-flex align-items-center position-relative ">
                                    <img style={{ width: '150px', height: '150px', objectFit: 'contain' }} src={ejercicio.imagen} className="card-img-top" alt={ejercicio.ejercicio} />
                                    <div className="d-flex flex-column">
                                    <h6 className="card-title">{ejercicio.ejercicio}</h6>
                                    <p className="card-text descripcion_cards">{ejercicio.descripcion}</p>
                                    <div className="position-absolute top-0 start-0 ms-1">
                                        <span className="badge bg-primary">{ejercicio.dificultad}</span>
                                    </div>
                                    <div className="d-flex gap-2 justify-content-between align-items-center">
                                    <button 
                                        className="btn btn-sm btn-outline-success" 
                                        onClick={() => agregarEjercicio(ejercicio)} // PASAMOS EL OBJETO ENTERO
                                    >
                                        Agregar <i className="bi bi-arrow-right-circle"></i>
                                    </button>
                                        <button className="btn btn-sm btn-outline-primary"><i className="bi bi-info-circle"></i></button>
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
export default Ejercicios;