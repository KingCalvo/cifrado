import { getDictionary } from "../../../lib/getDictionary";
import CifrarClient from "./CifrarClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return {
    title: dict.encryptPage.title + " | EncryptPath",
  };
}

export default async function Page({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <CifrarClient dict={dict} />;
}
