import EjerciciosComponent from "../componentes/ejercicios/ejercicios";
import Navbar from "../componentes/navbar/navbar";
import Perfil from "../componentes/perfil/perfil";
import RutinaComponent from "../componentes/rutina/rutina";
import Registrar_Ejercicio from "@/app/componentes/registrar_ejercicio/registrar_ejercicio"
export default function Ejercicios() {
  return (
    <>
      <Navbar />
      <Perfil />
      <RutinaComponent />
      <Registrar_Ejercicio></Registrar_Ejercicio>
      <EjerciciosComponent />
    </>
  );
}
