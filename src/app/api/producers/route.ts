import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

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