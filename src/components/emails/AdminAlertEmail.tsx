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
} from '@react-email/components';

interface AdminAlertEmailProps {
  nombreFinca: string;
  nombrePropietario: string;
  fincaId: number;
}

export const AdminAlertEmail = ({
  nombreFinca,
  nombrePropietario,
  fincaId,
}: AdminAlertEmailProps) => {
  const previewText = `Nueva solicitud de registro: ${nombreFinca}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-7.5 mx-0">
              Nueva Finca Pendiente
            </Heading>
            <Text className="text-black text-[14px] leading-6">Hola Admin,</Text>
            <Text className="text-black text-[14px] leading-6">
              El usuario <strong>{nombrePropietario}</strong> ha solicitado una operación para la
              finca <strong>"{nombreFinca}"</strong>.
            </Text>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/fincas/${fincaId}`} // Ajusta tu URL base
              className="bg-[#000000] text-white p-3 rounded text-[12px] font-semibold no-underline text-center block"
            >
              Revisar Solicitud
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
