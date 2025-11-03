# Todo Backend - NestJS + SQLite<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

Sistema de gerenciamento de tarefas desenvolvido com NestJS e SQLite.</p>



## 🚀 Início Rápido[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

### Pré-requisitos

- Node.js 18+   <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

- npm    <p align="center">

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

### Instalação<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

1. **Entre no diretório:**<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

   ```bash<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

   cd backend<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

   ```<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

2. **Instale as dependências:**    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

   ```bash  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

   npm install</p>

   ```  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

3. **Configure as variáveis de ambiente:**

   ```bash## Description

   cp .env.example .env

   # Edite o arquivo .env conforme necessário[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

   ```

## Project setup

4. **Inicie o servidor:**

   ```bash```bash

   # Desenvolvimento$ npm install

   npm run start:dev```

   ```

## Compile and run the project

## 📚 Documentação da API

```bash

Após iniciar o servidor, acesse:# development

- **Swagger UI:** http://localhost:3000/api$ npm run start

- **API Base:** http://localhost:3000/api/tasks

# watch mode

## 🛠️ Endpoints Principais$ npm run start:dev



| Método | Endpoint | Descrição |# production mode

|--------|----------|-----------|$ npm run start:prod

| GET | `/api/tasks` | Listar todas as tarefas |```

| GET | `/api/tasks?filter=completed` | Listar tarefas concluídas |

| GET | `/api/tasks?filter=pending` | Listar tarefas pendentes |## Run tests

| GET | `/api/tasks?search=texto` | Buscar tarefas |

| GET | `/api/tasks/:id` | Buscar tarefa por ID |```bash

| POST | `/api/tasks` | Criar nova tarefa |# unit tests

| PATCH | `/api/tasks/:id` | Atualizar tarefa |$ npm run test

| PATCH | `/api/tasks/:id/toggle` | Alternar status |

| DELETE | `/api/tasks/:id` | Excluir tarefa |# e2e tests

$ npm run test:e2e

## ⚙️ Variáveis de Ambiente

# test coverage

```env$ npm run test:cov

PORT=3000                           # Porta do servidor```

DATABASE_PATH=./todo.db            # Caminho do banco SQLite

JWT_SECRET=seu-jwt-secret          # Chave JWT ## Deployment

FRONTEND_URL=http://localhost:5173 # URL do frontend

```When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.



## ✅ FeaturesIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:



- ✅ **CRUD completo** de tarefas```bash

- ✅ **Validação** com class-validator$ npm install -g @nestjs/mau

- ✅ **Swagger** para documentação$ mau deploy

- ✅ **Filtros e busca** ```

- ✅ **CORS** configurado

- ✅ **SQLite** integradoWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

- ✅ **Variáveis de ambiente**
## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
