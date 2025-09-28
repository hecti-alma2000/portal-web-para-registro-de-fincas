-- CreateTable
CREATE TABLE "Certificacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accesibilidad" BOOLEAN NOT NULL,
    "permisoPropietario" BOOLEAN NOT NULL,
    "seguridadEntorno" BOOLEAN NOT NULL,
    "actividadAgricola" BOOLEAN NOT NULL,
    "serviciosBasicos" BOOLEAN NOT NULL,
    "produccionSostenible" BOOLEAN NOT NULL,
    "ofertaProductos" BOOLEAN NOT NULL,
    "ofertaActividades" BOOLEAN NOT NULL,
    "valorCultural" BOOLEAN NOT NULL,
    "infraestructuraAdic" BOOLEAN NOT NULL,
    "ofertaAlojamiento" BOOLEAN NOT NULL,
    "gastronomiaLocal" BOOLEAN NOT NULL,
    "senalizacion" BOOLEAN NOT NULL,
    "elementosInteres" BOOLEAN NOT NULL,
    "puntuacionTotal" INTEGER NOT NULL,
    "nivelPotencial" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Certificacion_nivelPotencial_idx" ON "Certificacion"("nivelPotencial");
