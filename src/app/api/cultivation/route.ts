import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { authorize } from '@/middlewares/authMiddleware';

/**
 * @swagger
 * /api/cultivation:
 *   get:
 *     summary: Retorna todas as informações de cultivo
 *     description: Retorna uma lista de todas as informações de cultivo cadastradas.
 *     responses:
 *       200:
 *         description: Lista de informações de cultivo.
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
 *                     example: "Cultivo Orgânico"
 *                   content:
 *                     type: string
 *                     example: "O cultivo orgânico de morangos utiliza técnicas naturais..."
 *                   imageUrl:
 *                     type: string
 *                     example: "/images/cultivation/organic.jpg"
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
 *                   example: "Erro ao buscar informações de cultivo"
 */
export async function GET() {
  try {
    const cultivationInfo = await prisma.cultivationInfo.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(cultivationInfo);
  } catch (error) {
    console.error('Erro ao buscar informações de cultivo:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar informações de cultivo' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/cultivation:
 *   post:
 *     summary: Cria uma nova informação de cultivo
 *     description: Cria uma nova informação de cultivo com os dados fornecidos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados da informação de cultivo.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Cultivo Orgânico"
 *               content:
 *                 type: string
 *                 example: "O cultivo orgânico de morangos utiliza técnicas naturais..."
 *               imageUrl:
 *                 type: string
 *                 example: "/images/cultivation/organic.jpg"
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Informação de cultivo criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Informação de cultivo criada com sucesso"
 *                 cultivationInfo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Cultivo Orgânico"
 *                     content:
 *                       type: string
 *                       example: "O cultivo orgânico de morangos utiliza técnicas naturais..."
 *                     imageUrl:
 *                       type: string
 *                       example: "/images/cultivation/organic.jpg"
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
 *                   example: "Erro ao criar informação de cultivo"
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

    const cultivationInfo = await prisma.cultivationInfo.create({
      data: {
        title,
        content,
        imageUrl,
      },
    });

    return NextResponse.json(
      { message: 'Informação de cultivo criada com sucesso', cultivationInfo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar informação de cultivo:', error);
    return NextResponse.json(
      { message: 'Erro ao criar informação de cultivo' },
      { status: 500 }
    );
  }
}