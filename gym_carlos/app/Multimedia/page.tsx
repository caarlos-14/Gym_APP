import Navbar from "../componentes/navbar/navbar";
import Perfil from "../componentes/perfil/perfil";
import Peliculas from "@/app/componentes/peliculas/pelicula"
const Multimedia = () => {
    return (
        <div>
            <Navbar />
            <Perfil />
            <Peliculas/>
        </div>
    )
}
export default Multimedia;