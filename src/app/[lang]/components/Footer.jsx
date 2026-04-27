"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { LockKeyhole } from "lucide-react";

const Footer = ({ dict }) => {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "es";

  return (
    <footer className="bg-[#050505] text-white border-t border-green-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <div className="flex items-center gap-2 font-mono text-green-400 text-lg mb-4">
            <LockKeyhole className="text-blue-400 w-6 h-6" />
            <span>EncryptPath</span>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed text-justify">
            {dict.footer.description}
          </p>

          {/* Redes */}
          <div className="flex gap-4 mt-5 text-xl text-gray-400">
            <a href="https://github.com/KingCalvo" target="_blank">
              <FaGithub className="hover:text-green-400 transition" />
            </a>

            <a
              href="https://www.linkedin.com/in/enrique-calvo-garcia-022151168/"
              target="_blank"
            >
              <FaLinkedin className="hover:text-green-400 transition" />
            </a>

            <a href="https://www.instagram.com/enriquecalvog/" target="_blank">
              <FaInstagram className="hover:text-green-400 transition" />
            </a>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <div>
          <h3 className="font-semibold text-green-400 mb-4 font-mono">
            {dict.footer.links}
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href={`/${lang}`} className="hover:text-white">
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/document`} className="hover:text-white">
                {dict.nav.document}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/cifrar`} className="hover:text-white">
                {dict.nav.encrypt}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/descifrar`} className="hover:text-white">
                {dict.nav.decrypt}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/hash`} className="hover:text-white">
                {dict.nav.hash}
              </Link>
            </li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h3 className="font-semibold text-green-400 mb-4 font-mono">
            {dict.footer.info}
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>
              <a
                href="https://mail.google.com/mail/?view=cm&to=enriquecalvo.dev@gmail.com"
                className="hover:text-white"
              >
                {dict.footer.email}
              </a>
            </li>

            <li>
              <a
                href="https://wa.me/7351241139"
                target="_blank"
                className="hover:text-white"
              >
                {dict.footer.contact}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea */}
      <div className="border-t border-green-500/20"></div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-6 font-mono">
        © EncryptPath 2025 — Enrique Calvo Garcia — {dict.footer.rights}
      </div>
    </footer>
  );
};

export default Footer;
