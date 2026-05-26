// components/RutinaSemanal.tsx
'use client'
import Link from "next/link"
import { useState } from 'react'
import { useRutinaDia } from '@/hooks/useRutinaDia'

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const DIAS_NOMBRE = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export default function RutinaSemanal() {
  const [diaActivo, setDiaActivo] = useState(getTodayIndex())
  const { rutina, loading } = useRutinaDia(diaActivo)

  return (
    <div className="card">
      {/* Selector días */}
      <div className="d-flex gap-2 p-3 border-bottom">
        {DIAS.map((d, i) => (
          <button
            key={i}
            onClick={() => setDiaActivo(i)}
            className={`btn btn-sm flex-fill ${diaActivo === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="card-body actividad">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
        <h6 className="card-title color mb-1">Tu Actividad Reciente</h6>
        <p className="text-muted color small">{DIAS_NOMBRE[diaActivo]}</p>
          </div>
        {!loading && rutina && (
          <div className="d-flex flex-column">
          <h6 className=" badge bg-primary text-white color text-center">Rutina del {DIAS_NOMBRE[diaActivo]}</h6>
          <p className="text-muted text-end color small">{rutina.nombre}</p>
          </div>
        )}
        </div>

        {loading && <p className="text-muted color">Cargando...</p>}

        {!loading && !rutina && (
          <p className="text-muted color">No hay rutina para este día.</p>
        )}

        {!loading && rutina && (
          <>
            <div className="d-flex flex-column gap-2">
              {rutina.ejercicios.map((ej: any, i:any) => (
                <div key={ej.id} className="p-3 rounded bg-light card_registro" style={{overflowY:"auto"}}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-primary">{i + 1}</span>
                    <span className="fw-medium">{ej.ejercicio}</span>
                  </div>
                
                {ej.registros && ej.registros.length > 0 ? (
                ej.registros.map((reg: any) => (
                  <div key={reg.id} className="small text-muted">
                  <div className="d-flex justify-content-around mb-2 align-items-center border-bottom mb-2">
                  Serie {reg.series}: {reg.peso}kg x {reg.repeticiones} reps
                <div className="d-flex gap-2 mb-2 ">
                    <button className="btn btn-outline-danger btn-sm  " >
                        <i className="bi bi-trash"></i>
                    </button>
                    <Link href="Ejercicios#registrar_ejercicio" className="d-flex align-items-center btn btn-outline-success btn-sm ">
                        <i className="bi bi-save"></i>
                    </Link>
                    </div>
                  </div>
                </div>
    ))
) : (
    <span className="small text-muted">Sin registros</span>
)}
                  {ej.notas && (
                    <p className="small text-muted mt-1 mb-0">📝 {ej.notas}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}