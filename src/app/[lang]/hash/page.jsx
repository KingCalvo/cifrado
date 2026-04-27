import { getDictionary } from "../../../lib/getDictionary";
import HashClient from "./HashClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return {
    title: dict.hashPage.title + " | EncryptPath",
  };
}

export default async function Page({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <HashClient dict={dict} />;
}
