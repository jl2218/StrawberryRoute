"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { decodeJwt } from "@/utils/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const signupSuccessMessage = localStorage.getItem('signupSuccessMessage');
    if (signupSuccessMessage) {
      toast.success(signupSuccessMessage);
      localStorage.removeItem('signupSuccessMessage');
    }

    const changePasswordSuccessMessage = localStorage.getItem('changePasswordSuccessMessage');
    if (changePasswordSuccessMessage) {
      toast.success(changePasswordSuccessMessage);
      localStorage.removeItem('changePasswordSuccessMessage');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        const decodedToken = decodeJwt(data.token);

        switch (decodedToken.role) {
          case 'ADMIN':
            router.push('/home');
            break;
          default:
            router.push('/login');
            break;
        }

      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch {
      toast.error('Erro ao enviar requisição');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">

      <header className="mb-8 text-center">
        <div className="flex flex-col items-center">
          <Image
            src="/icons/strawberry-logo.svg"
            alt="Strawberry Route Logo"
            width={100}
            height={100}
            className="mx-auto mb-2"
          />
          <h1 className="text-3xl font-bold text-primary">Strawberry Route</h1>
          <p className="text-sm text-gray-600 mt-1">Sul de Minas Gerais</p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md w-full max-w-sm border-radius rounded-lg shadow-lg w-full max-w-lg border"
      >
        <input
          type="text"
          placeholder="Nome do usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded text-black"
          required
          color="black"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded text-black"
          required
        />
        <button
          type="submit"
          className="btn-secondary"
        >
          Entrar
        </button>
        <article className="mt-4 flex justify-between text-left">
          <Link href="/users/signup" className="text-primary hover:underline">
            Criar nova conta
          </Link>
          <Link href="/users/forgot-password" className="text-primary hover:underline">
            Esqueci minha senha
          </Link>
        </article>
      </form>
    </main>
  );
}
