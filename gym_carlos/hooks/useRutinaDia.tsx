'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"

export type Ejercicio = {
    id: number;
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

    const { data: { user } } = await supabase.auth.getUser()
console.log("user:", user?.id)
    const { data: rutinaData, error } = await supabase
        .from("rutinas")
        .select(`
    id, nombre, dia_semana,
    rutina_ejercicios (
        ejercicio_id,
        ejercicios!rutina_ejercicios_ejercicio_id_fkey (id, ejercicio, musculo)
    )
`)
        .eq("dia_semana", dia_semana)
        .eq("user_id", user?.id)        // ✅ filtro por usuario
        .maybeSingle();

    console.log("rutina:", rutinaData, "error:", error)

    if (!rutinaData) {
        setRutina(null);
        setLoading(false);
        return;
    }

    // Aplanar la estructura rutina_ejercicios → ejercicios
    const ejercicios = rutinaData.rutina_ejercicios.map((re: any) => re.ejercicios)
    const ejercicioIds = ejercicios.map((e: any) => e.id)

    const { data: registros } = await supabase
        .from("Registro")
        .select("id, ejercicio_id, series, repeticiones, peso, notas")
        .in("ejercicio_id", ejercicioIds)
        .eq("uuid", user?.id)
        .order("created_at", { ascending: true })

    const ejerciciosConRegistros: Ejercicio[] = ejercicios.map((ej: any) => ({
        ...ej,
        registros: registros?.filter(r => r.ejercicio_id === ej.id) ?? []
    }))

    setRutina({ ...rutinaData, ejercicios: ejerciciosConRegistros });
    setLoading(false);
}

        fetchRutina();
    }, [dia_semana]);

    return { rutina, loading }
}