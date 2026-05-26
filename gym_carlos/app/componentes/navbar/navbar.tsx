"use client"

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation"
import "@/app/componentes/navbar/navbar.css"
const navbar = () =>{
    const pathname = usePathname()
    return(
        <nav>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 navegacion">
                        <Link href="/" className="text-decoration-none text-dark">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Image
                            src="/casa.png"
                            alt="Casa"
                            width={50}
                            height={50}
                            id="inicio"
                            className={`icono-gym ${pathname === '/' ? 'active' : ''}`}
                            />
                            <label htmlFor="Inicio">Inicio</label>
                        </div>
                        </Link>
                        <Link href="/Ejercicios" className="text-decoration-none text-dark">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Image
                            src="/mancuerna.png"
                            alt="Ejercicios"
                            width={50}
                            height={50}
                            id="ejercicio"
                            className={`icono-gym ${pathname === '/Ejercicios' ? 'active' : ''}`}
                            />
                            <label htmlFor="ejercicio">Ejercicio</label>
                        </div>
                        </Link>
                        <Link href="/Multimedia" className="text-decoration-none text-dark">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Image
                            src="/multimedia.png"
                            alt="Multimedia"
                            width={50}
                            height={50}
                            id="multimedia"
                            className={`icono-gym ${pathname === '/Multimedia' ? 'active' : ''}`}
                            />
                            <label htmlFor="multimedia">Multimedia</label>
                        </div>
                        </Link>
                        <Link href="/Calendario" className="text-decoration-none text-dark"> 
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Image
                            src="/calendario.png"
                            alt="Calendario"
                            width={50}
                            height={50}
                            id="calendario"
                            className={`icono-gym ${pathname === '/Calendario' ? 'active' : ''}`}
                            />
                            <label htmlFor="calendario">Calendario</label>
                        </div>
                        </Link>
                        <Link href="/Registrar" className="text-decoration-none text-dark">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Image
                            src="/usuario.png"
                            alt="Calendario"
                            width={50}
                            height={50}
                            id="perfil"
                            className="icono-gym"
                            />
                            <label className="text-decoration-none" htmlFor="perfil">Perfil</label>
                        </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default navbar;