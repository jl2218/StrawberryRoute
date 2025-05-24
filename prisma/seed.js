const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminEmail = 'admin@admin.com';
  const adminPassword = '123qwe';
  const adminUsername = 'admin';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Usuário admin criado com sucesso!');
  } else {
    console.log('Usuário admin já existe.');
  }

  // Create producer users and their profiles
  const producers = [
    {
      username: 'joaosilva',
      email: 'joao@strawberryroute.com',
      password: '123qwe',
      name: 'João Silva',
      description: 'Produtor de morangos orgânicos há mais de 15 anos. Especializado em variedades Albion e San Andreas.',
      phone: '(35) 99876-5432',
      address: 'Estrada Rural, Km 5',
      city: 'Pouso Alegre',
      zipCode: '37550-000',
      latitude: -22.2293,
      longitude: -45.9338,
      cultivationMethods: ['Orgânico', 'Semi-hidropônico']
    },
    {
      username: 'mariasantos',
      email: 'maria@strawberryroute.com',
      password: '123qwe',
      name: 'Maria Santos',
      description: 'Produtora familiar de morangos. Cultivo tradicional e produtos artesanais derivados de morango.',
      phone: '(35) 99765-4321',
      address: 'Sítio Bela Vista, s/n',
      city: 'Gonçalves',
      zipCode: '37680-000',
      latitude: -22.6566,
      longitude: -45.8552,
      cultivationMethods: ['Tradicional', 'Familiar']
    },
    {
      username: 'carlosoliveira',
      email: 'carlos@strawberryroute.com',
      password: '123qwe',
      name: 'Carlos Oliveira',
      description: 'Produtor de morangos hidropônicos de alta qualidade. Tecnologia de ponta para garantir sabor e durabilidade.',
      phone: '(35) 99654-3210',
      address: 'Rodovia MG-173, Km 10',
      city: 'Cambuí',
      zipCode: '37600-000',
      latitude: -22.6131,
      longitude: -46.0572,
      cultivationMethods: ['Hidropônico', 'Vertical']
    }
  ];

  for (const producer of producers) {
    const existingUser = await prisma.user.findUnique({ where: { email: producer.email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(producer.password, 10);

      const user = await prisma.user.create({
        data: {
          username: producer.username,
          email: producer.email,
          password: hashedPassword,
          role: 'PRODUCER',
        },
      });

      await prisma.producer.create({
        data: {
          userId: user.id,
          name: producer.name,
          description: producer.description,
          phone: producer.phone,
          address: producer.address,
          city: producer.city,
          state: 'Minas Gerais',
          zipCode: producer.zipCode,
          latitude: producer.latitude,
          longitude: producer.longitude,
          cultivationMethods: producer.cultivationMethods,
        },
      });

      console.log(`Produtor ${producer.name} criado com sucesso!`);
    } else {
      console.log(`Produtor com email ${producer.email} já existe.`);
    }
  }

  // Create cultivation information
  const cultivationInfos = [
    {
      title: 'Cultivo Orgânico',
      content: 'O cultivo orgânico de morangos utiliza técnicas naturais sem o uso de pesticidas químicos ou fertilizantes sintéticos. Os produtores orgânicos do Sul de Minas utilizam compostagem, controle biológico de pragas e rotação de culturas para garantir morangos saudáveis e saborosos.',
      imageUrl: '/images/cultivation/organic.jpg'
    },
    {
      title: 'Sistema Hidropônico',
      content: 'O cultivo hidropônico de morangos é realizado sem solo, com as plantas crescendo em soluções nutritivas. Este método permite maior controle sobre os nutrientes, reduz doenças e pragas, e possibilita produção durante todo o ano, mesmo em espaços reduzidos.',
      imageUrl: '/images/cultivation/hydroponic.jpg'
    },
    {
      title: 'Cultivo Tradicional',
      content: 'O método tradicional de cultivo de morangos no Sul de Minas utiliza canteiros no solo, com irrigação por gotejamento e cobertura com mulching plástico. Este sistema é adaptado ao clima da região e permite o desenvolvimento de frutos com sabor característico.',
      imageUrl: '/images/cultivation/traditional.jpg'
    }
  ];

  for (const info of cultivationInfos) {
    const existingInfo = await prisma.cultivationInfo.findFirst({ where: { title: info.title } });

    if (!existingInfo) {
      await prisma.cultivationInfo.create({
        data: info,
      });
      console.log(`Informação de cultivo "${info.title}" criada com sucesso!`);
    } else {
      console.log(`Informação de cultivo "${info.title}" já existe.`);
    }
  }

  // Create region information
  const regionInfos = [
    {
      title: 'Sul de Minas - O Paraíso dos Morangos',
      content: 'O Sul de Minas Gerais é conhecido por seu clima ameno, com temperaturas médias entre 15°C e 25°C, ideal para o cultivo de morangos. A altitude entre 800 e 1.400 metros proporciona noites frescas e dias ensolarados, resultando em frutos doces e saborosos.',
      imageUrl: '/images/region/sul-minas.jpg'
    },
    {
      title: 'Importância Econômica',
      content: 'A produção de morangos no Sul de Minas representa mais de 40% da produção estadual, gerando milhares de empregos diretos e indiretos. A região se destaca pela qualidade dos frutos e pela diversidade de variedades cultivadas.',
      imageUrl: '/images/region/economy.jpg'
    },
    {
      title: 'Turismo Rural',
      content: 'O cultivo de morangos tem impulsionado o turismo rural na região, com diversas propriedades oferecendo experiências de "colha e pague" e degustação de produtos derivados. Esta atividade complementa a renda dos produtores e fortalece a economia local.',
      imageUrl: '/images/region/tourism.jpg'
    }
  ];

  for (const info of regionInfos) {
    const existingInfo = await prisma.regionInfo.findFirst({ where: { title: info.title } });

    if (!existingInfo) {
      await prisma.regionInfo.create({
        data: info,
      });
      console.log(`Informação regional "${info.title}" criada com sucesso!`);
    } else {
      console.log(`Informação regional "${info.title}" já existe.`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Erro ao rodar o script de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
