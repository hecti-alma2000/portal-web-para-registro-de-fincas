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
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbered'; items: string[] };

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

  drawSubheading(text: string) {
    this.ensureSpace(28);
    this.y -= 4;
    this.page.drawText(text, {
      x: MARGIN,
      y: this.y,
      size: 13,
      font: this.bold,
      color: rgb(0.1, 0.12, 0.15),
    });
    this.y -= 18;
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

  drawNumbered(items: string[]) {
    const size = 11;
    const lineHeight = 16;
    const indent = 20;
    items.forEach((item, index) => {
      const lines = wrapText(item, this.regular, size, CONTENT_WIDTH - indent);
      lines.forEach((line, i) => {
        this.ensureSpace(lineHeight);
        if (i === 0) {
          this.page.drawText(`${index + 1}.`, {
            x: MARGIN,
            y: this.y,
            size,
            font: this.bold,
            color: BRAND_GREEN,
          });
        }
        this.page.drawText(line, {
          x: MARGIN + indent,
          y: this.y,
          size,
          font: this.regular,
          color: TEXT_COLOR,
        });
        this.y -= lineHeight;
      });
    });
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
      else if (block.type === 'numbered') writer.drawNumbered(block.items);
      else if (block.type === 'subheading') writer.drawSubheading(block.text);
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
          text: 'El Portal de Registro de Fincas es un sistema web para el registro, certificación y exploración de fincas agroturísticas. Permite a cualquier propietario registrar su finca, evaluar su potencial agroturístico mediante el sistema de certificación FPAT (Finca con Potencial Agroturístico) y descargar un certificado en PDF cuando la finca resulta apta. También permite a cualquier visitante buscar y explorar las fincas ya aprobadas, tanto en un catálogo con filtros como en un mapa interactivo.',
        },
        {
          type: 'paragraph',
          text: 'Este manual describe, paso a paso, todas las funciones disponibles para una cuenta de usuario normal (no administrador).',
        },
      ],
    },
    {
      title: 'Crear una cuenta e iniciar sesión',
      blocks: [
        {
          type: 'subheading',
          text: 'Crear una cuenta',
        },
        {
          type: 'paragraph',
          text: 'Desde la pantalla de acceso, selecciona "Crear cuenta" y completa el formulario de registro con tu nombre, correo electrónico y contraseña. Una vez creada la cuenta, inicia sesión con esos mismos datos.',
        },
        {
          type: 'subheading',
          text: 'Iniciar sesión',
        },
        {
          type: 'paragraph',
          text: 'En la pantalla de acceso, introduce tu correo electrónico y contraseña y presiona "Iniciar sesión". Si tus datos son correctos, accederás a la página de inicio con tu sesión activa (verás tu nombre y tus opciones de cuenta en el menú superior).',
        },
        {
          type: 'subheading',
          text: 'Recuperar la contraseña',
        },
        {
          type: 'numbered',
          items: [
            'En la pantalla de inicio de sesión, presiona el enlace "¿Olvidaste tu contraseña?".',
            'Escribe el correo electrónico de tu cuenta y presiona "Enviar enlace de recuperación".',
            'Revisa tu bandeja de entrada: recibirás un correo con un enlace para crear una nueva contraseña. El sistema muestra un aviso de confirmación en pantalla independientemente de si el correo existe o no, por seguridad.',
            'Abre el enlace recibido, define tu nueva contraseña y vuelve a iniciar sesión con ella.',
          ],
        },
      ],
    },
    {
      title: 'Buscar una finca desde el inicio',
      blocks: [
        {
          type: 'paragraph',
          text: 'La página de inicio incluye un buscador rápido en la parte superior. A medida que escribes el nombre de una finca aparece un listado de sugerencias con coincidencias; puedes seleccionar una sugerencia o presionar "Buscar" para ver la ficha de resultado, con el nombre, la ubicación, el propietario y la descripción de la finca encontrada. Si no existe ninguna coincidencia, se muestra el mensaje "No encontrada". La ventana de resultado se puede cerrar con el botón de cierre, presionando la tecla Escape o haciendo clic fuera de ella.',
        },
      ],
    },
    {
      title: 'Catálogo de fincas y filtros',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Fincas" del menú principal muestra el catálogo completo de fincas aprobadas en formato de tarjetas, con una barra de filtros en la parte superior. Los filtros disponibles son:',
        },
        {
          type: 'bullets',
          items: [
            'Tipo de entidad: Estatal o Privada.',
            'Uso actual del suelo.',
            'Estado de conservación.',
            'Dirección o localización: búsqueda por coincidencia de texto sobre el nombre, la ubicación o el propietario de la finca.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Los filtros se aplican combinados; si ninguna finca cumple los criterios seleccionados, se muestra un aviso de "No se encontraron fincas con esos criterios."',
        },
      ],
    },
    {
      title: 'Explorar el mapa interactivo',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Explorar" muestra un mapa interactivo con las fincas aprobadas que tienen coordenadas geográficas registradas. Al hacer clic en un marcador se abre una ficha emergente con la foto, el nombre y los datos principales de la finca. Solo se ubican en el mapa las fincas cuyo registro incluyó latitud y longitud; las que no tienen coordenadas siguen visibles en el catálogo de "Fincas" pero no aparecen en el mapa.',
        },
      ],
    },
    {
      title: 'Registrar una finca',
      blocks: [
        {
          type: 'paragraph',
          text: 'Desde el menú "Registrar" se abre una ventana con el formulario de registro, organizado en cuatro bloques.',
        },
        {
          type: 'subheading',
          text: '1. Información General',
        },
        {
          type: 'bullets',
          items: [
            'Nombre de la Finca (obligatorio).',
            'Propietario / Responsable (obligatorio).',
            'Imagen Representativa: una fotografía de la entrada o el paisaje principal (opcional).',
            'Ubicación Exacta: dirección, municipio o referencia textual (obligatorio).',
            'Coordenadas Geográficas (opcional): se pueden escribir directamente la latitud y la longitud, o marcarlas en el mapa incluido en el formulario. Si se indica una, debe indicarse también la otra. Las fincas con coordenadas se muestran automáticamente en el mapa de "Explorar"; si se dejan vacías, la finca solo se publica en el catálogo de "Fincas".',
          ],
        },
        {
          type: 'subheading',
          text: '2. Detalles Técnicos',
        },
        {
          type: 'bullets',
          items: [
            'Tipo de Propiedad: Estatal o Privada.',
            'Entidad Perteneciente: solo aplica si el tipo de propiedad es Estatal (por ejemplo, "Ministerio de Agricultura"); se deshabilita automáticamente si la propiedad es Privada.',
            'Uso Actual del Suelo (obligatorio): Cultivos Varios, Ganadería, Forestal, Agroturismo u Otros (si se elige "Otros", se debe especificar el uso en un campo adicional).',
            'Estado de Conservación (obligatorio): Muy Bueno, Bueno, Aceptable o Malo.',
            'Descripción del Entorno: clima, relieve y belleza del lugar (opcional).',
          ],
        },
        {
          type: 'subheading',
          text: '3. Análisis y Atractivos',
        },
        {
          type: 'bullets',
          items: [
            'Problemática Detectada: por ejemplo, erosión o falta de riego (opcional).',
            'Tradiciones e Historia: historias locales o cultura asociada a la finca (opcional).',
          ],
        },
        {
          type: 'subheading',
          text: '4. Atributos y Sostenibilidad',
        },
        {
          type: 'paragraph',
          text: 'Cuatro listas de etiquetas a las que se agregan elementos uno por uno (se escribe el texto y se presiona el botón "+" o la tecla Enter): Elementos de Interés, Actividades Ofrecidas, Principios Sustentables y Acciones Ambientales. Cada etiqueta agregada se puede quitar con el botón de cierre que aparece sobre ella.',
        },
        {
          type: 'subheading',
          text: 'Envío y seguimiento',
        },
        {
          type: 'paragraph',
          text: 'Al presionar "Finalizar Registro" se pide una confirmación antes de enviar. Mientras se completa el formulario, el progreso se guarda automáticamente como borrador en el navegador (aunque se cierre la pestaña o se recargue la página por error, los datos no se pierden hasta que el registro se envíe con éxito). Una vez enviada, la finca queda con estado "Pendiente" hasta que un administrador la revise y la apruebe o la rechace; recibirás una notificación por correo electrónico con la decisión.',
        },
      ],
    },
    {
      title: 'Gestionar mis fincas registradas',
      blocks: [
        {
          type: 'paragraph',
          text: 'En "Registrar" también se muestra, debajo del botón para agregar una nueva finca, el listado de todas las fincas que has registrado (excepto las que fueron rechazadas). Desde cada tarjeta puedes:',
        },
        {
          type: 'bullets',
          items: [
            'Editar: abre el mismo formulario de registro con los datos ya cargados para modificarlos.',
            'Eliminar: solicita confirmación y borra la finca de forma permanente.',
            'Expandir la tarjeta (flecha) para ver todos los detalles adicionales: descripción, tipo de propiedad, uso actual, estado de conservación, problemática, tradiciones y las listas de atributos.',
          ],
        },
      ],
    },
    {
      title: 'Ver el estado de mis solicitudes',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Mis solicitudes" muestra un listado de solo lectura de todas las fincas que has registrado, con su fotografía, nombre, ubicación, fecha de creación y una etiqueta de estado: "PENDING" (pendiente de revisión), "APPROVED" (aprobada) o "REJECTED" (rechazada).',
        },
      ],
    },
    {
      title: 'Certificación FPAT',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Certificar" permite evaluar el potencial agroturístico de una finca aprobada. Como usuario normal, solo puedes certificar fincas de tu propiedad que ya estén aprobadas por un administrador.',
        },
        {
          type: 'numbered',
          items: [
            'Selecciona la finca a evaluar en el menú desplegable.',
            'Completa los 11 criterios del diagnóstico (identificados de la A a la K: existencia de casa rural, capacidad de recibir clientes, accesibilidad, distribución de áreas, sustentabilidad agrícola, categorización del espacio rural, manejo sostenible de tierras, aprovechamiento de recursos, infraestructura disponible, cercanía a sitios de valor sociocultural y entorno atractivo). Cada criterio se responde eligiendo un número en un selector tipo pastilla; una barra de progreso indica cuántos criterios llevas completados.',
            'Presiona "Obtener mi Diagnóstico" para enviar la evaluación.',
          ],
        },
        {
          type: 'paragraph',
          text: 'El sistema calcula una puntuación ponderada (cada criterio tiene un peso distinto según su importancia relativa, y la suma de las 11 valoraciones ponderadas da la puntuación final). Si la puntuación es mayor a 2.02, la finca se clasifica como APTA para actividades de agroturismo; de lo contrario, se clasifica como NO APTA y el mensaje indica que se requieren mejoras.',
        },
        {
          type: 'paragraph',
          text: 'Si la finca resulta apta, el resultado incluye el botón "Descargar Certificado": genera al instante un certificado en PDF con el nombre del propietario, el nombre de la finca, la fecha de emisión, la puntuación obtenida y un nivel de resultado (SATISFACTORIO, ALTO u ÓPTIMO según el puntaje alcanzado). Cada diagnóstico realizado queda registrado en tu historial y se refleja en las estadísticas de tu perfil.',
        },
      ],
    },
    {
      title: 'Mi perfil',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Perfil" muestra tus datos de cuenta y tres indicadores sobre tu actividad en el sistema: Fincas Registradas (el total de fincas bajo tu gestión), Certificaciones (el total de diagnósticos realizados sobre tus fincas) y Última certificación (la fecha del diagnóstico más reciente).',
        },
      ],
    },
    {
      title: 'Asistente virtual SmartLiz 5.0',
      blocks: [
        {
          type: 'paragraph',
          text: 'El botón flotante con el ícono de robot, en la esquina inferior derecha de cualquier página, abre a SmartLiz 5.0, el asistente virtual del portal. Puedes escribirle preguntas sobre el registro de fincas, la certificación FPAT o el uso general del sistema y te responderá de forma automática. Si el servicio de chat no está disponible en un momento dado, se muestra un panel indicándolo, con la opción de reintentar la conexión.',
        },
      ],
    },
    {
      title: 'Soporte',
      blocks: [
        {
          type: 'paragraph',
          text: 'Si encuentras algún problema con tu cuenta o con una solicitud, consulta primero la sección de Preguntas Frecuentes en la página de Información, prueba con el asistente virtual SmartLiz 5.0, o contacta al equipo administrador del portal.',
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
          text: 'Una cuenta con rol de administrador tiene acceso a todas las funciones descritas en el Manual de Usuario (búsqueda, catálogo, mapa, registro y certificación de fincas, perfil, asistente virtual) más un conjunto de herramientas de moderación y gestión: revisión de solicitudes de registro, mantenimiento de cuentas de usuario y certificación sin restricciones de propiedad. Este manual se enfoca en esas funciones adicionales.',
        },
      ],
    },
    {
      title: 'Acceso y permisos de administrador',
      blocks: [
        {
          type: 'paragraph',
          text: 'El rol de administrador se asigna desde "Mantenimiento de usuarios" por otro administrador; no existe un registro público que otorgue este rol. Al iniciar sesión con una cuenta de administrador, el menú principal muestra una opción adicional, "Solicitudes", con un contador junto al ícono de notificaciones que indica cuántas solicitudes de registro están pendientes de revisión en ese momento (se actualiza automáticamente cada minuto).',
        },
      ],
    },
    {
      title: 'Revisión y aprobación de solicitudes',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Solicitudes" (/admin/request) lista todas las fincas registradas por los usuarios que aún no han sido aprobadas ni rechazadas, con su nombre, ubicación, propietario e identificador. Si no hay ninguna, se muestra un aviso de que no existen solicitudes pendientes. Para cada solicitud hay tres acciones disponibles:',
        },
        {
          type: 'bullets',
          items: [
            'Aprobar: cambia el estado de la finca a "Aprobada", la publica en el catálogo público de "Fincas" y en el mapa de "Explorar" (si tiene coordenadas), y envía automáticamente un correo de notificación al propietario.',
            'Denegar: pide una confirmación explícita indicando que la acción enviará un correo y ELIMINARÁ la solicitud de forma permanente y no reversible. El propietario recibe un correo notificándole el resultado.',
            'Ver Detalles: abre la ficha completa de la finca (misma vista que ve el público) para revisar toda la información antes de decidir.',
          ],
        },
      ],
    },
    {
      title: 'Mantenimiento de usuarios',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Mantenimiento de usuarios" (/admin/users) muestra una tabla con todas las cuentas del sistema: correo electrónico, nombre completo y rol. El rol de cada usuario (Admin o User) se cambia directamente desde un menú desplegable en la misma tabla; el cambio se aplica de inmediato al seleccionarlo.',
        },
        {
          type: 'paragraph',
          text: 'La cuenta marcada como "usuario principal" del sistema tiene su selector de rol bloqueado (no se puede cambiar ni degradar desde la interfaz), como medida de seguridad para evitar quedarse sin ningún administrador.',
        },
      ],
    },
    {
      title: 'Certificación FPAT sin restricciones',
      blocks: [
        {
          type: 'paragraph',
          text: 'A diferencia de un usuario normal, que en el formulario de "Certificar" solo puede elegir entre sus propias fincas aprobadas, un administrador ve en ese mismo selector TODAS las fincas registradas en el sistema (aprobadas, pendientes o rechazadas, de cualquier propietario) y puede generar un diagnóstico FPAT sobre cualquiera de ellas siguiendo el mismo procedimiento de 11 criterios descrito en el Manual de Usuario.',
        },
      ],
    },
    {
      title: 'Mi perfil como administrador',
      blocks: [
        {
          type: 'paragraph',
          text: 'La sección "Perfil" de una cuenta administradora muestra estadísticas a nivel de todo el sistema, no solo de la propia cuenta: Fincas Registradas indica el total de fincas de todos los usuarios, Certificaciones indica el total de diagnósticos generados en el sistema, y Última certificación indica la fecha del diagnóstico más reciente registrado por cualquier usuario.',
        },
      ],
    },
    {
      title: 'Buenas prácticas de moderación',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Revisa que la ubicación y las coordenadas de la finca sean coherentes con la descripción antes de aprobarla.',
            'Verifica que el nombre del propietario y la información general sean razonables y estén completos.',
            'Recuerda que "Denegar" borra la solicitud de forma permanente y no se puede deshacer: úsalo solo cuando estés seguro de la decisión, ya que el usuario tendría que volver a registrar la finca desde cero si se equivoca la decisión.',
            'Al cambiar el rol de un usuario a Admin, ten en cuenta que esa cuenta pasará a tener acceso a todas las herramientas descritas en este manual, incluida la gestión de otras cuentas.',
          ],
        },
      ],
    },
    {
      title: 'Asistente virtual SmartLiz 5.0',
      blocks: [
        {
          type: 'paragraph',
          text: 'SmartLiz 5.0, el asistente virtual del portal, también está disponible para los administradores como apoyo ante dudas sobre el funcionamiento del sistema, de la misma forma descrita en el Manual de Usuario.',
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
