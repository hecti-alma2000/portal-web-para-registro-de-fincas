import { PrismaClient, TipoPropiedad } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Borra todas las fincas antes de insertar para evitar duplicados y errores de relaciones
  await prisma.finca.deleteMany({});

  await prisma.finca.createMany({
    data: [
      {
        nombre: "Finca La Gloria",
        descripcion:
          "Finca con viviendas familiares, mini-industria y corrales para cerdos.",
        localizacion: "Carretera Central, km 1, Holguín",
        propietario: "Familia Pérez",
        tipoPropiedad: "ESTATAL",
        entidadPertenece: "Cooperativa Agropecuaria",
        usoActual: "Producción de alimentos y crianza de animales",
        estadoConservacion: "Buena",
        problematicaDetectada: "Falta de maquinaria",
        tradicionesHistoria: "Fundada en 1950, tradición cafetalera",
      },
      {
        nombre: "Finca El Troncón y El Carmen",
        descripcion:
          "Finca con viviendas familiares y área de especies exóticas.",
        localizacion: "Zona rural, El Carmen, Holguín",
        propietario: "Familia Rodríguez",
        tipoPropiedad: "PRIVADA",
        entidadPertenece: "Independiente",
        usoActual: "Cultivo de plantas exóticas",
        estadoConservacion: "Regular",
        problematicaDetectada: "Acceso difícil en época de lluvias",
        tradicionesHistoria: "Herencia familiar desde 1975",
      },
      {
        nombre: "Finca La Bendecida",
        descripcion:
          "Finca con viviendas familiares, mini-industria y presa El Zorral.",
        localizacion: "Camino a La Bendecida, Holguín",
        propietario: "Familia García",
        tipoPropiedad: "ESTATAL",
        entidadPertenece: "Cooperativa Agropecuaria",
        usoActual: "Producción de alimentos y mini-industria",
        estadoConservacion: "Excelente",
        problematicaDetectada: "Falta de mano de obra",
        tradicionesHistoria: "Tradición de producción de miel",
      },
      {
        nombre: "Finca Las Maravillas",
        descripcion:
          "Finca con viviendas familiares y áreas de cultivo de caña y varios.",
        localizacion: "Las Maravillas, Holguín",
        propietario: "Familia Díaz",
        tipoPropiedad: "PRIVADA",
        entidadPertenece: "Independiente",
        usoActual: "Cultivo de caña y hortalizas",
        estadoConservacion: "Buena",
        problematicaDetectada: "Plagas en cultivos",
        tradicionesHistoria: "Fundada en 1980, tradición cañera",
      },
      {
        nombre: "Finca La Próspera",
        descripcion:
          "Finca con viviendas familiares y áreas de cultivos varios.",
        localizacion: "La Próspera, Holguín",
        propietario: "Familia López",
        tipoPropiedad: "ESTATAL",
        entidadPertenece: "Cooperativa Agropecuaria",
        usoActual: "Cultivo de hortalizas y frutas",
        estadoConservacion: "Buena",
        problematicaDetectada: "Falta de riego",
        tradicionesHistoria: "Tradición de cultivos mixtos",
      },
      {
        nombre: "Finca La Alegría",
        descripcion: "Finca con áreas de cultivos varios y siembra de limón.",
        localizacion: "La Alegría, Holguín",
        propietario: "Familia Martínez",
        tipoPropiedad: "PRIVADA",
        entidadPertenece: "Independiente",
        usoActual: "Siembra de limón y cultivos varios",
        estadoConservacion: "Regular",
        problematicaDetectada: "Falta de fertilizantes",
        tradicionesHistoria: "Fundada en 1995, tradición citrícola",
      },
      {
        nombre: "Finca La Margarita",
        descripcion: "Finca con cultivos varios y siembra de limón.",
        localizacion: "La Margarita, Holguín",
        propietario: "Familia Suárez",
        tipoPropiedad: "ESTATAL",
        entidadPertenece: "Cooperativa Agropecuaria",
        usoActual: "Cultivo de limón y hortalizas",
        estadoConservacion: "Excelente",
        problematicaDetectada: "Falta de herramientas",
        tradicionesHistoria: "Tradición de cultivos de limón",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
