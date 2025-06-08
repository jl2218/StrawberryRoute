"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeJwt } from "@/utils/auth";
import "react-toastify/dist/ReactToastify.css";

export default function ProducerDashboard() {
  const [producer, setProducer] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decoded = decodeJwt(token);
    if (decoded.role !== "PRODUCER") {
      router.push("/login");
      return;
    }
    fetchProducer(token);
    fetchVisits(token);
  }, []);

  const fetchProducer = async (token: string) => {
    try {
      const res = await fetch("/api/producers/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducer(await res.json());
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
  };

  const fetchVisits = async (token: string) => {
    try {
      const res = await fetch("/api/producers/visits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setVisits(await res.json());
      }
    } catch {}
    setLoading(false);
  };

  if (loading) return <div>Carregando...</div>;
  if (!producer) return null;

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Área do Produtor</h1>
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Seus dados</h2>
        <div className="flex items-center gap-4">
          {producer.imageUrl && (
            <img src={producer.imageUrl} alt="Produtor" className="w-24 h-24 rounded-full object-cover" />
          )}
          <div>
            <div><b>Nome:</b> {producer.name}</div>
            <div><b>Cidade:</b> {producer.city}</div>
            <div><b>Telefone:</b> {producer.phone}</div>
            <div><b>Métodos de cultivo:</b> {producer.cultivationMethods?.join(", ")}</div>
            <button className="btn-secondary mt-2" onClick={() => setShowEditModal(true)}>
              Editar dados
            </button>
          </div>
        </div>
      </section>
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Visitas agendadas</h2>
        {visits.length === 0 ? (
          <div>Nenhuma visita agendada.</div>
        ) : (
          <ul className="divide-y">
            {visits.map((visit) => (
              <li key={visit.id} className="py-2">
                <b>{visit.name}</b> - {visit.date?.slice(0, 10)} - {visit.status}
              </li>
            ))}
          </ul>
        )}
      </section>
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Editar dados</h2>
            {/* Formulário de edição será implementado após a API */}
            <button className="btn" onClick={() => setShowEditModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
}

