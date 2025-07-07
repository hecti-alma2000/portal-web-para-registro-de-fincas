-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AccionAmbiental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "AccionAmbiental_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AccionAmbiental" ("fincaId", "id", "nombre") SELECT "fincaId", "id", "nombre" FROM "AccionAmbiental";
DROP TABLE "AccionAmbiental";
ALTER TABLE "new_AccionAmbiental" RENAME TO "AccionAmbiental";
CREATE TABLE "new_ActividadAgroturistica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "ActividadAgroturistica_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActividadAgroturistica" ("fincaId", "id", "nombre") SELECT "fincaId", "id", "nombre" FROM "ActividadAgroturistica";
DROP TABLE "ActividadAgroturistica";
ALTER TABLE "new_ActividadAgroturistica" RENAME TO "ActividadAgroturistica";
CREATE TABLE "new_ElementoInteres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "ElementoInteres_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ElementoInteres" ("fincaId", "id", "nombre") SELECT "fincaId", "id", "nombre" FROM "ElementoInteres";
DROP TABLE "ElementoInteres";
ALTER TABLE "new_ElementoInteres" RENAME TO "ElementoInteres";
CREATE TABLE "new_InfraestructuraFinca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fincaId" INTEGER NOT NULL,
    "transporteAccesible" BOOLEAN NOT NULL DEFAULT false,
    "coberturaTelefonica" BOOLEAN NOT NULL DEFAULT false,
    "tieneRestaurante" BOOLEAN NOT NULL DEFAULT false,
    "conexionSaneamiento" BOOLEAN NOT NULL DEFAULT false,
    "sistemaTratamientoAguas" BOOLEAN NOT NULL DEFAULT false,
    "usoEnergiasRenovables" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "InfraestructuraFinca_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InfraestructuraFinca" ("coberturaTelefonica", "conexionSaneamiento", "fincaId", "id", "sistemaTratamientoAguas", "tieneRestaurante", "transporteAccesible", "usoEnergiasRenovables") SELECT "coberturaTelefonica", "conexionSaneamiento", "fincaId", "id", "sistemaTratamientoAguas", "tieneRestaurante", "transporteAccesible", "usoEnergiasRenovables" FROM "InfraestructuraFinca";
DROP TABLE "InfraestructuraFinca";
ALTER TABLE "new_InfraestructuraFinca" RENAME TO "InfraestructuraFinca";
CREATE UNIQUE INDEX "InfraestructuraFinca_fincaId_key" ON "InfraestructuraFinca"("fincaId");
CREATE TABLE "new_PrincipioSustentabilidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "PrincipioSustentabilidad_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PrincipioSustentabilidad" ("fincaId", "id", "nombre") SELECT "fincaId", "id", "nombre" FROM "PrincipioSustentabilidad";
DROP TABLE "PrincipioSustentabilidad";
ALTER TABLE "new_PrincipioSustentabilidad" RENAME TO "PrincipioSustentabilidad";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
