import Image from "next/image";
import ZoomImage from "../[lang]/components/ZoomImage";
import { LockKeyhole } from "lucide-react";
import { getDictionary } from "../../lib/getDictionary";

export async function generateMetadata({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return {
    title: dict.home.title2,
  };
}

export default async function Home({ params }) {
  const { lang } = await params;

  const dict = await getDictionary(lang);
  return (
    <main className="w-full min-h-screen bg-black text-white px-2 md:px-6 py-12 mt-20 flex justify-center">
      <div className="w-full max-w-4xl bg-[#111827] border border-gray-700 rounded-2xl p-8 shadow-xl flex flex-col gap-10">
        {/* Título */}
        <div className="flex items-center justify-center gap-2 font-mono text-green-400 text-lg tracking-widest">
          {/* <LockKeyhole className="text-blue-400 w-6 h-6" /> */}
          <h1 className="text-3xl font-bold text-center text-blue-400">🔐</h1>
          <h1 className="text-3xl font-bold text-center text-blue-400">
            {dict.home.title}
          </h1>
        </div>

        {/* Introducción */}
        <section className="text-gray-300 text-sm leading-relaxed text-justify">
          <p className="whitespace-pre-line">{dict.home.intro}</p>
        </section>

        {/* Cifrado */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl text-green-400 font-semibold">
            {dict.home.encryptTitle}
          </h2>

          {/* Paso 1 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-green-400 font-semibold">
              {dict.home.step1Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.step1Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-2.png"
                alt="Seleccionar archivo"
                width={800}
                height={400}
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-green-400 font-semibold">
              {dict.home.step2Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.step2Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-4.png"
                alt="Cargar archivo"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 3 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-green-400 font-semibold">
              {dict.home.step3Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.step3Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-5.png"
                alt="Cifrado y tablas ASCII HEX"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 4 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-green-400 font-semibold">
              {dict.home.step4Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.step4Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-7.png"
                alt="Botón cifrar"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 5 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-green-400 font-semibold">
              {dict.home.step5Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.step5Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-8C.png"
                alt="Descargar archivo"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 6 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-green-400 font-semibold">
              {dict.home.step6Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.step6Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-9.png"
                alt="Revisar archivo"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Descifrado */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl text-blue-400 font-semibold">
            {dict.home.decryptTitle}
          </h2>

          {/* Paso 1 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-blue-400 font-semibold">
              {dict.home.dstep1Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.dstep1Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-10.png"
                alt="Cargar archivo cifrado"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-blue-400 font-semibold">
              {dict.home.dstep2Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.dstep2Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-12.png"
                alt="Descifrar archivo"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 3 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-blue-400 font-semibold">
              {dict.home.dstep3Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.dstep3Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-13.png"
                alt="Descargar archivo"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Paso 4 */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <h3 className="text-blue-400 font-semibold">
              {dict.home.dstep4Title}
            </h3>
            <p className="text-gray-300 text-sm whitespace-pre-line text-justify">
              {dict.home.dstep4Desc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-14.png"
                alt="Revisar archivo"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Hash */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl text-yellow-400 font-semibold">
            {dict.home.hashTitle}
          </h2>

          <div className="bg-black/30 border border-gray-700 rounded-lg p-4 md:p-4 mx-[-8px] md:mx-0">
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {dict.home.hashDesc}
            </p>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-600">
              <ZoomImage
                src="/images/EncryptPath-15.png"
                alt="Hash SHA-256"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
