import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Text,
  Button,
  Preview,
  Tailwind,
} from '@react-email/components';

interface UserApprovedEmailProps {
  nombreFinca: string;
  nombreUsuario: string;
}

export const UserApprovedEmail = ({ nombreFinca, nombreUsuario }: UserApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Tu solicitud ha sido aprobada!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            <Heading className="text-green-600 text-[24px] font-bold text-center p-0 my-7.5 mx-0">
              ¡Felicidades!
            </Heading>
            <Text className="text-black text-[14px] leading-6">Hola {nombreUsuario},</Text>
            <Text className="text-black text-[14px] leading-6">
              Nos complace informarte que la solicitud de tu finca <strong>"{nombreFinca}"</strong>{' '}
              ha pasado el proceso de revisión y ha sido <strong>APROBADA</strong>.
            </Text>
            <Text className="text-black text-[14px] leading-6">
              Ya es visible públicamente en el portal de Agroturismo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
