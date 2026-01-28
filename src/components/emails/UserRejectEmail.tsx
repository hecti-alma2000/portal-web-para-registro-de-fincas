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

// Asegúrate de que esta URL esté en tu .env (ej: https://tudominio.com)
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const UserRejectEmail = ({ nombreFinca, nombreUsuario }: UserRejectEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Actualización sobre tu solicitud de finca</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          {/* Usamos maxWidth en estilo para asegurar que no se rompa */}
          <Container
            className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5"
            style={{ maxWidth: '465px' }}
          >
            {/* CABECERA SEGURA: Usando tablas en lugar de Flexbox */}
            <Section className="my-8">
              <table width="100%">
                <tr>
                  <td align="center">
                    <Img
                      src={`https://fincas.cuanticosurl.com/icons/logo.png`} // URL absoluta corregida
                      width="50"
                      height="50"
                      alt="Logo Agroturismo"
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginRight: '12px',
                      }}
                    />
                    <Heading
                      className="text-red-600 text-[24px] font-bold p-0 m-0"
                      style={{ display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      Solicitud No Aprobada
                    </Heading>
                  </td>
                </tr>
              </table>
            </Section>

            <Section>
              <Text className="text-black text-[14px] leading-6">
                Hola <strong>{nombreUsuario}</strong>,
              </Text>

              <Text className="text-black text-[14px] leading-6 mt-4">
                Lamentamos informarte que tu solicitud para la finca{' '}
                <strong>"{nombreFinca}"</strong> no ha sido aprobada por nuestros administradores en
                este momento.
              </Text>

              <Text className="text-[#666666] text-[12px] leading-5 mt-6 border-t border-solid border-[#eeeeee] pt-4">
                <strong>¿Por qué sucede esto?</strong>
                <br />
                Esto puede deberse a falta de información técnica, fotos de baja calidad o datos
                incompletos en el formulario. Si tienes dudas, puedes ponerte en contacto con el
                equipo técnico de Agroturismo respondiendo a este correo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
