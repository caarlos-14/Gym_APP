'use client'

import { useState, useEffect } from "react";
import {createClient} from "@/utils/supabase/client"

export type Ejercicio = {
    id: number;
    ejercicio: string;
    series: number;
    repeticiones: number;
    peso: number;
    rpe: number;
    notas: string;
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
        // Comprueba el usuario activo
        const { data: { user } } = await supabase.auth.getUser()
        console.log("usuario:", user)

        setLoading(true);
        const {data, error} = await supabase
            .from("rutinas")
            .select("id, nombre, dia_semana, ejercicios (id, ejercicio, series, repeticiones, peso, rpe, notas)")
            .eq("dia_semana", dia_semana)
            .maybeSingle();

        console.log("data:", data)
        console.log("error:", error)

        if (data) {
            setRutina(data);
        } else {
            setRutina(null);
        }
        setLoading(false);
    }
    fetchRutina();
}, [dia_semana]);
    return {rutina,loading}
}