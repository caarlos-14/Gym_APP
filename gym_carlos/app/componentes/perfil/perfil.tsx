"use client"

import Image from "next/image";
import { useState,useEffect} from "react"
import {createClient} from "@/utils/supabase/client"
import {usePathname} from "next/navigation"
import Link from "next/link";


const Perfil = () => {
const [nombre, setNombre] = useState("Invitado")
const [imagen,setImagen] = useState("Invitados.png")
const [sesion,setSesion] = useState(false)
const pathname = usePathname();

useEffect(() =>{
  async function getSession(){
    const supabase = createClient()
    const {data:{session}} = await supabase.auth.getSession()

    if(session){
      setNombre(session.user?.user_metadata?.nombre)
      setSesion(true)

      const {data:perfilData,error} = await supabase
      .from("perfiles")
      .select("avatar_url,username")
      .eq("id",session.user.id)
      .single()
      
      if(!error && perfilData?.avatar_url){
        setImagen(perfilData.avatar_url)
        setNombre(perfilData.username)
      }
    }
  }
  getSession()
  },[])
  

return(
    <div className="container-fluid">
    <div className="row">
    <section className="section_saludo col-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center text-center">
      <h2 className="saludo_personalizado m-0 ">
        {pathname === "/" ? `Hola, ${nombre}👋`: pathname === "/Ejercicios" ? `Ejercitate, ${nombre}💪!` : pathname === "/Multimedia" ? `Disfruta 📺, ${nombre}!` : pathname === "/Calendario" ? `Organizate, ${nombre}!` : ""}
        
        </h2>
    </div>

    
    <div className="perfil d-flex align-items-center gap-2 p-2">
      <Link href="/Registrar" className="d-flex align-items-center btn btn-outline-light gap-3 btn-perfil">
        <span className="d-none d-md-inline">
          {sesion ? "Ver Perfil" : "Iniciar Sesión"}
          </span>
        <Image
      alt="Perfil"
      src={imagen.startsWith("http") ? imagen : `/${imagen}`}
      width={50}
      height={50}
      className="imagen-perfil"
      />
      </Link>
  
    </div>
    </section>
    </div>
    </div>
)
}
export default Perfil