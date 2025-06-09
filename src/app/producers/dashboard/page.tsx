"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { decodeJwt } from "@/utils/auth";
import { FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

export default function ProducerDashboard() {
  const [producer, setProducer] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    const decoded = decodeJwt(token);
    if (decoded.role !== "PRODUCER") return router.push("/login");
    fetchProducer(token);
    fetchVisits(token);
  }, []);

  const fetchProducer = async (token: string) => {
    try {
      const res = await fetch("/api/producers/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducer({
          state: "",
          zipCode: "",
          latitude: "",
          longitude: "",
          cultivationMethods: [],
          ...data,
        });
        if (data.imageUrl) setPreviewUrl(data.imageUrl);
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
      if (res.ok) setVisits(await res.json());
    } catch {}
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCultivationToggle = (method: string) => {
    const updated = producer.cultivationMethods.includes(method)
        ? producer.cultivationMethods.filter((m: string) => m !== method)
        : [...producer.cultivationMethods, method];
    setProducer({ ...producer, cultivationMethods: updated });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", producer.name);
      formData.append("description", producer.description);
      formData.append("phone", producer.phone);
      formData.append("address", producer.address);
      formData.append("city", producer.city);
      formData.append("state", producer.state);
      formData.append("zipCode", producer.zipCode);
      formData.append("latitude", producer.latitude);
      formData.append("longitude", producer.longitude);
      formData.append("cultivationMethods", JSON.stringify(producer.cultivationMethods));
      const file = fileInputRef.current?.files?.[0];
      if (file) formData.append("profilePicture", file);

      const res = await fetch("/api/producers", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProducer(data);
        setShowEditModal(false);
        toast.success("Dados atualizados com sucesso!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Erro ao atualizar dados");
      }
    } catch (err) {
      toast.error("Erro na requisição: " + err);
    }
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;
  if (!producer) return null;

  return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-gray-800">Área do Produtor</h1>

          <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Seus dados</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {previewUrl && (
                  <Image src={previewUrl} alt="Foto do produtor" width={112} height={112} className="rounded-full object-cover border" />
              )}
              <div className="text-gray-700 w-full">
                <p className="mb-2"><strong>Nome:</strong> {producer.name}</p>
                <p className="mb-2"><strong>Cidade:</strong> {producer.city}</p>
                <p className="mb-2"><strong>Telefone:</strong> {producer.phone}</p>
                <p className="mb-4"><strong>Métodos de cultivo:</strong> {producer.cultivationMethods?.join(", ")}</p>
                <button onClick={() => setShowEditModal(true)} className="btn-secondary">Editar dados</button>
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

        </div>

        {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                <button onClick={() => setShowEditModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Fechar">
                  <FaTimes size={18} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Editar dados</h2>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={producer.name} onChange={e => setProducer({ ...producer, name: e.target.value })} placeholder="Nome" className="border p-2 rounded" required />
                  <input type="text" value={producer.city} onChange={e => setProducer({ ...producer, city: e.target.value })} placeholder="Cidade" className="border p-2 rounded" required />
                  <input type="text" value={producer.phone} onChange={e => setProducer({ ...producer, phone: e.target.value })} placeholder="Telefone" className="border p-2 rounded" required />
                  <input type="text" value={producer.address} onChange={e => setProducer({ ...producer, address: e.target.value })} placeholder="Endereço" className="border p-2 rounded" />
                  <input type="text" value={producer.state} onChange={e => setProducer({ ...producer, state: e.target.value })} placeholder="Estado" className="border p-2 rounded" />
                  <input type="text" value={producer.zipCode} onChange={e => setProducer({ ...producer, zipCode: e.target.value })} placeholder="CEP" className="border p-2 rounded" />
                  <input type="text" value={producer.latitude} onChange={e => setProducer({ ...producer, latitude: e.target.value })} placeholder="Latitude" className="border p-2 rounded" />
                  <input type="text" value={producer.longitude} onChange={e => setProducer({ ...producer, longitude: e.target.value })} placeholder="Longitude" className="border p-2 rounded" />
                  <textarea value={producer.description} onChange={e => setProducer({ ...producer, description: e.target.value })} placeholder="Descrição" rows={3} className="md:col-span-2 border p-2 rounded" />

                  {/* Métodos de cultivo */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-sm text-gray-700 mb-1">Métodos de Cultivo</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Orgânico", "Hidropônico", "Tradicional", "Semi-hidropônico", "Vertical", "Familiar"].map((method) => (
                          <label key={method} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={producer.cultivationMethods.includes(method)}
                                onChange={() => handleCultivationToggle(method)}
                            />
                            {method}
                          </label>
                      ))}
                    </div>
                  </div>

                  {/* Foto de perfil */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-sm text-gray-700 mb-2">Foto de Perfil</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-full overflow-hidden bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Preview" width={96} height={96} className="object-cover w-full h-full rounded-full" />
                        ) : (
                            <span className="text-gray-400 text-sm text-center">Clique para<br />adicionar foto</span>
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary hover:underline text-sm">
                        {previewUrl ? "Alterar foto" : "Adicionar foto"}
                      </button>
                      {previewUrl && (
                          <button type="button" onClick={() => { setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = "" }} className="text-red-500 hover:underline text-sm">
                            Remover
                          </button>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn-secondary md:col-span-2 mt-4">Salvar alterações</button>
                </form>
              </div>
            </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar pauseOnHover />
      </main>
  );
}
