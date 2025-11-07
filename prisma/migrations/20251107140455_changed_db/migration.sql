-- CreateEnum
CREATE TYPE "public"."TipoPropiedad" AS ENUM ('ESTATAL', 'PRIVADA');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Finca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "localizacion" TEXT NOT NULL,
    "propietario" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "tipoPropiedad" "public"."TipoPropiedad" NOT NULL,
    "entidadPertenece" TEXT,
    "usoActual" TEXT,
    "estadoConservacion" TEXT,
    "problematicaDetectada" TEXT,
    "tradicionesHistoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Finca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ElementoInteres" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,

    CONSTRAINT "ElementoInteres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActividadAgroturistica" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,

    CONSTRAINT "ActividadAgroturistica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrincipioSustentabilidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,

    CONSTRAINT "PrincipioSustentabilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccionAmbiental" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,

    CONSTRAINT "AccionAmbiental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InfraestructuraFinca" (
    "id" SERIAL NOT NULL,
    "fincaId" INTEGER NOT NULL,
    "transporteAccesible" BOOLEAN NOT NULL DEFAULT false,
    "coberturaTelefonica" BOOLEAN NOT NULL DEFAULT false,
    "tieneRestaurante" BOOLEAN NOT NULL DEFAULT false,
    "conexionSaneamiento" BOOLEAN NOT NULL DEFAULT false,
    "sistemaTratamientoAguas" BOOLEAN NOT NULL DEFAULT false,
    "usoEnergiasRenovables" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InfraestructuraFinca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Diagnostico" (
    "id" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    "puntuacionTotal" DOUBLE PRECISION NOT NULL,
    "resultadoFinal" TEXT NOT NULL,
    "criterioA" INTEGER NOT NULL,
    "criterioB" INTEGER NOT NULL,
    "criterioC" INTEGER NOT NULL,
    "criterioD" INTEGER NOT NULL,
    "criterioE" INTEGER NOT NULL,
    "criterioF" INTEGER NOT NULL,
    "criterioG" INTEGER NOT NULL,
    "criterioH" INTEGER NOT NULL,
    "criterioI" INTEGER NOT NULL,
    "criterioJ" INTEGER NOT NULL,
    "criterioK" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Finca_nombre_key" ON "public"."Finca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "InfraestructuraFinca_fincaId_key" ON "public"."InfraestructuraFinca"("fincaId");

-- CreateIndex
CREATE INDEX "Diagnostico_fincaId_idx" ON "public"."Diagnostico"("fincaId");

-- AddForeignKey
ALTER TABLE "public"."Finca" ADD CONSTRAINT "Finca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ElementoInteres" ADD CONSTRAINT "ElementoInteres_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "public"."Finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActividadAgroturistica" ADD CONSTRAINT "ActividadAgroturistica_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "public"."Finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrincipioSustentabilidad" ADD CONSTRAINT "PrincipioSustentabilidad_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "public"."Finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccionAmbiental" ADD CONSTRAINT "AccionAmbiental_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "public"."Finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InfraestructuraFinca" ADD CONSTRAINT "InfraestructuraFinca_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "public"."Finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnostico" ADD CONSTRAINT "Diagnostico_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "public"."Finca"("id") ON DELETE CASCADE ON UPDATE CASCADE;
