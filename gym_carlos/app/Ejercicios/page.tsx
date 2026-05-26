import EjerciciosComponent from "../componentes/ejercicios/ejercicios";
import Navbar from "../componentes/navbar/navbar";
import Perfil from "../componentes/perfil/perfil";
import RutinaComponent from "../componentes/rutina/rutina";
import Registrar_Ejercicio from "@/app/componentes/registrar_ejercicio/registrar_ejercicio"
import ConnectStrava from "@/app/componentes/connectStrava/connectStrava"
import StravaActivities from '@/app/componentes/strava/strava';

export default function Ejercicios() {
  return (
<div style={{ paddingBottom: '80px' }}> 
      <Perfil />
      <RutinaComponent />
      <Registrar_Ejercicio />
      {/*<StravaActivities></StravaActivities>*/}
      <EjerciciosComponent />
      <ConnectStrava />
      {/* El Navbar va al final para que el botón se renderice sobre los demás elementos */}
      <Navbar />
    </div>
  );
}
