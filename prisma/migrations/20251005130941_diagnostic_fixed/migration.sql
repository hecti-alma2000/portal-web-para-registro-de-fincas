/*
  Warnings:

  - You are about to drop the `Certificacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Certificacion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fincaId" INTEGER NOT NULL,
    "puntuacionTotal" REAL NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Diagnostico_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Diagnostico_fincaId_idx" ON "Diagnostico"("fincaId");
