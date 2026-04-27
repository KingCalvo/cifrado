import { Geist, Geist_Mono } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { ArrayProvider } from "./context/ArrayContext";
import { PasswordProvider } from "./context/Password";
import { getDictionary } from "../../lib/getDictionary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LangLayout(props) {
  const { children } = props;

  const params = await props.params;
  const lang = params.lang;

  const dict = await getDictionary(lang);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Nav lang={lang} dict={dict} />

      <main className="w-full min-h-screen">
        <ArrayProvider>
          <PasswordProvider>{children}</PasswordProvider>
        </ArrayProvider>
      </main>

      <Footer dict={dict} />
    </div>
  );
}
