# Portal Web de Fincas - README

## Descripción

Este proyecto es un portal web para el registro, gestión y exploración de fincas agroturísticas. Permite a los usuarios buscar, registrar y visualizar información detallada de fincas, así como explorar mapas y actividades relacionadas.

## Requisitos previos

- Node.js >= 18.x
- npm >= 9.x
- (Opcional) Git
- (Opcional) VS Code o editor de tu preferencia

## Instalación y configuración

1. **Clona el repositorio:**

   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd portal-web-para-registro-de-fincas
   ```

2. **Instala las dependencias:**

   ```sh
   npm install
   ```

3. **Configura las variables de entorno:**

   - Copia el archivo `.env.template` y renómbralo a `.env`.
   - Completa los valores necesarios (por defecto, la base de datos es SQLite local).

4. **Configura la base de datos:**

   - Ejecuta las migraciones de Prisma:
     ```sh
     npx prisma migrate dev --name init
     ```
   - (Opcional) Abre Prisma Studio para ver los datos:
     ```sh
     npx prisma studio
     ```

5. **Carga los datos de ejemplo (semilla):**

   ```sh
   npx ts-node prisma/seed.ts
   ```

6. **Inicia la aplicación en desarrollo:**
   ```sh
   npm run dev
   ```
   La app estará disponible en [http://localhost:3000](http://localhost:3000)

## Estructura del proyecto

- `/src` - Código fuente principal (componentes, páginas, lógica de negocio)
- `/prisma` - Esquema de base de datos y archivos de semilla
- `/public` - Imágenes, íconos y recursos estáticos
- `/node_modules` - Dependencias instaladas

## Scripts útiles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la app para producción
- `npm run start` - Inicia la app en modo producción
- `npx prisma studio` - Interfaz visual para la base de datos
- `npx ts-node prisma/seed.ts` - Ejecuta el archivo de semilla

## Notas y recomendaciones

- No subas tu archivo `.env` real al repositorio, usa `.env.template` como referencia.
- Si cambias el esquema de la base de datos, ejecuta nuevamente las migraciones y actualiza el seed si es necesario.
- Para producción, configura correctamente las variables de entorno y la base de datos.

## Contacto y soporte

Para dudas, sugerencias o reportar bugs, abre un issue en el repositorio o contacta al equipo de desarrollo.

---

¡Gracias por usar el Portal Web de Fincas!
