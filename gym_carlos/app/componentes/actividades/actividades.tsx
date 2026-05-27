'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRutinaDia } from '@/hooks/useRutinaDia'
import { createClient } from "@/utils/supabase/client";

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const DIAS_NOMBRE = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const supabase = createClient();
function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export default function RutinaSemanal() {
  const [diaActivo, setDiaActivo] = useState(getTodayIndex())
  const { rutina, loading } = useRutinaDia(diaActivo)

  // Función para eliminar
const eliminarSerie = async (id: string) => {
  if (!confirm("¿Seguro que quieres borrar esta serie?")) return;
  const { error } = await supabase.from("Registro").delete().eq("id", id);
  if (!error) window.location.reload(); // Recargamos para ver cambios
};


  return (
    <div className="card shadow-sm border-0 rounded-4">

      {/* Selector de días */}
      <div className="d-flex gap-2 p-3 border-bottom">
        {DIAS.map((d, i) => (
          <button
            key={i}
            onClick={() => setDiaActivo(i)}
            className={`btn btn-sm flex-fill fw-semibold ${
              diaActivo === i ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            aria-label={DIAS_NOMBRE[i]}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="card-body px-3 pt-3 pb-4">

        {/* Cabecera */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="fw-semibold mb-0">Tu actividad reciente</h6>
            <small className="text-muted">{DIAS_NOMBRE[diaActivo]}</small>
          </div>
          {!loading && rutina && (
            <div className="text-end">
              <span className="badge bg-primary">{DIAS_NOMBRE[diaActivo]}</span>
              <div>
                <small className="text-muted">{rutina.nombre}</small>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="d-flex align-items-center gap-2 text-muted">
            <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            <small>Cargando...</small>
          </div>
        )}

        {/* Sin rutina */}
        {!loading && !rutina && (
          <div className="text-center py-4 text-muted">
            <i className="bi bi-calendar-x fs-2 d-block mb-2" aria-hidden="true" />
            <small>Sin rutina para este día</small>
          </div>
        )}

        {/* Ejercicios */}
        {!loading && rutina && (
          <div className="d-flex flex-column gap-2">
            {rutina.ejercicios.map((ej: any, i: number) => (
              <div key={ej.id} className="rounded-3 border bg-light p-3">

                {/* Nombre ejercicio */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-primary rounded-circle" style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                    {i + 1}
                  </span>
                  <span className="fw-semibold small">{ej.ejercicio}</span>
                </div>

{/* Series y sus respectivas notas */}
{ej.registros && ej.registros.length > 0 ? (
  <div className="d-flex flex-column gap-1">
    {ej.registros.map((reg: any) => (
      <div key={reg.id} className="border-top pt-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary bg-opacity-25 text-secondary small">
              Serie {reg.series}
            </span>
            <small className="text-muted">
              {reg.peso > 0 ? `${reg.peso} kg` : 'Peso corporal'} × {reg.repeticiones} reps
            </small>
          </div>
          
          <div className="d-flex gap-1">
            <button 
              onClick={() => eliminarSerie(reg.id)}
              className="btn btn-outline-danger btn-sm py-0 px-2" 
              aria-label={`Eliminar serie ${reg.series}`}
            >
              <i className="bi bi-trash" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* AQUÍ SE MUESTRA LA NOTA DE CADA SERIE */}
{reg.notas && (
  <div className="d-flex align-items-start gap-2 mt-1 ms-3">
    <i className="bi bi-chat-left-text small text-secondary" aria-hidden="true" style={{ fontSize: '10px' }} />
    <small className="text-secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>
      {reg.notas}
    </small>
  </div>
)}
      </div>
    ))}
  </div>
) : (
  <small className="text-muted fst-italic">Sin registros aún</small>
)}

                {/* Notas */}
                {ej.notas && (
                  <div className="d-flex align-items-start gap-1 mt-2 pt-2 border-top">
                    <i className="bi bi-sticky small text-muted" aria-hidden="true" />
                    <small className="text-muted">{ej.notas}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}