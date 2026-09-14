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

interface PasswordResetEmailProps {
  nombre: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({ nombre, resetUrl }: PasswordResetEmailProps) => {
  const previewText = 'Restablece tu contraseña del Portal de Agroturismo';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            {/* CABECERA CON LOGO Y TÍTULO */}
            <div className="flex items-center justify-center my-8">
              <Img
                src="/icons/logo.png"
                width="50"
                height="50"
                alt="Logo Agroturismo"
                className="mr-4"
              />
              <Heading className="text-black text-[24px] font-bold p-0 m-0">
                Restablecer contraseña
              </Heading>
            </div>

            <Text className="text-black text-[14px] leading-6">Hola {nombre},</Text>

            <Text className="text-black text-[14px] leading-6">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú,
              haz clic en el botón de abajo para crear una nueva. El enlace es válido por{' '}
              <strong>1 hora</strong> y solo puede usarse una vez.
            </Text>

            {/* BOTÓN DE ACCIÓN */}
            <div className="text-center my-8">
              <Link
                href={resetUrl}
                className="bg-green-600 text-white px-6 py-3 rounded text-[14px] font-semibold no-underline inline-block"
              >
                Crear nueva contraseña
              </Link>
            </div>

            <Text className="text-gray-500 text-[12px] leading-6">
              Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no cambiará
              hasta que uses el enlace.
            </Text>

            <Text className="text-gray-500 text-[12px] leading-6 text-center italic">
              Este es un aviso automático enviado por el Portal de Agroturismo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};