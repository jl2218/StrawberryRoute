import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-12 px-4 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center mb-4">
                        <Image
                            src="/icons/strawberry-logo.svg"
                            alt="Strawberry Route Logo"
                            width={40}
                            height={40}
                        />
                        <span className="ml-2 text-xl font-bold">Strawberry Route</span>
                    </div>
                    <p className="text-gray-400">
                        Conectando produtores de morango do Sul de Minas com empresas e compradores.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
                    <ul className="space-y-2">
                        <li><Link href="/" className="text-gray-400 hover:text-white transition">Início</Link></li>
                        <li><Link href="/producers" className="text-gray-400 hover:text-white transition">Produtores</Link></li>
                        <li><Link href="/region" className="text-gray-400 hover:text-white transition">Região</Link></li>
                        {/*<li><Link href="/login" className="text-gray-400 hover:text-white transition">Área do Produtor</Link></li>*/}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">Contato</h3>
                    <p className="text-gray-400 mb-2">contato@strawberryroute.com</p>
                    <p className="text-gray-400">(35) 9999-9999</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Strawberry Route. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}