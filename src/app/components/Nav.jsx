"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Inicio", href: "/" },
    { name: "Documento", href: "/document" },
    { name: "Cifrar", href: "/cifrar" },
    { name: "Descifrar", href: "/descifrar" },
    { name: "Hash", href: "/hash" },
  ];

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        bg-[#050505]
        ${scrolled ? "border-b border-green-500/30" : "border-b border-transparent"}
      `}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <div className="font-mono text-green-400 text-lg tracking-widest">
          <span className="text-blue-400">&gt;</span> root@cyber
        </div>

        {/* Desktop */}
        <ul className="hidden md:flex gap-6">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="
                px-4 py-2 font-mono text-green-300
                transition-all duration-300
                hover:text-white
                hover:bg-green-500/10
                rounded-lg
                "
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden font-mono text-green-400 text-xl"
        >
          {open ? "X" : "≡"}
        </button>
      </div>

      {/* Mobile */}
      {open && (
        <div className="md:hidden bg-[#050505] flex flex-col items-center gap-4 py-6 border-t border-green-500/20">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
              w-4/5 text-center py-2 font-mono text-green-300
              border border-green-500/20 rounded-lg
              hover:bg-green-500/10 hover:text-white
              transition-all
              "
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Nav;
