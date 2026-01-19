import * as React from 'react';
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
} from '@react-email/components';

interface UserRejectEmailProps {
  nombreFinca: string;
  nombreUsuario: string;
}

export const UserRejectEmail = ({ nombreFinca, nombreUsuario }: UserRejectEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Actualización sobre tu solicitud de finca</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            <Heading className="text-red-600 text-[24px] font-bold text-center p-0 my-7.5 mx-0">
              Solicitud No Aprobada
            </Heading>
            <Section className="mt-8">
              <Text className="text-black text-[14px] leading-6 mt-4">Hola {nombreUsuario},</Text>
              <Text className="text-black text-[14px] leading-6 mt-4">
                Lamentamos informarte que tu solicitud para la finca{' '}
                <strong>"{nombreFinca}"</strong> no ha sido aprobada por nuestros administradores en
                este momento.
              </Text>
              <Text className="text-gray-500 text-[12px] leading-5">
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
