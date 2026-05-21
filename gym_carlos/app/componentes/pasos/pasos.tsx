"use client"
import { useState } from "react";

const Pasos = () => {
    const [pasos, setPasos] = useState(0);

    return (
  <div className="d-flex flex-column align-items-center justify-content-center p-3 rounded-0" style={{ background: '#1e1e1e', flex: 1 }}>
    <i className="bi bi-clipboard-check" style={{ fontSize: '24px', color: '#aaa', marginBottom: '8px' }}></i>
    <span style={{ fontSize: '12px', color: '#aaa' }}>Pasos Realizados</span>
    <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>0</span>
  </div>
    )
}
export default Pasos;




