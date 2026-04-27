"use client";

import { useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

type Props = {
  src: string;
  alt: string;
};

export default function ZoomImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Imagen normal */}
      <div
        onClick={() => setOpen(true)}
        className="mt-3 rounded-lg overflow-hidden border border-gray-600 cursor-zoom-in hover:opacity-80 transition"
      >
        <Image
          src={src}
          alt={alt}
          width={800}
          height={400}
          className="w-full object-cover"
        />
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          {/* Contenedor de imagen */}
          <div className="relative max-w-5xl w-full">
            {/* Botón cerrar */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-white text-3xl z-10 border border-red-500 rounded-full bg-red-500 hover:bg-red-600"
            >
              <IoClose />
            </button>

            {/* Imagen grande */}
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={800}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
