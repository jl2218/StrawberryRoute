"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Producer {
  id: number;
  name: string;
  description: string;
  city: string;
  cultivationMethods: string[];
}

interface RegionInfo {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export default function Home() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [regionInfo, setRegionInfo] = useState<RegionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real application, these would be API calls
    // For now, we'll use mock data
    const mockProducers = [
      {
        id: 1,
        name: "João Silva",
        description: "Produtor de morangos orgânicos há mais de 15 anos. Especializado em variedades Albion e San Andreas.",
        city: "Pouso Alegre",
        cultivationMethods: ["Orgânico", "Semi-hidropônico"]
      },
      {
        id: 2,
        name: "Maria Santos",
        description: "Produtora familiar de morangos. Cultivo tradicional e produtos artesanais derivados de morango.",
        city: "Gonçalves",
        cultivationMethods: ["Tradicional", "Familiar"]
      },
      {
        id: 3,
        name: "Carlos Oliveira",
        description: "Produtor de morangos hidropônicos de alta qualidade. Tecnologia de ponta para garantir sabor e durabilidade.",
        city: "Cambuí",
        cultivationMethods: ["Hidropônico", "Vertical"]
      }
    ];

    const mockRegionInfo = [
      {
        id: 1,
        title: "Sul de Minas - O Paraíso dos Morangos",
        content: "O Sul de Minas Gerais é conhecido por seu clima ameno, com temperaturas médias entre 15°C e 25°C, ideal para o cultivo de morangos.",
        imageUrl: "/images/region/sul-minas.jpg"
      }
    ];

    setProducers(mockProducers);
    setRegionInfo(mockRegionInfo);
    setIsLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-green-700">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/icons/strawberry-logo.svg"
              alt="Strawberry Route Logo"
              width={120}
              height={120}
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Strawberry Route</h1>
          <p className="text-xl text-white mb-8">Conectando produtores de morango do Sul de Minas com empresas e compradores</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/producers')}
              className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Conheça os Produtores
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="bg-secondary hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Área do Produtor
            </button>
          </div>
        </div>
      </section>

      {/* Featured Producers Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Produtores em Destaque</h2>
        
        {isLoading ? (
          <div className="text-center">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {producers.map((producer) => (
              <div key={producer.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
                <div className="h-48 bg-primary-light relative">
                  <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 rounded-tr-lg">
                    {producer.city}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{producer.name}</h3>
                  <p className="text-gray-600 mb-4">{producer.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {producer.cultivationMethods.map((method, index) => (
                      <span key={index} className="bg-secondary-light text-secondary px-3 py-1 rounded-full text-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                  {/*<Link */}
                  {/*  href={`/producers/${producer.id}`}*/}
                  {/*  className="btn-secondary-sm"*/}
                  {/*>*/}
                  {/*  Ver Detalhes*/}
                  {/*</Link>*/}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/producers"
            className="btn"
          >
            Ver Todos os Produtores
          </Link>
        </div>
      </section>

      {/* Region Information Section */}
      <section className="py-16 px-4 bg-secondary-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Sul de Minas Gerais</h2>
          
          {isLoading ? (
            <div className="text-center">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{regionInfo[0]?.title}</h3>
                <p className="text-gray-700 mb-6">{regionInfo[0]?.content}</p>
                <p className="text-gray-700 mb-6">
                  A altitude entre 800 e 1.400 metros proporciona noites frescas e dias ensolarados, resultando em frutos doces e saborosos. A região é conhecida pela produção de morangos de alta qualidade, que abastecem mercados em todo o Brasil.
                </p>
                <Link 
                  href="/region"
                  className="btn-secondary-sm"
                >
                  Saiba Mais Sobre a Região
                </Link>
              </div>
              <div className="bg-gray-300 h-80 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Imagem da Região</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-primary text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Você é um Produtor de Morangos?</h2>
          <p className="text-xl mb-8">
            Junte-se à Strawberry Route e conecte-se com empresas e compradores interessados em morangos de qualidade do Sul de Minas.
          </p>
          <Link 
            href="/users/signup"
            className="btn-secondary"
          >
            Cadastre-se como Produtor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
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
              <li><Link href="/producers" className="text-gray-400 hover:text-white transition">Produtores</Link></li>
              <li><Link href="/region" className="text-gray-400 hover:text-white transition">Região</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-white transition">Área do Produtor</Link></li>
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
    </main>
  );
}