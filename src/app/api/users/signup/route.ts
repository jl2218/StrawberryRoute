import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Cria um novo usuário ou produtor
 *     description: Cria um novo usuário no sistema fornecendo nome de usuário, senha e e-mail. Opcionalmente, cria um perfil de produtor associado ao usuário.
 *     requestBody:
 *       description: Dados necessários para registrar um novo usuário ou produtor.
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário do novo usuário.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Senha do novo usuário.
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 description: E-mail do novo usuário.
 *                 example: "johndoe@example.com"
 *               isProducer:
 *                 type: boolean
 *                 description: Indica se o usuário é um produtor.
 *                 example: true
 *               name:
 *                 type: string
 *                 description: Nome do produtor.
 *                 example: "Fazenda Morango Feliz"
 *               description:
 *                 type: string
 *                 description: Descrição do produtor.
 *                 example: "Produzimos morangos orgânicos de alta qualidade."
 *               phone:
 *                 type: string
 *                 description: Telefone do produtor.
 *                 example: "(35) 99999-9999"
 *               address:
 *                 type: string
 *                 description: Endereço do produtor.
 *                 example: "Estrada Rural, Km 5"
 *               city:
 *                 type: string
 *                 description: Cidade do produtor.
 *                 example: "Pouso Alegre"
 *               state:
 *                 type: string
 *                 description: Estado do produtor.
 *                 example: "Minas Gerais"
 *               zipCode:
 *                 type: string
 *                 description: CEP do produtor.
 *                 example: "37550-000"
 *               latitude:
 *                 type: number
 *                 description: Latitude da localização do produtor.
 *                 example: -22.2293
 *               longitude:
 *                 type: number
 *                 description: Longitude da localização do produtor.
 *                 example: -45.9338
 *               cultivationMethods:
 *                 type: string
 *                 description: Métodos de cultivo do produtor (JSON string).
 *                 example: '["Orgânico", "Semi-hidropônico"]'
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Foto de perfil do produtor.
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário criado com sucesso"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       400:
 *         description: Campos obrigatórios não preenchidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios"
 *       500:
 *         description: Erro ao criar o usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao criar usuário"
 *                 error:
 *                   type: string
 *                   example: "Mensagem de erro detalhada"
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract basic user data
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const email = formData.get('email') as string;
    const isProducer = formData.get('isProducer') === 'true';

    if (!username || !password || !email) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with appropriate role
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: isProducer ? 'PRODUCER' : 'ADMIN',
      },
    });

    // If user is a producer, create producer profile
    if (isProducer) {
      // Extract producer data
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const phone = formData.get('phone') as string;
      const address = formData.get('address') as string;
      const city = formData.get('city') as string;
      const state = formData.get('state') as string;
      const zipCode = formData.get('zipCode') as string;
      const latitude = parseFloat(formData.get('latitude') as string);
      const longitude = parseFloat(formData.get('longitude') as string);
      const cultivationMethodsJson = formData.get('cultivationMethods') as string;
      const cultivationMethods = JSON.parse(cultivationMethodsJson);

      // Handle profile picture upload
      const profilePicture = formData.get('profilePicture') as File;
      let imageUrl = null;

      if (profilePicture) {
        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const timestamp = Date.now();
        const originalName = profilePicture.name;
        const extension = originalName.split('.').pop();
        const filename = `producer-${user.id}-${timestamp}.${extension}`;

        // Define the path where the file will be saved
        const path = join(process.cwd(), 'public', 'images', 'producers', filename);

        // Save the file
        await writeFile(path, buffer);

        // Set the URL to access the image
        imageUrl = `/images/producers/${filename}`;
      }

      // Create producer profile
      // Create data object with explicit type
      const producerData: {
        userId: number;
        name: string;
        description: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        latitude: number;
        longitude: number;
        cultivationMethods: string[];
        imageUrl?: string;
      } = {
        userId: user.id,
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
      };

      // Conditionally add imageUrl field
      if (imageUrl) {
        producerData.imageUrl = imageUrl;
      }

      const producer = await prisma.producer.create({
        data: producerData,
      });

      return NextResponse.json({ 
        message: 'Produtor criado com sucesso', 
        user,
        producer 
      });
    }

    return NextResponse.json({ message: 'Usuário criado com sucesso', user });
  } catch (error : any) {
    return NextResponse.json(
      { message: 'Erro ao criar usuário', error: error.message },
      { status: 500 }
    );
  }
}
