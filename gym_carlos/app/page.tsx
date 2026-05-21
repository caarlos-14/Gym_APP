

import Navbar from "./componentes/navbar/navbar";
import RutinaSemanal from "./componentes/actividades/actividades";
import Perfil from "./componentes/perfil/perfil";
import Pasos from "./componentes/pasos/pasos";
import Calorias from "./componentes/calorias/calorias";
import Planificado from "./componentes/planificado/planificado";
import Multimedia from "@/app/componentes/multimedia/multimedia"
export default function Home() {

  return (
    <>
    
    <Navbar></Navbar>
    <main>
    <Perfil></Perfil>
    <RutinaSemanal></RutinaSemanal>
    <div className="container-fluid">
      <div className="row">
    <Pasos></Pasos>
    <Calorias></Calorias>
    </div>
    </div> 
    <Planificado></Planificado>
    <Multimedia></Multimedia>
    </main>
    </>
  );
}
