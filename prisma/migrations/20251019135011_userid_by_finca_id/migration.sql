/*
  Warnings:

  - You are about to drop the column `fincaId` on the `Finca` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Finca` table without a default value. This is not possible if the table is not empty.

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
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Finca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Finca" ("createdAt", "descripcion", "entidadPertenece", "estadoConservacion", "fotoUrl", "id", "localizacion", "nombre", "problematicaDetectada", "propietario", "tipoPropiedad", "tradicionesHistoria", "updatedAt", "usoActual") SELECT "createdAt", "descripcion", "entidadPertenece", "estadoConservacion", "fotoUrl", "id", "localizacion", "nombre", "problematicaDetectada", "propietario", "tipoPropiedad", "tradicionesHistoria", "updatedAt", "usoActual" FROM "Finca";
DROP TABLE "Finca";
ALTER TABLE "new_Finca" RENAME TO "Finca";
CREATE UNIQUE INDEX "Finca_nombre_key" ON "Finca"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
