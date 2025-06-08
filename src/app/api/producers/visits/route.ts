import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { authorize } from '@/middlewares/authMiddleware';

// GET: retorna visitas do produtor autenticado
export async function GET(request: Request) {
  const auth = await authorize(['PRODUCER'])(request);
  if (auth) return auth;
  const user: any = (request as any).user;
  const producer = await prisma.producer.findUnique({
    where: { userId: user.userId },
    select: { id: true },
  });
  if (!producer) {
    return NextResponse.json({ message: 'Produtor não encontrado' }, { status: 404 });
  }
  const visits = await prisma.visit.findMany({
    where: { producerId: producer.id },
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(visits);
}

// POST: cria uma nova visita para um produtor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, producerId } = body;
    if (!name || !email || !phone || !date || !producerId) {
      return NextResponse.json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' }, { status: 400 });
    }
    // Cria a visita
    const visit = await prisma.visit.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        producerId: Number(producerId),
        status: 'PENDING',
      },
    });
    return NextResponse.json({ message: 'Visita agendada com sucesso!', visit });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao agendar visita.' }, { status: 500 });
  }
}
