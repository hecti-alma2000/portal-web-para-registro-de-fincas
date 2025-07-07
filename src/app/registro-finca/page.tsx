import RegistroFincaPage from "./RegistroFincaPage";
import { getAllFincas } from "@/actions/registro-finca/finca-actions";

export default async function Page() {
  const fincas = await getAllFincas();
  return <RegistroFincaPage fincas={fincas} />;
}
