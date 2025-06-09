// app/producers/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import TopBanner from "@/components/top-banner";
import Footer from "@/components/footer";

import "leaflet/dist/leaflet.css";

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

function useVisitForm(producerId: number) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/producers/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, date, message, producerId }),
      });
      if (res.ok) {
        setSuccess("Visita agendada com sucesso!");
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setMessage("");
      } else {
        const data = await res.json();
        setError(data.message || "Erro ao agendar visita");
      }
    } catch {
      setError("Erro ao agendar visita");
    }
    setLoading(false);
  };

  return {
    name, setName,
    email, setEmail,
    phone, setPhone,
    date, setDate,
    message, setMessage,
    loading, success, error,
    submit,
  };
}

function ProducerCard({
                        producer,
                        selected,
                        onClick,
                      }: {
  producer: Producer;
  selected: boolean;
  onClick: () => void;
}) {
  return (
      <div
          className={`bg-white rounded-lg shadow-md p-4 border-l-4 cursor-pointer transition duration-300 hover:shadow-lg ${
              selected ? 'border-primary' : 'border-gray-200'
          }`}
          onClick={onClick}
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
      </div>
  );
}

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
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
      } catch (error) {
        console.error('Erro ao buscar produtores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducers();
  }, [searchParams]);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && producers.length > 0) {
      const found = producers.find(p => p.id === Number(idFromUrl));
      if (found) setSelectedProducer(found);
    }
  }, [searchParams, producers]);

  const filteredProducers = useMemo(() => {
    return producers.filter(producer => {
      const matchesSearch = producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producer.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterMethod ? producer.cultivationMethods.includes(filterMethod) : true;
      return matchesSearch && matchesFilter;
    });
  }, [producers, searchTerm, filterMethod]);

  const allCultivationMethods = useMemo(() => {
    return Array.from(new Set(producers.flatMap(p => p.cultivationMethods)));
  }, [producers]);

  const visitForm = useVisitForm(selectedProducer?.id || 0);

  return (
      <main className="min-h-screen bg-white">
        <TopBanner />

        <header className="bg-primary-light py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Produtores de Morango</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça os produtores de morango do Sul de Minas Gerais e entre em contato diretamente para negociações ou visitas.
            </p>
          </div>
        </header>

        <section className="py-8 px-4 bg-white border-b">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos os métodos de cultivo</option>
              {allCultivationMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 overflow-y-auto max-h-[600px] pr-4">
              <h2 className="text-2xl font-bold mb-6">Produtores ({filteredProducers.length})</h2>
              {isLoading ? (
                  <div className="text-center py-8">Carregando produtores...</div>
              ) : filteredProducers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhum produtor encontrado com os filtros selecionados.</div>
              ) : (
                  <div className="space-y-6">
                    {filteredProducers.map(producer => (
                        <ProducerCard
                            key={producer.id}
                            producer={producer}
                            selected={selectedProducer?.id === producer.id}
                            onClick={() => {
                              setSelectedProducer(producer);
                              router.replace("/producers", { scroll: false });
                            }}
                        />
                    ))}
                  </div>
              )}
            </div>

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
                    >Fechar</button>
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
                      <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        visitForm.submit();
                      }}>
                        <input type="text" placeholder="Nome completo" value={visitForm.name} onChange={e => visitForm.setName(e.target.value)} required className="w-full p-3 border rounded-lg" />
                        <input type="email" placeholder="seu@email.com" value={visitForm.email} onChange={e => visitForm.setEmail(e.target.value)} required className="w-full p-3 border rounded-lg" />
                        <input type="tel" placeholder="(00) 00000-0000" value={visitForm.phone} onChange={e => visitForm.setPhone(e.target.value)} required className="w-full p-3 border rounded-lg" />
                        <input type="date" value={visitForm.date} onChange={e => visitForm.setDate(e.target.value)} required className="w-full p-3 border rounded-lg" />
                        <textarea placeholder="Detalhes adicionais" value={visitForm.message} onChange={e => visitForm.setMessage(e.target.value)} className="w-full p-3 border rounded-lg"></textarea>
                        {visitForm.success && <div className="text-green-600 font-semibold">{visitForm.success}</div>}
                        {visitForm.error && <div className="text-red-600 font-semibold">{visitForm.error}</div>}
                        <button type="submit" disabled={visitForm.loading} className="w-full btn-secondary">
                          {visitForm.loading ? "Enviando..." : "Solicitar Visita"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        )}
        <Footer />
      </main>
  );
}
