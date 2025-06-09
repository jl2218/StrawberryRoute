import { prisma } from '@/lib/prisma';
import {NextResponse} from 'next/server';
import {authorize} from "@/middlewares/authMiddleware";

/**
 * @swagger
 * /api/producers:
 *   get:
 *     summary: Retorna todos os produtores
 *     description: Retorna uma lista de todos os produtores cadastrados.
 *     responses:
 *       200:
 *         description: Lista de produtores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "João Silva"
 *                   description:
 *                     type: string
 *                     example: "Produtor de morangos orgânicos há mais de 15 anos..."
 *                   phone:
 *                     type: string
 *                     example: "(35) 99876-5432"
 *                   address:
 *                     type: string
 *                     example: "Estrada Rural, Km 5"
 *                   city:
 *                     type: string
 *                     example: "Pouso Alegre"
 *                   state:
 *                     type: string
 *                     example: "Minas Gerais"
 *                   zipCode:
 *                     type: string
 *                     example: "37550-000"
 *                   latitude:
 *                     type: number
 *                     format: float
 *                     example: -22.2293
 *                   longitude:
 *                     type: number
 *                     format: float
 *                     example: -45.9338
 *                   cultivationMethods:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Orgânico", "Semi-hidropônico"]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar produtores"
 */
export async function GET() {
  try {
    const producers = await prisma.producer.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(producers);
  } catch (error) {
    console.error('Erro ao buscar produtores:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar produtores' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/producers:
 *   put:
 *     summary: Atualiza os dados do produtor autenticado
 *     description: Atualiza os dados cadastrais do produtor com base no token de autenticação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               zipCode: { type: string }
 *               latitude: { type: number, format: float }
 *               longitude: { type: number, format: float }
 *               cultivationMethods: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
export async function PUT(request: Request) {
  try {
    const auth = await authorize(['PRODUCER'])(request);
    if (auth) return auth;

    const body = await request.json();
    const {
      name,
      description,
      phone,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      cultivationMethods,
    } = body;

    const user: any = (request as any).user;

    console.log(user);
    const updated = await prisma.producer.update({
      where: { userId: user.userId },
      data: {
        name,
        description,
        phone,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        cultivationMethods,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar produtor:', error);
    return NextResponse.json({ message: 'Erro ao atualizar produtor' }, { status: 500 });
  }
}