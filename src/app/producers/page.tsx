"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
import TopBanner from "@/components/top-banner";
import Footer from "@/components/footer";
import {useRouter, useSearchParams} from "next/navigation";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const ProducerMap = dynamic(() => import("./ProducerMap"), { ssr: false });

interface Producer {
  id: number;
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  cultivationMethods: string[];
}

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [visitName, setVisitName] = useState("");
  const [visitEmail, setVisitEmail] = useState("");
  const [visitPhone, setVisitPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitMessage, setVisitMessage] = useState("");
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState("");
  const [visitError, setVisitError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await fetch('/api/producers');
        if (response.ok) {
          const data = await response.json();
          setProducers(data);
        } else {
          console.error('Erro ao buscar produtores');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtores:', error);
        setIsLoading(false);
      }
    };

    fetchProducers();
  }, [searchParams]);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && producers.length > 0) {
      const found = producers.find(p => p.id === Number(idFromUrl));
      if (found) {
        setSelectedProducer(found);
      }
    }
  }, [searchParams, producers]);

  const filteredProducers = producers.filter(producer => {
    const matchesSearch = producer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         producer.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterMethod ? producer.cultivationMethods.includes(filterMethod) : true;

    return matchesSearch && matchesFilter;
  });

  const allCultivationMethods = Array.from(
    new Set(producers.flatMap(producer => producer.cultivationMethods))
  );

  return (
    <main className="min-h-screen bg-white">
      <TopBanner></TopBanner>
      {/* Header */}
      <header className="bg-primary-light py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Produtores de Morango</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça os produtores de morango do Sul de Minas Gerais e entre em contato diretamente para negociações ou visitas.
          </p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar por nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-full md:w-1/3">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos os métodos de cultivo</option>
              {allCultivationMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Map and Producers List Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Producers List */}
          <div className="lg:col-span-1 overflow-y-auto max-h-[600px] pr-4">
            <h2 className="text-2xl font-bold mb-6">Produtores ({filteredProducers.length})</h2>

            {isLoading ? (
              <div className="text-center py-8">Carregando produtores...</div>
            ) : filteredProducers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum produtor encontrado com os filtros selecionados.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducers.map((producer) => (
                  <div 
                    key={producer.id} 
                    className={`bg-white rounded-lg shadow-md p-4 border-l-4 cursor-pointer transition duration-300 hover:shadow-lg ${
                      selectedProducer?.id === producer.id ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedProducer(producer);
                      router.replace("/producers", { scroll: false });
                    }}
                  >
                    <h3 className="text-xl font-bold mb-2">{producer.name}</h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-primary" />
                      {producer.city}, {producer.state}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {producer.cultivationMethods.map((method, index) => (
                        <span key={index} className="bg-secondary-light text-secondary px-3 py-1 rounded-full text-sm">
                          {method}
                        </span>
                      ))}
                    </div>
                    {/*<Link */}
                    {/*  href={`/producers/${producer.id}`}*/}
                    {/*  className="text-primary hover:underline font-medium"*/}
                    {/*>*/}
                    {/*  Ver detalhes*/}
                    {/*</Link>*/}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-hidden h-[600px]">
            {!isLoading && (
              <ProducerMap 
                producers={filteredProducers} 
                selectedProducer={selectedProducer}
                setSelectedProducer={setSelectedProducer}
              />
            )}
          </div>
        </div>
      </section>

      {/* Selected Producer Details */}
      {selectedProducer && (
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedProducer.name}</h2>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary" />
                    {selectedProducer.address}, {selectedProducer.city}, {selectedProducer.state}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProducer(null);
                    router.replace("/producers", { scroll: false });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Sobre o Produtor</h3>
                  <p className="text-gray-700 mb-4">{selectedProducer.description}</p>

                  <h4 className="font-bold mt-6 mb-2">Métodos de Cultivo:</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProducer.cultivationMethods.map((method, index) => (
                      <span key={index} className="bg-secondary-light text-secondary px-3 py-1 rounded-full text-sm">
                        {method}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-bold mt-6 mb-2">Contato:</h4>
                  <p className="flex items-center mb-2">
                    <FaPhone className="mr-2 text-primary" />
                    {selectedProducer.phone}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Agendar Visita</h3>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setVisitLoading(true);
                    setVisitSuccess("");
                    setVisitError("");
                    try {
                      const res = await fetch("/api/producers/visits", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: visitName,
                          email: visitEmail,
                          phone: visitPhone,
                          date: visitDate,
                          producerId: selectedProducer.id,
                          message: visitMessage,
                        }),
                      });
                      if (res.ok) {
                        setVisitSuccess("Visita agendada com sucesso!");
                        setVisitName("");
                        setVisitEmail("");
                        setVisitPhone("");
                        setVisitDate("");
                        setVisitMessage("");
                      } else {
                        const data = await res.json();
                        setVisitError(data.message || "Erro ao agendar visita");
                      }
                    } catch {
                      setVisitError("Erro ao agendar visita");
                    }
                    setVisitLoading(false);
                  }}>
                    <div>
                      <label className="block text-gray-700 mb-2">Nome</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Seu nome completo"
                        value={visitName}
                        onChange={e => setVisitName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="seu@email.com"
                        value={visitEmail}
                        onChange={e => setVisitEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Telefone</label>
                      <input 
                        type="tel" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="(00) 00000-0000"
                        value={visitPhone}
                        onChange={e => setVisitPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Data da Visita</label>
                      <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={visitDate}
                        onChange={e => setVisitDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Mensagem (opcional)</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Detalhes adicionais sobre sua visita..."
                        rows={3}
                        value={visitMessage}
                        onChange={e => setVisitMessage(e.target.value)}
                      ></textarea>
                    </div>
                    {visitSuccess && <div className="text-green-600 font-semibold">{visitSuccess}</div>}
                    {visitError && <div className="text-red-600 font-semibold">{visitError}</div>}
                    <button
                      type="submit"
                      className="w-full btn-secondary"
                      disabled={visitLoading}
                    >
                      {visitLoading ? "Enviando..." : "Solicitar Visita"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer></Footer>
    </main>
  );
}
