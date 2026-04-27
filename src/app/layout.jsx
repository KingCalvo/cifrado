import "./globals.css";

export const metadata = {
  title: "EncryptPath",
  description: "Sistema de cifrado",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
