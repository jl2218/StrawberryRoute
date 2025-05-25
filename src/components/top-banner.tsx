"use client";
import Image from "next/image";
import Link from "next/link";

export default function TopBanner() {
  return (
    <section className="relative h-[8vh] bg-green-700 flex items-center">
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
                src="/icons/strawberry-logo.svg"
                alt="Strawberry Route Logo"
                width={40}
                height={40}
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Strawberry Route</h1>
            <p className="text-sm sm:text-base">
              Conectando produtores de morango do Sul de Minas com empresas e compradores
            </p>
          </div>
        </div>

        <div>
          <Link href="/producers" className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Conheça os Produtores</Link>
        </div>
      </div>
    </section>
  );
}
