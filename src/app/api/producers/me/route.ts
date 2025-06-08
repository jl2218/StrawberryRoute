import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { authorize } from '@/middlewares/authMiddleware';

// GET: retorna dados do produtor autenticado
export async function GET(request: Request) {
  const auth = await authorize(['PRODUCER'])(request);
  if (auth) return auth;
  const user: any = (request as any).user;
  const producer = await prisma.producer.findUnique({
    where: { userId: user.userId },
  });
  if (!producer) {
    return NextResponse.json({ message: 'Produtor não encontrado' }, { status: 404 });
  }
  return NextResponse.json(producer);
}

// PUT: atualiza dados do produtor autenticado
export async function PUT(request: Request) {
  const authResponse = await authorize(['PRODUCER'])(request);
  if (authResponse) return authResponse;

  const user: any = (request as any).user;
  const data = await request.json();
  try {
    const updated = await prisma.producer.update({
      where: { userId: user.userId },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Erro ao atualizar dados' }, { status: 400 });
  }
}

