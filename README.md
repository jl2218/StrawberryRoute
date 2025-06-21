# Projeto StrawberryRoute

Este é um sistema de conexão entre produtores rurais e consumidores, permitindo a divulgação de produtos, agendamento de visitas e contato direto entre as partes.

## Funcionalidades

- **Autenticação e Autorização**: O sistema oferece controle de acesso com dois tipos de usuários: **Admin** e **Produtor**.
- **Cadastro de Produtores**: Registro de produtores rurais com suas informações e localização.
- **Agendamento de Visitas**: Visitantes podem agendar visitas aos produtores rurais.
- **Solicitações de Contato**: Sistema de mensagens entre visitantes e produtores.
- **Mapa de Localização**: Visualização geográfica dos produtores através de mapa interativo.
- **Informações sobre Cultivo**: Conteúdo educativo sobre métodos de cultivo.

## Tecnologias Utilizadas

- **Frontend**:  
  - React
  - Next.js 14
  - TailwindCSS para estilização
  - TypeScript
  - React Leaflet para mapas interativos
  - React Toastify para notificações

- **Backend**:  
  - Node.js
  - Next.js API Routes
  - Prisma ORM para interação com o banco de dados PostgreSQL
  - Autenticação via tokens JWT
  - SendGrid para envio de emails

## Instalação

### Requisitos

- [Node.js](https://nodejs.org/) >= 16.x.x
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (opcional para ambiente de desenvolvimento)

### Passos para Inicialização

1. **Clone o repositório**

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/conexao_rural"
   JWT_SECRET="sua_chave_secreta"
   SENDGRID_API_KEY="sua_chave_api_sendgrid"
   ```

4. **Execute as migrações do banco de dados**

   ```bash
   npx prisma migrate dev
   ```

5. **Carregue os dados iniciais (opcional)**

   ```bash
   npm run prisma:seed
   ```

6. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

7. **Acesse a aplicação**

   Abra seu navegador e acesse `http://localhost:3000`

## Executando com Docker

O projeto inclui configurações para Docker, facilitando a configuração do ambiente de desenvolvimento:

```bash
docker-compose up -d
```

## Estrutura do Projeto

- **`src/app/`**: Contém as rotas e páginas da aplicação Next.js
  - `api/`: Endpoints da API
  - `login/`: Página de autenticação
  - `home/`: Página inicial
  - `producers/`: Gerenciamento de produtores
  - `region/`: Informações regionais

- **`src/components/`**: Componentes React reutilizáveis

- **`src/lib/`**: Bibliotecas e configurações

- **`src/utils/`**: Funções utilitárias

- **`prisma/`**: Configuração do Prisma ORM
  - `schema.prisma`: Esquema do banco de dados
  - `migrations/`: Migrações do banco de dados
  - `seed.js`: Script para carregar dados iniciais

## Documentação da API

Este projeto utiliza **Swagger** para documentar e testar as rotas da API. Para acessar a documentação completa da API, inicie o servidor e acesse:

```
http://localhost:3000/swagger
```
