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

    // 1. Obtener todas las rutinas del usuario
    const { data: rutinas, error: errorRutinas } = await supabase
        .from("rutinas")
        .select("id, nombre")
        .eq("user_id", user.id);

    if (errorRutinas || !rutinas || rutinas.length === 0) {
        alert("No tienes rutinas creadas.");
        return;
    }

    // 2. Lógica flexible: Buscar una rutina que contenga parte del nombre del músculo
    // Esto funciona para "pecho", "Pecho", "pecho y triceps", etc.
    const rutinaEncontrada = rutinas.find(r => 
        r.nombre.toLowerCase().includes(ejercicio.musculo.toLowerCase())
    );

    if (!rutinaEncontrada) {
        alert(`No encontramos una rutina para el músculo: ${ejercicio.musculo}. Tienes rutinas llamadas: ${rutinas.map(r => r.nombre).join(", ")}`);
        return;
    }

    // 3. Conteo seguro (sin errores 406)
    const { count, error: errorCount } = await supabase
        .from("rutina_ejercicios")
        .select("id", { count: "exact" })
        .eq("rutina_id", rutinaEncontrada.id);

    const nuevoOrden = (count || 0) + 1;

    // 4. Insertar
    const { error: errorInsert } = await supabase
        .from("rutina_ejercicios")
        .insert({
            rutina_id: rutinaEncontrada.id, 
            ejercicio_id: ejercicio.id,
            orden: nuevoOrden
        });

    if (errorInsert) {
        alert("Error al guardar: " + errorInsert.message);
    } else {
        alert(`¡"${ejercicio.ejercicio}" agregado a "${rutinaEncontrada.nombre}"!`);
    }
}

    return (
        <div className="container mt-4 ">
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