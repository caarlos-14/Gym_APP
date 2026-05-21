"use client"

import { useState,useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import {useRouter} from "next/navigation"


export default function Registrar() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sesion, setSesion] = useState(false)
  const [editar, setEditar] = useState(false)
  const [username, setUsername] = useState("")       // ← Cambiado a 'username' para evitar confusiones
  const [nombreCompleto, setNombreCompleto] = useState("") // ← Vinculado al input real
  const [rol, setRol] = useState("cliente")          // ← Valor por defecto
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)       // ← Control para el botón
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()
  
  useEffect(() =>{
  async function getSession(){
    const supabase = createClient()
    const {data:{session}} = await supabase.auth.getSession()

    if(session){
      setSesion(true)
    }

    const {data:perfil} = await supabase
    .from("perfiles")
    .select("*")
    .eq("id",session?.user.id)
    .single()

    if(perfil){
      setUsername(perfil.username)
      setNombreCompleto(perfil.nombre_completo)
      setRol(perfil.role)
      setAvatar(perfil.avatar_url)
      setPreview(perfil.avatar_url)
      setEmail(session?.user.email || "")
      setPassword("********") 
    }
  }
  getSession()
  },[])

    async function handleCerrarSesion(){
      const supabase = createClient()
      await supabase.auth.signOut()
      router.refresh()
      window.location.href = "/"
    }
    

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleRegister() {
    if (!email || !password || !username || !nombreCompleto) {
      setError("Por favor, rellena todos los campos.")
      return
    }

    setError("")
    setLoading(true)
    const supabase = createClient()

    try {
      // 1. Registrar usuario en Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre: nombreCompleto } }
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id
      if (!userId) {
        setError("No se pudo obtener el ID del usuario.")
        setLoading(false)
        return
      }

      let avatar_url = null

// 2. Subir imagen a Storage
      if (avatar) {
        const ext = avatar.name.split('.').pop()
        const path = `${userId}/avatar.${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatar, { upsert: true })

        // Si hay un error subiendo la foto, lo atrapamos para saber qué pasa
        if (uploadError) {
          setError("Error al subir la imagen al Storage: " + uploadError.message)
          setLoading(false)
          return // Frenamos el registro para evitar que inserte en null
        }

        // Si la subida fue exitosa, obtenemos la URL pública
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path)
        
        avatar_url = urlData.publicUrl
      }

      // 3. Insertar en la tabla perfiles
      const { error: profileError } = await supabase.from("perfiles").insert({
        id: userId,
        username: username.toLowerCase().replace(/\s+/g, '_'), // Formato limpio (ej: carlos_sanchez)
        nombre_completo: nombreCompleto,
        role: rol,
        avatar_url: avatar_url 
      })

      if (profileError) {
        setError("Error en Base de Datos: " + profileError.message)
        setLoading(false)
        return
      }

      router.refresh()
      setTimeout(() =>{
        window.location.href = "/" 
      },800)
      
      
    } catch (err) {
      setError("Ocurrió un error inesperado.")
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="card shadow-sm w-100">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column">
            <h4 className="fw-semibold">{sesion ? "Editar perfil" : "Crear cuenta"}</h4>
            <p className="text-muted small">{sesion ? "Edita tu información personal" : "Rellena los datos para registrarte"}</p>
            {sesion && (
            <div className="d-flex gap-2">
            <button className="btn btn-outline-success" style={{ fontSize: '9px', padding: '2px 8px' }}>
              Editar perfil
            </button>
            <button className="btn btn-outline-danger" onClick={handleCerrarSesion} style={{ fontSize: '9px', padding: '2px 8px' }}>
              Cerrar sesión
            </button>
            </div>
            )}

          </div>

          {/* Avatar */}
          <div className="mb-4 text-center">
            <label htmlFor="foto-perfil" style={{ cursor: 'pointer' }}>
              {preview ? (
                <img
                  src={preview}
                  alt="Foto de perfil"
                  width={100}
                  height={100}
                  className="rounded-circle border"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle border d-flex align-items-center justify-content-center bg-secondary mx-auto"
                  style={{ width: 80, height: 80, fontSize: 32, color: 'white' }}
                >
                  {nombreCompleto ? nombreCompleto[0].toUpperCase() : '?'}
                </div>
              )}
              <p className="text-muted small mt-2 mb-0">Toca para añadir foto (opcional)</p>
            </label>
            </div>
            <input
              type="file"
              id="foto-perfil"
              className="d-none"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading || sesion}
            />
          </div>

          {/* INPUT: Nombre Completo */}
          <div className="mb-3">
            <label className="form-label small fw-medium">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              value={nombreCompleto}
              onChange={e => setNombreCompleto(e.target.value)}
              disabled={loading || sesion}
            />
          </div>

          {/* INPUT: Nombre de usuario (username) */}
          <div className="mb-3">
            <label className="form-label small fw-medium">Nombre de usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading || sesion}
            />
          </div>

          {/* SELECT: Rol de usuario */}
          <div className="mb-3">
            <label className="form-label small fw-medium">Tipo de cuenta</label>
            <select 
              className="form-select" 
              value={rol} 
              onChange={e => setRol(e.target.value)}
              disabled={loading || sesion}
            >
              <option value="cliente">Basico</option>
              <option value="entrenador">Avanzado</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading || sesion}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-medium">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading || sesion}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleRegister} disabled={loading || sesion}>
            {sesion ? "¡Registrado!" : loading ? "Registrando..." : "Registrarse"}
          </button>
          {error && <div className="alert alert-danger text-center mt-2 py-2 small">{error}</div>}
        </div>
      </div>
    </div>
  )
}