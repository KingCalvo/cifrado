import { getDictionary } from "../../../lib/getDictionary";
import DescifrarClient from "./DescifrarClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return {
    title: dict.decryptPage.title + " | EncryptPath",
  };
}

export default async function Page({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <DescifrarClient dict={dict} />;
}
