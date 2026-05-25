import EjerciciosComponent from "../componentes/ejercicios/ejercicios";
import Navbar from "../componentes/navbar/navbar";
import Perfil from "../componentes/perfil/perfil";
import RutinaComponent from "../componentes/rutina/rutina";
export default function Ejercicios() {
  return (
    <>
      <Navbar />
      <Perfil />
      <RutinaComponent />
      <EjerciciosComponent />
    </>
  );
}
