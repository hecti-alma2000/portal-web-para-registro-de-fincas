import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Portal web para el registro de fincas",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
