// scripts/generate-manuals.ts
//
// Genera los manuales en PDF (usuario y administrador) del Portal de Registro
// de Fincas usando pdf-lib. Se ejecuta manualmente cuando el contenido cambia:
//
//   npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/generate-manuals.ts
//
// Escribe los archivos en public/manuales/, que es lo que sirve el botón de
// descarga de la página de Información según el rol del usuario.

import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'manuales');

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const BRAND_GREEN = rgb(0.086, 0.502, 0.243); // #16a34a
const TEXT_COLOR = rgb(0.18, 0.2, 0.24);
const MUTED_COLOR = rgb(0.4, 0.42, 0.46);

type Block =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] };

interface ManualSection {
  title: string;
  blocks: Block[];
}

interface ManualDefinition {
  title: string;
  subtitle: string;
  sections: ManualSection[];
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

class ManualWriter {
  doc!: PDFDocument;
  page!: PDFPage;
  y = 0;
  regular!: PDFFont;
  bold!: PDFFont;

  async init() {
    this.doc = await PDFDocument.create();
    this.regular = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.addPage();
  }

  addPage() {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  ensureSpace(height: number) {
    if (this.y - height < MARGIN) {
      this.addPage();
    }
  }

  drawCover(title: string, subtitle: string) {
    this.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 220,
      width: PAGE_WIDTH,
      height: 220,
      color: BRAND_GREEN,
    });
    this.page.drawText('Portal de Registro de Fincas', {
      x: MARGIN,
      y: PAGE_HEIGHT - 90,
      size: 14,
      font: this.bold,
      color: rgb(1, 1, 1),
    });
    const titleLines = wrapText(title, this.bold, 30, CONTENT_WIDTH);
    let ty = PAGE_HEIGHT - 140;
    for (const line of titleLines) {
      this.page.drawText(line, { x: MARGIN, y: ty, size: 30, font: this.bold, color: rgb(1, 1, 1) });
      ty -= 36;
    }
    this.page.drawText(subtitle, {
      x: MARGIN,
      y: PAGE_HEIGHT - 240,
      size: 12,
      font: this.regular,
      color: MUTED_COLOR,
    });
    this.y = PAGE_HEIGHT - 280;
  }

  drawSectionTitle(text: string, index: number) {
    this.ensureSpace(50);
    this.y -= 10;
    this.page.drawText(`${index}. ${text}`, {
      x: MARGIN,
      y: this.y,
      size: 18,
      font: this.bold,
      color: BRAND_GREEN,
    });
    this.y -= 10;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 1,
      color: rgb(0.85, 0.87, 0.85),
    });
    this.y -= 20;
  }

  drawParagraph(text: string) {
    const size = 11;
    const lineHeight = 16;
    const lines = wrapText(text, this.regular, size, CONTENT_WIDTH);
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.page.drawText(line, { x: MARGIN, y: this.y, size, font: this.regular, color: TEXT_COLOR });
      this.y -= lineHeight;
    }
    this.y -= 6;
  }

  drawBullets(items: string[]) {
    const size = 11;
    const lineHeight = 16;
    const bulletIndent = 14;
    for (const item of items) {
      const lines = wrapText(item, this.regular, size, CONTENT_WIDTH - bulletIndent);
      lines.forEach((line, i) => {
        this.ensureSpace(lineHeight);
        if (i === 0) {
          this.page.drawText('•', { x: MARGIN, y: this.y, size, font: this.bold, color: BRAND_GREEN });
        }
        this.page.drawText(line, {
          x: MARGIN + bulletIndent,
          y: this.y,
          size,
          font: this.regular,
          color: TEXT_COLOR,
        });
        this.y -= lineHeight;
      });
    }
    this.y -= 6;
  }

  drawFootnote(text: string) {
    this.ensureSpace(30);
    this.page.drawText(text, {
      x: MARGIN,
      y: this.y,
      size: 9,
      font: this.regular,
      color: MUTED_COLOR,
    });
    this.y -= 20;
  }

  async save(filePath: string) {
    const bytes = await this.doc.save();
    fs.writeFileSync(filePath, bytes);
  }
}

async function buildManual(def: ManualDefinition, filePath: string) {
  const writer = new ManualWriter();
  await writer.init();
  writer.drawCover(def.title, def.subtitle);

  def.sections.forEach((section, index) => {
    writer.drawSectionTitle(section.title, index + 1);
    for (const block of section.blocks) {
      if (block.type === 'paragraph') writer.drawParagraph(block.text);
      else if (block.type === 'bullets') writer.drawBullets(block.items);
    }
  });

  writer.drawFootnote(
    `Portal de Registro de Fincas · Asistente virtual SmartLiz 5.0 · Generado automáticamente`
  );

  await writer.save(filePath);
}

const manualUsuario: ManualDefinition = {
  title: 'Manual de Usuario',
  subtitle: 'Guía de uso del Portal de Registro de Fincas',
  sections: [
    {
      title: 'Introducción',
      blocks: [
        {
          type: 'paragraph',
          text: 'El Portal de Registro de Fincas permite a propietarios y visitantes registrar fincas agroturísticas, evaluar su potencial mediante el sistema de certificación FPAT y explorar las fincas ya aprobadas en un mapa interactivo. Este manual describe las funciones disponibles para el usuario final.',
        },
      ],
    },
    {
      title: 'Crear una cuenta e iniciar sesión',
      blocks: [
        {
          type: 'paragraph',
          text: 'Desde la pantalla de acceso puedes crear una cuenta nueva con tu correo electrónico y contraseña, o iniciar sesión si ya estás registrado.',
        },
        {
          type: 'bullets',
          items: [
            'Registro: completa nombre, correo y contraseña en "Crear cuenta".',
            'Inicio de sesión: ingresa con tu correo y contraseña en "Iniciar sesión".',
            '¿Olvidaste tu contraseña? Usa el enlace "¿Olvidaste tu contraseña?" en la pantalla de acceso: recibirás un correo con un enlace para restablecerla.',
          ],
        },
      ],
    },
    {
      title: 'Buscar una finca',
      blocks: [
        {
          type: 'paragraph',
          text: 'En la página de inicio puedes escribir el nombre de una finca en el buscador principal. A medida que escribes aparecen sugerencias; al seleccionar una o presionar "Buscar" se muestra una ficha con sus datos principales (ubicación, propietario, descripción).',
        },
      ],
    },
    {
      title: 'Registrar una finca',
      blocks: [
        {
          type: 'paragraph',
          text: 'Desde el menú "Registrar" puedes abrir el formulario de registro de finca. Completa los siguientes datos:',
        },
        {
          type: 'bullets',
          items: [
            'Nombre, propietario y tipo de propiedad de la finca.',
            'Descripción, uso actual y estado de conservación.',
            'Ubicación geográfica: puedes marcarla directamente en el mapa o introducir latitud y longitud.',
            'Una fotografía representativa de la finca (opcional).',
            'Elementos de interés, actividades agroturísticas, principios de sustentabilidad y acciones ambientales aplicables.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Al enviar el formulario, la solicitud queda en estado "Pendiente" hasta que un administrador la revise y la apruebe o rechace. El progreso se guarda automáticamente como borrador en tu navegador mientras completas el formulario.',
        },
      ],
    },
    {
      title: 'Certificación FPAT',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Certificar" permite evaluar el potencial agroturístico de una finca aprobada. El formulario presenta 11 criterios (A a K); para cada uno selecciona la valoración que mejor describe la situación de la finca. Una barra de progreso indica cuántos criterios has completado.',
        },
        {
          type: 'paragraph',
          text: 'Al enviar el diagnóstico, el sistema calcula un puntaje y muestra el resultado. Si la finca resulta apta, podrás descargar de inmediato su certificado en formato PDF.',
        },
      ],
    },
    {
      title: 'Mis solicitudes',
      blocks: [
        {
          type: 'paragraph',
          text: 'En "Mis solicitudes" puedes ver el listado de fincas que has registrado, junto con su estado actual (pendiente, aprobada o rechazada), y editar o eliminar tus solicitudes cuando corresponda.',
        },
      ],
    },
    {
      title: 'Explorar fincas',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Explorar" muestra un mapa interactivo con las fincas aprobadas del sistema, con filtros por tipo de entidad, uso actual, estado de conservación y ubicación.',
        },
      ],
    },
    {
      title: 'Perfil de usuario',
      blocks: [
        {
          type: 'paragraph',
          text: 'Desde tu perfil puedes consultar y actualizar tus datos de cuenta.',
        },
      ],
    },
    {
      title: 'Asistente virtual SmartLiz 5.0',
      blocks: [
        {
          type: 'paragraph',
          text: 'El botón flotante en la esquina inferior derecha abre a SmartLiz 5.0, el asistente virtual del portal. Puedes escribirle preguntas sobre el registro de fincas, la certificación FPAT o el uso general del sistema, y te responderá de forma automática.',
        },
      ],
    },
    {
      title: 'Soporte',
      blocks: [
        {
          type: 'paragraph',
          text: 'Si encuentras algún problema con tu cuenta o con una solicitud, contacta al equipo administrador del portal o consulta la sección de Preguntas Frecuentes en la página de Información.',
        },
      ],
    },
  ],
};

const manualAdministrador: ManualDefinition = {
  title: 'Manual de Administrador',
  subtitle: 'Guía de gestión del Portal de Registro de Fincas',
  sections: [
    {
      title: 'Introducción',
      blocks: [
        {
          type: 'paragraph',
          text: 'Además de todas las funciones disponibles para un usuario registrado, la cuenta de administrador tiene acceso a herramientas de moderación y gestión: revisión de solicitudes de registro de fincas y mantenimiento de usuarios del sistema.',
        },
      ],
    },
    {
      title: 'Acceso de administrador',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cuando inicias sesión con una cuenta con rol de administrador, el menú principal muestra opciones adicionales ("Solicitudes" y acceso a la gestión de usuarios) que no están disponibles para usuarios normales.',
        },
      ],
    },
    {
      title: 'Gestión de solicitudes pendientes',
      blocks: [
        {
          type: 'paragraph',
          text: 'En "Solicitudes" (/admin/request) se listan todas las fincas registradas por los usuarios que aún no han sido aprobadas ni rechazadas. Un contador en el menú principal indica cuántas solicitudes están pendientes de revisión.',
        },
        {
          type: 'bullets',
          items: [
            'Revisa los datos de cada solicitud (nombre, ubicación, propietario).',
            'Usa los botones de acción para aprobar o rechazar la solicitud.',
            'Puedes ver el detalle completo de la finca antes de decidir con "Ver Detalles".',
          ],
        },
      ],
    },
    {
      title: 'Mantenimiento de usuarios',
      blocks: [
        {
          type: 'paragraph',
          text: 'En "Mantenimiento de usuarios" (/admin/users) puedes consultar el listado paginado de cuentas registradas en el sistema y administrarlas según sea necesario.',
        },
      ],
    },
    {
      title: 'Certificación FPAT como administrador',
      blocks: [
        {
          type: 'paragraph',
          text: 'A diferencia de un usuario normal, que solo puede certificar sus propias fincas aprobadas, un administrador puede evaluar el diagnóstico FPAT de cualquier finca registrada en el sistema.',
        },
      ],
    },
    {
      title: 'Buenas prácticas de moderación',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Revisa que la ubicación de la finca sea coherente con la descripción antes de aprobarla.',
            'Verifica que la información de contacto del propietario sea razonable.',
            'Rechaza solicitudes incompletas o con datos claramente erróneos, e indica el motivo cuando sea posible.',
          ],
        },
      ],
    },
    {
      title: 'Asistente virtual SmartLiz 5.0',
      blocks: [
        {
          type: 'paragraph',
          text: 'SmartLiz 5.0, el asistente virtual del portal, también está disponible para los administradores como apoyo ante dudas sobre el funcionamiento del sistema.',
        },
      ],
    },
  ],
};

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  await buildManual(manualUsuario, path.join(OUTPUT_DIR, 'manual-usuario.pdf'));
  await buildManual(manualAdministrador, path.join(OUTPUT_DIR, 'manual-administrador.pdf'));
  // eslint-disable-next-line no-console
  console.log('Manuales generados en', OUTPUT_DIR);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
