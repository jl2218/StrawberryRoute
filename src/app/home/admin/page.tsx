"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { IoLogOutOutline } from "react-icons/io5";


export default function AdminHome() {
  const router = useRouter();
  useAuth('ADMIN');

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      <h1 className="text-3xl font-bold mb-4 absolute top-4">Bem-vindo!</h1>
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-black text-white rounded px-4 py-2 hover:bg-red-600 transition flex items-center space-x-2"
      >
        <IoLogOutOutline className="text-lg" /> { }
      </button>

    </main>
  );
}
