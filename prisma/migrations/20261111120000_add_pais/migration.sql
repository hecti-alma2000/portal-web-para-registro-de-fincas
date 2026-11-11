-- AlterTable: país de la finca (ISO 3166-1 alfa-2). Las fincas existentes quedan como Cuba.
ALTER TABLE "Finca" ADD COLUMN "pais" TEXT NOT NULL DEFAULT 'CU';

-- CreateIndex
CREATE INDEX "Finca_pais_idx" ON "Finca"("pais");
