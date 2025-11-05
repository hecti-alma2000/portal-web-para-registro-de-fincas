-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Diagnostico" (
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
    CONSTRAINT "Diagnostico_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Diagnostico" ("createdAt", "criterioA", "criterioB", "criterioC", "criterioD", "criterioE", "criterioF", "criterioG", "criterioH", "criterioI", "criterioJ", "criterioK", "fincaId", "id", "puntuacionTotal", "resultadoFinal") SELECT "createdAt", "criterioA", "criterioB", "criterioC", "criterioD", "criterioE", "criterioF", "criterioG", "criterioH", "criterioI", "criterioJ", "criterioK", "fincaId", "id", "puntuacionTotal", "resultadoFinal" FROM "Diagnostico";
DROP TABLE "Diagnostico";
ALTER TABLE "new_Diagnostico" RENAME TO "Diagnostico";
CREATE INDEX "Diagnostico_fincaId_idx" ON "Diagnostico"("fincaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
