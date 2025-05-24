import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { authorize } from '@/middlewares/authMiddleware';

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Retorna todas as informações de regiões
 *     description: Retorna uma lista de todas as informações de regiões cadastradas.
 *     responses:
 *       200:
 *         description: Lista de informações de regiões.
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
 *                   title:
 *                     type: string
 *                     example: "Sul de Minas - O Paraíso dos Morangos"
 *                   content:
 *                     type: string
 *                     example: "O Sul de Minas Gerais é conhecido por seu clima ameno..."
 *                   imageUrl:
 *                     type: string
 *                     example: "/images/region/sul-minas.jpg"
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
 *                   example: "Erro ao buscar informações de regiões"
 */
export async function GET() {
  try {
    const regions = await prisma.regionInfo.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(regions);
  } catch (error) {
    console.error('Erro ao buscar informações de regiões:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar informações de regiões' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/regions:
 *   post:
 *     summary: Cria uma nova informação de região
 *     description: Cria uma nova informação de região com os dados fornecidos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados da informação de região.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sul de Minas - O Paraíso dos Morangos"
 *               content:
 *                 type: string
 *                 example: "O Sul de Minas Gerais é conhecido por seu clima ameno..."
 *               imageUrl:
 *                 type: string
 *                 example: "/images/region/sul-minas.jpg"
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Informação de região criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Informação de região criada com sucesso"
 *                 region:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Sul de Minas - O Paraíso dos Morangos"
 *                     content:
 *                       type: string
 *                       example: "O Sul de Minas Gerais é conhecido por seu clima ameno..."
 *                     imageUrl:
 *                       type: string
 *                       example: "/images/region/sul-minas.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Título e conteúdo são obrigatórios"
 *       401:
 *         description: Não autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido"
 *       403:
 *         description: Acesso negado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso negado"
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao criar informação de região"
 */
export async function POST(request: Request) {
  const authResult = await authorize(['ADMIN'])(request);
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { title, content, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    const region = await prisma.regionInfo.create({
      data: {
        title,
        content,
        imageUrl,
      },
    });

    return NextResponse.json(
      { message: 'Informação de região criada com sucesso', region },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar informação de região:', error);
    return NextResponse.json(
      { message: 'Erro ao criar informação de região' },
      { status: 500 }
    );
  }
}