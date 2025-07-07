/*
  Warnings:

  - You are about to drop the column `ubicacion` on the `Finca` table. All the data in the column will be lost.
  - Added the required column `localizacion` to the `Finca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPropiedad` to the `Finca` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ElementoInteres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "ElementoInteres_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActividadAgroturistica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "ActividadAgroturistica_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrincipioSustentabilidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "PrincipioSustentabilidad_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccionAmbiental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "AccionAmbiental_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InfraestructuraFinca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fincaId" INTEGER NOT NULL,
    "transporteAccesible" BOOLEAN NOT NULL DEFAULT false,
    "coberturaTelefonica" BOOLEAN NOT NULL DEFAULT false,
    "tieneRestaurante" BOOLEAN NOT NULL DEFAULT false,
    "conexionSaneamiento" BOOLEAN NOT NULL DEFAULT false,
    "sistemaTratamientoAguas" BOOLEAN NOT NULL DEFAULT false,
    "usoEnergiasRenovables" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "InfraestructuraFinca_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Finca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "localizacion" TEXT NOT NULL,
    "propietario" TEXT NOT NULL,
    "tipoPropiedad" TEXT NOT NULL,
    "entidadPertenece" TEXT,
    "usoActual" TEXT,
    "estadoConservacion" TEXT,
    "problematicaDetectada" TEXT,
    "tradicionesHistoria" TEXT,
    "disponibilidadAnual" BOOLEAN NOT NULL DEFAULT false,
    "ofreceAlojamiento" BOOLEAN NOT NULL DEFAULT false,
    "entornoLimpioSeguro" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Finca" ("createdAt", "descripcion", "id", "nombre", "propietario", "updatedAt") SELECT "createdAt", "descripcion", "id", "nombre", "propietario", "updatedAt" FROM "Finca";
DROP TABLE "Finca";
ALTER TABLE "new_Finca" RENAME TO "Finca";
CREATE UNIQUE INDEX "Finca_nombre_key" ON "Finca"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "InfraestructuraFinca_fincaId_key" ON "InfraestructuraFinca"("fincaId");
