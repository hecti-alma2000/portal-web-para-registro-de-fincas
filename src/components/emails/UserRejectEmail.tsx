import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Text,
  Section,
  Preview,
  Tailwind,
  Img,
} from '@react-email/components';

interface UserRejectEmailProps {
  nombreFinca: string;
  nombreUsuario: string;
}

// 👈 Definimos la URL base para cargar la imagen desde el servidor público
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const UserRejectEmail = ({ nombreFinca, nombreUsuario }: UserRejectEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Actualización sobre tu solicitud de finca</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          {/* Ajusté el ancho a w-[465px] para ser consistente con el otro email y usar píxeles explícitos */}
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            {/* 👉 NUEVA SECCIÓN DE CABECERA CON LOGO */}
            <div className="flex items-center justify-center my-8">
              <Img
                src={`${baseUrl}/icons/logo.png`} // Asegúrate que esta ruta sea la correcta en tu carpeta public
                width="50"
                height="50"
                alt="Logo Agroturismo"
                className="mr-4"
              />
              {/* Quitamos los márgenes verticales (my-7.5) del Heading porque el contenedor padre lo maneja */}
              <Heading className="text-red-600 text-[24px] font-bold p-0 m-0">
                Solicitud No Aprobada
              </Heading>
            </div>
            {/* 👈 FIN SECCIÓN CABECERA */}

            <Section className="mt-8">
              {/* Ajusté ligeramente los márgenes superiores de los textos */}
              <Text className="text-black text-[14px] leading-6">Hola {nombreUsuario},</Text>
              <Text className="text-black text-[14px] leading-6 mt-4">
                Lamentamos informarte que tu solicitud para la finca{' '}
                <strong>"{nombreFinca}"</strong> no ha sido aprobada por nuestros administradores en
                este momento.
              </Text>
              <Text className="text-gray-500 text-[12px] leading-5 mt-6">
                Esto puede deberse a falta de información técnica o datos incompletos en el
                formulario. Si tienes dudas, puedes ponerte en contacto con el equipo técnico de
                Agroturismo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
