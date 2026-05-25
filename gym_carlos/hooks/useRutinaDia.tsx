'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"

export type Ejercicio = {
    id: number;
    id_relacion: number; // Ahora incluimos este ID para el borrado
    ejercicio: string;
    musculo: string;
    registros: {
        id: number;
        series: number;
        repeticiones: number;
        peso: number;
        notas: string;
    }[];
}

export type Rutina = {
    id: string;
    nombre: string;
    dia_semana: number;
    ejercicios: Ejercicio[];
}

export function useRutinaDia(dia_semana: number) {
    const [rutina, setRutina] = useState<Rutina | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        async function fetchRutina() {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            
            const { data: rutinaData, error } = await supabase
                .from("rutinas")
                .select(`
                    id, nombre, dia_semana,
                    rutina_ejercicios (
                        id,
                        ejercicio_id,
                        ejercicios!rutina_ejercicios_ejercicio_id_fkey (id, ejercicio, musculo)
                    )
                `)
                .eq("dia_semana", dia_semana)
                .eq("user_id", user?.id)
                .maybeSingle();

            if (!rutinaData || !rutinaData.rutina_ejercicios) {
                setRutina(null);
                setLoading(false);
                return;
            }

            // 1. Aplanamos la estructura manteniendo el ID de la relación (el 37)
            const ejerciciosConRelacion = rutinaData.rutina_ejercicios.map((re: any) => ({
                ...re.ejercicios,       // Propiedades: id (del ejercicio), ejercicio, musculo
                id_relacion: re.id      // ID de la tabla rutina_ejercicios (el 37)
            }));

            // 2. Extraemos los IDs de la tabla 'ejercicios' para buscar registros
            const ejercicioIds = ejerciciosConRelacion.map((e: any) => e.id);

            const { data: registros } = await supabase
                .from("Registro")
                .select("id, ejercicio_id, series, repeticiones, peso, notas")
                .in("ejercicio_id", ejercicioIds)
                .eq("uuid", user?.id)
                .order("created_at", { ascending: true });

            // 3. Unimos los registros con los ejercicios, conservando id_relacion
            const ejerciciosConRegistros: Ejercicio[] = ejerciciosConRelacion.map((ej: any) => ({
                ...ej,
                registros: registros?.filter(r => r.ejercicio_id === ej.id) ?? []
            }));

            setRutina({ 
                ...rutinaData, 
                ejercicios: ejerciciosConRegistros 
            });
            setLoading(false);
        }

        fetchRutina();
    }, [dia_semana]);

    return { rutina, loading }
}