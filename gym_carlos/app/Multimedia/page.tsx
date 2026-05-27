import Navbar from "../componentes/navbar/navbar";
import Perfil from "../componentes/perfil/perfil";
import Peliculas from "@/app/componentes/peliculas/pelicula"
import Agregar from "@/app/componentes/agregarContenido/agregarContenido"
const Multimedia = () => {
    return (
        <div>
            <Navbar />
            <Perfil />
            <Agregar/>
            <Peliculas/>
        </div>
    )
}
export default Multimedia;