-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "Finca" (
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
    "fincaId" TEXT NOT NULL,
    CONSTRAINT "Finca_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElementoInteres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "ElementoInteres_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActividadAgroturistica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "ActividadAgroturistica_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrincipioSustentabilidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "PrincipioSustentabilidad_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccionAmbiental" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "fincaId" INTEGER NOT NULL,
    CONSTRAINT "AccionAmbiental_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT "InfraestructuraFinca_fincaId_fkey" FOREIGN KEY ("fincaId") REFERENCES "Finca" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Finca_nombre_key" ON "Finca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "InfraestructuraFinca_fincaId_key" ON "InfraestructuraFinca"("fincaId");

-- CreateIndex
CREATE INDEX "Diagnostico_fincaId_idx" ON "Diagnostico"("fincaId");
