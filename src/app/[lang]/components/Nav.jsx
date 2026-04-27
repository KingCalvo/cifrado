"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";

function FlagMX() {
  return (
    <svg
      viewBox="0 0 640 480"
      className="h-4 w-6 rounded-sm overflow-hidden"
      aria-hidden="true"
    >
      <rect width="213.333" height="480" fill="#006847" />
      <rect x="213.333" width="213.333" height="480" fill="#ffffff" />
      <rect x="426.666" width="213.334" height="480" fill="#ce1126" />

      <g transform="translate(320 240)">
        <circle r="46" fill="#8b5a2b" opacity="0.15" />
        <circle r="26" fill="#8b5a2b" />
        <circle r="10" fill="#c9a227" />
      </g>
    </svg>
  );
}

function FlagUS() {
  return (
    <svg
      viewBox="0 0 640 480"
      className="h-4 w-6 rounded-sm overflow-hidden"
      aria-hidden="true"
    >
      <rect width="640" height="480" fill="#ffffff" />

      {Array.from({ length: 13 }).map((_, i) =>
        i % 2 === 0 ? (
          <rect
            key={i}
            y={i * 36.923}
            width="640"
            height="36.923"
            fill="#b22234"
          />
        ) : null,
      )}

      <rect width="280" height="260" fill="#3c3b6e" />
    </svg>
  );
}

const Nav = ({ dict }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [languageOpenDesktop, setLanguageOpenDesktop] = useState(false);
  const [languageOpenMobile, setLanguageOpenMobile] = useState(false);

  const desktopLanguageRef = useRef(null);
  const mobileLanguageRef = useRef(null);

  const lang = pathname.split("/")[1] || "es";

  const links = [
    { name: dict.nav.home, href: `/${lang}` },
    { name: dict.nav.document, href: `/${lang}/document` },
    { name: dict.nav.encrypt, href: `/${lang}/cifrar` },
    { name: dict.nav.decrypt, href: `/${lang}/descifrar` },
    { name: dict.nav.hash, href: `/${lang}/hash` },
  ];

  const changeLang = (newLang) => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "es" || segments[0] === "en") {
      segments.shift();
    }

    const newPath = "/" + [newLang, ...segments].join("/");

    router.push(newPath);
    router.refresh();
  };

  const currentLanguage =
    lang === "es"
      ? { text: "Español", flag: <FlagMX /> }
      : { text: "English", flag: <FlagUS /> };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;

      const clickedInsideDesktop =
        desktopLanguageRef.current &&
        desktopLanguageRef.current.contains(target);

      const clickedInsideMobile =
        mobileLanguageRef.current && mobileLanguageRef.current.contains(target);

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setLanguageOpenDesktop(false);
        setLanguageOpenMobile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505] border-b border-green-500/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2 font-mono text-green-400 text-lg tracking-widest">
          <LockKeyhole className="text-blue-400 w-6 h-6" />
          <p>EncryptPath</p>
        </div>

        <ul className="hidden md:flex gap-6">
          {links.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                className="px-4 py-2 font-mono text-green-300 hover:text-white hover:bg-green-500/10 rounded-lg"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop */}
        <div ref={desktopLanguageRef} className="hidden md:flex relative w-44">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setLanguageOpenDesktop((prev) => !prev)}
            className="
              flex w-full items-center justify-between gap-2
              border border-green-500/30
              px-4 py-2 rounded-lg
              font-mono text-green-300
              hover:bg-green-500/10
              transition-all
              whitespace-nowrap
            "
          >
            {currentLanguage.flag}
            <span>{currentLanguage.text}</span>
            <span className="text-xs">▼</span>
          </button>

          {languageOpenDesktop && (
            <div
              className="
                absolute right-0 top-full mt-2 w-full
                bg-[#050505]
                border border-green-500/30
                rounded-lg
                shadow-lg
                overflow-hidden
              "
            >
              <button
                type="button"
                onClick={() => {
                  changeLang("es");
                  setLanguageOpenDesktop(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-green-300 hover:bg-green-500/10 hover:text-white"
              >
                <FlagMX />
                Español
              </button>

              <button
                type="button"
                onClick={() => {
                  changeLang("en");
                  setLanguageOpenDesktop(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-green-300 hover:bg-green-500/10 hover:text-white"
              >
                <FlagUS />
                English
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setOpen((prev) => {
              const next = !prev;
              if (!next) {
                setLanguageOpenMobile(false);
              }
              return next;
            });
          }}
          className="md:hidden text-green-400 text-xl"
        >
          {open ? "X" : "≡"}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col items-center gap-4 py-6 border-t border-green-500/20">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                w-4/5 text-center py-2
                font-mono text-green-300
                border border-green-500/20
                rounded-lg
                hover:bg-green-500/10 hover:text-white
                transition-all
              "
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile */}
          <div ref={mobileLanguageRef} className="w-4/5 mt-4 relative">
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setLanguageOpenMobile((prev) => !prev)}
              className="
                w-full flex items-center justify-between
                px-4 py-2
                border border-green-500/30
                rounded-lg
                text-green-300 font-mono
              "
            >
              <span className="flex items-center gap-2">
                {currentLanguage.flag}
                {currentLanguage.text}
              </span>
              <span>▼</span>
            </button>

            {languageOpenMobile && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="mt-2 border border-green-500/30 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    changeLang("es");
                    setLanguageOpenMobile(false);
                    setTimeout(() => {
                      setOpen(false);
                    }, 150);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-green-300 hover:bg-green-500/10"
                >
                  <FlagMX />
                  Español
                </button>

                <button
                  type="button"
                  onClick={() => {
                    changeLang("en");
                    setLanguageOpenMobile(false);
                    setTimeout(() => {
                      setOpen(false);
                    }, 150);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-green-300 hover:bg-green-500/10"
                >
                  <FlagUS />
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
