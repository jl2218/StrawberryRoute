"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaMapMarkerAlt, FaChartLine } from "react-icons/fa";
import TopBanner from "@/components/top-banner";
import Footer from "@/components/footer";

interface RegionInfo {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

interface CultivationInfo {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export default function RegionPage() {
  const [regionInfo, setRegionInfo] = useState<RegionInfo[]>([]);
  const [cultivationInfo, setCultivationInfo] = useState<CultivationInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch region info
        const regionResponse = await fetch('/api/regions');
        if (regionResponse.ok) {
          const regionData = await regionResponse.json();
          setRegionInfo(regionData);
        } else {
          console.error('Erro ao buscar informações de regiões');
        }

        // Fetch cultivation info
        const cultivationResponse = await fetch('/api/cultivation');
        if (cultivationResponse.ok) {
          const cultivationData = await cultivationResponse.json();
          setCultivationInfo(cultivationData);
        } else {
          console.error('Erro ao buscar informações de cultivo');
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
      {/* Header */}
      <header className="bg-primary-light py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sul de Minas Gerais</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça a região que produz os melhores morangos do Brasil e os métodos de cultivo utilizados pelos produtores locais.
          </p>
        </div>
      </header>

      {/* Region Information Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">A Região</h2>

          {isLoading ? (
            <div className="text-center py-8">Carregando informações...</div>
          ) : (
            <div className="space-y-16">
              {regionInfo.map((info, index) => (
                <div 
                  key={info.id} 
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-center mb-4">
                      {index === 0 ? (
                        <FaMapMarkerAlt className="text-primary text-2xl mr-3" />
                      ) : index === 1 ? (
                        <FaChartLine className="text-primary text-2xl mr-3" />
                      ) : (
                        <FaLeaf className="text-primary text-2xl mr-3" />
                      )}
                      <h3 className="text-2xl font-bold text-gray-800">{info.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {info.content}
                    </p>
                    {index === 0 && (
                      <div className="bg-secondary-light p-4 rounded-lg border-l-4 border-secondary">
                        <p className="text-gray-700">
                          <strong>Clima:</strong> Temperado de altitude<br />
                          <strong>Temperatura média:</strong> 15°C a 25°C<br />
                          <strong>Altitude:</strong> 800 a 1.400 metros<br />
                          <strong>Principais cidades produtoras:</strong> Pouso Alegre, Cambuí, Gonçalves, Estiva, Senador Amaral
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`relative h-80 w-full rounded-lg overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {info.imageUrl ? (
                        <Image
                            src={info.imageUrl}
                            alt={info.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                          <p className="text-gray-600">Imagem da {info.title}</p>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cultivation Methods Section */}
      <section className="py-16 px-4 bg-secondary-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Métodos de Cultivo</h2>

          {isLoading ? (
            <div className="text-center py-8">Carregando informações...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cultivationInfo.map((info) => (
                <div key={info.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden">
                    {info.imageUrl ? (
                        <Image
                            src={info.imageUrl}
                            alt={info.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="bg-gray-300 h-full w-full flex items-center justify-center">
                          <p className="text-gray-600">Imagem de {info.title}</p>
                        </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{info.title}</h3>
                    <p className="text-gray-700 mb-4">{info.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {info.id === 1 ? 'Sustentável' : info.id === 2 ? 'Alta tecnologia' : 'Tradicional'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        info.id === 1 ? 'bg-green-100 text-green-800' : 
                        info.id === 2 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {info.id === 1 ? 'Baixo impacto' : info.id === 2 ? 'Alta produtividade' : 'Sabor intenso'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-primary text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Conheça os Produtores da Região</h2>
          <p className="text-xl mb-8">
            Entre em contato com os produtores de morango do Sul de Minas e descubra produtos de qualidade para o seu negócio.
          </p>
          <Link 
            href="/producers"
            className="btn-secondary"
          >
            Ver Produtores
          </Link>
        </div>
      </section>
      <Footer></Footer>
    </main>
  );
}
