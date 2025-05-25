"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBanner from "@/components/top-banner";
import Footer from "@/components/footer";

interface Producer {
  id: number;
  name: string;
  description: string;
  city: string;
  cultivationMethods: string[];
  imageUrl?: string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch producers
        const producersResponse = await fetch('/api/producers');
        if (producersResponse.ok) {
          const producersData = await producersResponse.json();
          setProducers(producersData);
        } else {
          console.error('Erro ao buscar produtores');
        }

        // Fetch region info
        const regionResponse = await fetch('/api/regions');
        if (regionResponse.ok) {
          const regionData = await regionResponse.json();
          setRegionInfo(regionData);
        } else {
          console.error('Erro ao buscar informações de regiões');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <TopBanner></TopBanner>
      {/* Featured Producers Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Produtores em Destaque</h2>

        {isLoading ? (
          <div className="text-center">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {producers.map((producer) => (
              <div key={producer.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
                <div className="h-48 relative">
                  {producer.imageUrl ? (
                    <Image
                      src={producer.imageUrl}
                      alt={`Foto de ${producer.name}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary-light flex items-center justify-center">
                      <Image
                        src="/icons/strawberry-logo.svg"
                        alt="Strawberry Route Logo"
                        width={60}
                        height={60}
                      />
                    </div>
                  )}
                </div>
                <div className="p-6">

                  <h3 className="text-xl font-bold mb-2 text-gray-800">{producer.name}</h3>
                  <h4 className="text-lg text-gray-600 mb-4">{producer.city}</h4>
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
            className="btn-secondary"
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
              <div className="relative h-80 w-full rounded-lg overflow-hidden">
                {regionInfo[0] ? (
                    regionInfo[0].imageUrl ? (
                        <Image
                            src={regionInfo[0].imageUrl}
                            alt={regionInfo[0].title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                          <p className="text-gray-600">Imagem da {regionInfo[0].title}</p>
                        </div>
                    )
                ) : (
                    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                      <p className="text-gray-500 italic">Informações da região não disponíveis</p>
                    </div>
                )}
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

      <Footer></Footer>
    </main>
  );
}
