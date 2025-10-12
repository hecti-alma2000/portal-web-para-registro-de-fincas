/*
  Warnings:

  - You are about to drop the column `disponibilidadAnual` on the `Finca` table. All the data in the column will be lost.
  - You are about to drop the column `entornoLimpioSeguro` on the `Finca` table. All the data in the column will be lost.
  - You are about to drop the column `ofreceAlojamiento` on the `Finca` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Finca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "localizacion" TEXT NOT NULL,
    "propietario" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "tipoPropiedad" TEXT NOT NULL,
    "entidadPertenece" TEXT,
    "usoActual" TEXT,
    "estadoConservacion" TEXT,
    "problematicaDetectada" TEXT,
    "tradicionesHistoria" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Finca" ("createdAt", "descripcion", "entidadPertenece", "estadoConservacion", "fotoUrl", "id", "localizacion", "nombre", "problematicaDetectada", "propietario", "tipoPropiedad", "tradicionesHistoria", "updatedAt", "usoActual") SELECT "createdAt", "descripcion", "entidadPertenece", "estadoConservacion", "fotoUrl", "id", "localizacion", "nombre", "problematicaDetectada", "propietario", "tipoPropiedad", "tradicionesHistoria", "updatedAt", "usoActual" FROM "Finca";
DROP TABLE "Finca";
ALTER TABLE "new_Finca" RENAME TO "Finca";
CREATE UNIQUE INDEX "Finca_nombre_key" ON "Finca"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
