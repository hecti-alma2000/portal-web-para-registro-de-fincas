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
} from '@react-email/components';

interface UserApprovedEmailProps {
  nombreFinca: string;
  nombreUsuario: string;
}

// 2. DEFINIR LA URL BASE
// Necesitamos la URL pública de tu sitio web para encontrar la imagen.
// Asegúrate de tener NEXT_PUBLIC_APP_URL en tu archivo .env (ej: https://tudominio.com o http://localhost:3000 en desarrollo)
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const UserApprovedEmail = ({ nombreFinca, nombreUsuario }: UserApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Tu solicitud ha sido aprobada!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-116.25">
            {/* 3. NUEVO CONTENEDOR FLEXBOX PARA LOGO Y TÍTULO */}
            {/* Usamos 'flex', 'items-center' y 'justify-center' para alinearlos */}
            <div className="flex items-center justify-center my-8">
              <Img
                // Ruta a tu imagen en la carpeta /public
                src={`${baseUrl}/icons/logo.png`}
                width="50" // Ajusta el tamaño según necesites
                height="50"
                alt="Logo Agroturismo"
                className="mr-4" // Margen derecho para separarlo del texto
              />
              {/*
                  Nota: He eliminado 'text-center' y los márgenes 'my-7.5' del Heading
                  porque ahora el contenedor padre (el div flex) se encarga del centrado y el margen vertical.
              */}
              <Heading className="text-green-600 text-[24px] font-bold p-0 m-0">
                ¡Felicidades!
              </Heading>
            </div>

            <Text className="text-black text-[14px] leading-6">Hola {nombreUsuario},</Text>
            <Text className="text-black text-[14px] leading-6">
              Nos complace informarte que la solicitud de su finca <strong>"{nombreFinca}"</strong>{' '}
              ha pasado el proceso de revisión y ha sido <strong>APROBADA</strong>.
            </Text>
            <Text className="text-black text-[14px] leading-6">
              Ya es visible públicamente en el portal de Agroturismo.
            </Text>
            <Link className="text-blue-500 hover:text-blue-700 text-[14px] leading-6">
              https://fincas.cuanticosurl.com/fincas
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
