-- AlterTable
ALTER TABLE "Finca" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- Backfill: coordenadas de las fincas de demostración (algunas)
UPDATE "Finca" SET "latitude" = 20.869128,      "longitude" = -76.653746 WHERE "nombre" = 'La Gloria';
UPDATE "Finca" SET "latitude" = 20.8697922790, "longitude" = -76.6506222988 WHERE "nombre" = 'El Troncón';
UPDATE "Finca" SET "latitude" = 20.88586,       "longitude" = -76.66603 WHERE "nombre" = 'La Bendecida';
UPDATE "Finca" SET "latitude" = 20.86202,       "longitude" = -76.62822 WHERE "nombre" = 'Las Maravillas';
UPDATE "Finca" SET "latitude" = 20.90925,       "longitude" = -76.6241 WHERE "nombre" = 'La Próspera';
UPDATE "Finca" SET "latitude" = 20.85272,       "longitude" = -76.52072 WHERE "nombre" = 'La Alegría';
UPDATE "Finca" SET "latitude" = 20.90083,       "longitude" = -76.53986 WHERE "nombre" = 'La Margarita';
