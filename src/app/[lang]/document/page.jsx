import { getDictionary } from "../../../lib/getDictionary";
import DocumentClient from "./DocumentClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return {
    title: dict.document.title1 + " | EncryptPath",
  };
}

export default async function Page({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return <DocumentClient dict={dict} />;
}
