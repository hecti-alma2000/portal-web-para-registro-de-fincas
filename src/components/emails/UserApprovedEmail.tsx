import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Text,
  Preview,
  Tailwind,
  Link,
  Img,
  Section,
  Column,
} from '@react-email/components';

interface UserApprovedEmailProps {
  nombreFinca: string;
  nombreUsuario: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const UserApprovedEmail = ({ nombreFinca, nombreUsuario }: UserApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Tu solicitud ha sido aprobada!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          {/* Cambié w-116.25 por una medida estándar o estilo en línea para asegurar compatibilidad */}
          <Container
            className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5"
            style={{ maxWidth: '465px' }}
          >
            {/* 1. SECCIÓN DE LOGO Y TÍTULO (Usando Section/Column en lugar de Flexbox) */}
            <Section className="mt-8 mb-8">
              <table width="100%">
                <tr>
                  <td align="center">
                    <Img
                      src={`https://fincas.cuanticosurl.com/icons/logo.png`}
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
                      className="text-green-600 text-[24px] font-bold p-0 m-0"
                      style={{ display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      ¡Felicidades!
                    </Heading>
                  </td>
                </tr>
              </table>
            </Section>

            {/* 2. CUERPO DEL MENSAJE */}
            <Section>
              <Text className="text-black text-[14px] leading-6">
                Hola <strong>{nombreUsuario}</strong>,
              </Text>
              <Text className="text-black text-[14px] leading-6">
                Nos complace informarte que la solicitud de tu finca{' '}
                <strong>"{nombreFinca}"</strong> ha pasado el proceso de revisión y ha sido{' '}
                <strong>APROBADA</strong>.
              </Text>
              <Text className="text-black text-[14px] leading-6">
                Ya es visible públicamente en el portal de Agroturismo para todos los usuarios.
              </Text>
            </Section>

            {/* 3. BOTÓN O LINK DE ACCIÓN */}
            <Section className="text-center mt-8 mb-8">
              <Link
                href={`https://fincas.cuanticosurl.com/fincas`}
                className="bg-green-600 rounded text-white text-[14px] font-semibold no-underline text-center px-5 py-3"
              >
                Ver mi finca en el portal
              </Link>
            </Section>

            <Text className="text-[#666666] text-[12px] leading-6 text-center mt-4">
              Si tienes dudas, contacta con nuestro equipo de soporte.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
