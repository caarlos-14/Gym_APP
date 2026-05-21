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
                        <Link href="/">
                            <Image
                            src="/casa.png"
                            alt="Casa"
                            width={50}
                            height={50}
                            className={`icono-gym ${pathname === '/' ? 'active' : ''}`}
                            />
                        </Link>
                        <Link href="/Ejercicios">
                            <Image
                            src="/mancuerna.png"
                            alt="Ejercicios"
                            width={50}
                            height={50}
                            className={`icono-gym ${pathname === '/Ejercicios' ? 'active' : ''}`}
                            />
                        </Link>
                        <Link href="/Multimedia">
                            <Image
                            src="/multimedia.png"
                            alt="Multimedia"
                            width={50}
                            height={50}
                            className={`icono-gym ${pathname === '/Multimedia' ? 'active' : ''}`}
                            />
                        </Link>
                        <Link href="/Calendario">
                            <Image
                            src="/calendario.png"
                            alt="Calendario"
                            width={50}
                            height={50}
                            className={`icono-gym ${pathname === '/Calendario' ? 'active' : ''}`}
                            />
                        </Link>
                        <Link href="/Registrar">
                            <Image
                            src="/usuario.png"
                            alt="Calendario"
                            width={50}
                            height={50}
                            className="icono-gym"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default navbar;