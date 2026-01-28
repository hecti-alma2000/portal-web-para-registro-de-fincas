import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Text,
  Link,
  Preview,
  Tailwind,
  Img,
} from '@react-email/components';

interface AdminAlertEmailProps {
  nombreFinca: string;
  nombrePropietario: string;
  fincaId: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const AdminAlertEmail = ({ nombreFinca, nombrePropietario }: AdminAlertEmailProps) => {
  const previewText = `Nueva solicitud de registro: ${nombreFinca}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            {/*CABECERA CON LOGO Y TÍTULO ALINEADOS */}
            <div className="flex items-center justify-center my-8">
              <Img
                src={`/icons/logo.png`}
                width="50"
                height="50"
                alt="Logo Agroturismo"
                className="mr-4"
              />
              <Heading className="text-black text-[24px] font-bold p-0 m-0">
                Nueva Finca Pendiente
              </Heading>
            </div>

            <Text className="text-black text-[14px] leading-6">Hola Admin,</Text>

            <Text className="text-black text-[14px] leading-6">
              El usuario <strong>{nombrePropietario}</strong> ha solicitado registrar o editar la
              finca <strong>"{nombreFinca}"</strong> y requiere de tu revisión técnica.
            </Text>

            {/* BOTÓN DE ACCIÓN PARA EL ADMIN */}
            <div className="text-center my-8">
              <Link
                href={`https://fincas.cuanticosurl.com/admin/request`} // Sugerencia: Enviar al panel de solicitudes
                className="bg-black text-white px-6 py-3 rounded text-[14px] font-semibold no-underline inline-block"
              >
                Revisar en el Panel Admin
              </Link>
            </div>

            <Text className="text-gray-500 text-[12px] leading-6 text-center italic">
              Este es un aviso automático enviado por el Portal de Agroturismo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
