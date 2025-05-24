import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { authorize } from '@/middlewares/authMiddleware';

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Faz upload de uma imagem
 *     description: Faz upload de uma imagem para o servidor.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [region, cultivation, producer]
 *                 description: Tipo de imagem (região, cultivo ou produtor)
 *             required:
 *               - file
 *               - type
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload realizado com sucesso"
 *                 imageUrl:
 *                   type: string
 *                   example: "/images/region/image-1234567890.jpg"
 *       400:
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Arquivo e tipo são obrigatórios"
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
 *                   example: "Erro ao fazer upload da imagem"
 */
export async function POST(request: Request) {
  const authResult = await authorize(['ADMIN'])(request);
  if (authResult) {
    return authResult;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { message: 'Arquivo e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['region', 'cultivation', 'producers'].includes(type)) {
      return NextResponse.json(
        { message: 'Tipo inválido. Deve ser region, cultivation ou producers' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const filename = `image-${timestamp}.${extension}`;

    // Define the path where the file will be saved
    const path = join(process.cwd(), 'public', 'images', type, filename);
    
    // Save the file
    await writeFile(path, buffer);

    // Return the URL to access the image
    const imageUrl = `/images/${type}/${filename}`;

    return NextResponse.json({
      message: 'Upload realizado com sucesso',
      imageUrl,
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return NextResponse.json(
      { message: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}