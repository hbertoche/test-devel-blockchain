# 📋 Sistema de Tarefas (To-Do List)

Um sistema completo de gerenciamento de tarefas desenvolvido com **React + NestJS + TypeScript**, com autenticação JWT, temas personalizáveis e interface moderna.

## 🚀 Funcionalidades

### ✅ Gerenciamento de Tarefas
- **CRUD completo**: Criar, visualizar, editar e excluir tarefas
- **Filtros inteligentes**: Todas, pendentes, concluídas
- **Busca em tempo real**: Por título ou descrição (com debounce)
- **Status dinâmico**: Marcar/desmarcar como concluída
- **Timestamps**: Criação e última atualização

### 🔐 Sistema de Autenticação
- **Registro de usuários**: Cadastro com validação
- **Login seguro**: Autenticação via JWT
- **Proteção de rotas**: Acesso apenas para usuários logados
- **Perfil do usuário**: Informações do usuário logado

### 🎨 Interface Moderna
- **Design responsivo**: Bootstrap 5 + React Bootstrap
- **Temas personalizáveis**: Claro e escuro
- **Ícones modernos**: Material Design Icons (MDI)
- **UX otimizada**: Debounce na busca, loading states, alerts

### 📊 Recursos Avançados
- **Export/Import**: Backup e restauração de tarefas (JSON)
- **Contadores**: Total, pendentes, concluídas
- **Validação robusta**: Frontend e backend
- **Tratamento de erros**: Feedback visual para o usuário

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js enterprise-grade
- **TypeScript**: Tipagem estática e orientação a objetos
- **SQLite**: Banco de dados leve e eficiente
- **JWT**: Autenticação segura com tokens
- **Bcrypt**: Criptografia de senhas
- **Swagger**: Documentação automática da API

### Frontend
- **React 18**: Biblioteca de interface moderna
- **TypeScript**: Desenvolvimento type-safe
- **Vite**: Build tool rápido e moderno
- **React Bootstrap**: Componentes responsivos
- **Axios**: Cliente HTTP para API calls
- **Material Design Icons**: Iconografia consistente

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd test-devel-blockchain
```

### 2. Backend (Terminal 1)
```bash
cd backend
npm install
npm run start:dev
```
**🌐 API**: http://localhost:3000  
**📚 Swagger**: http://localhost:3000/api

### 3. Frontend (Terminal 2)
```bash
cd frontend  
npm install
npm run dev
```
**🎨 App**: http://localhost:5173

### 4. Primeiro Acesso
1. Acesse http://localhost:5173
2. Clique em "Criar conta" 
3. Cadastre-se e faça login
4. Comece a gerenciar suas tarefas!

## 📊 API Endpoints

### 🔐 Autenticação
```http
POST /auth/register    # Registrar novo usuário
POST /auth/login       # Login do usuário  
GET  /auth/profile     # Perfil do usuário logado
```

### 📋 Tarefas (Requer Autenticação)
```http
GET    /tasks                 # Listar tarefas (com filtros)
POST   /tasks                 # Criar nova tarefa
GET    /tasks/:id             # Buscar tarefa por ID
PATCH  /tasks/:id             # Atualizar tarefa
DELETE /tasks/:id             # Excluir tarefa
PATCH  /tasks/:id/toggle      # Alternar status da tarefa
```

WIP: 
GET    /tasks/export          # Exportar tarefas (JSON)
POST   /tasks/import          # Importar tarefas


### 🔍 Parâmetros de Filtro
```http
GET /tasks?filter=pending     # Tarefas pendentes
GET /tasks?filter=completed   # Tarefas concluídas
GET /tasks?search=texto       # Busca por texto
```

## �️ Arquitetura do Sistema

### Backend (NestJS)
```
backend/
├── src/
│   ├── auth/           # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   ├── users/          # Módulo de usuários
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   ├── tasks/          # Módulo de tarefas
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── dto/
│   ├── database/       # Configuração SQLite
│   └── main.ts         # Bootstrap da aplicação
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/     # Componentes React
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   ├── AuthPage.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/       # Estado global
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/       # Integração com API
│   │   └── api.ts
│   ├── types/          # Interfaces TypeScript
│   └── App.tsx
```

## 🎨 Principais Funcionalidades

### Interface do Usuário
- **Dashboard intuitivo**: Visão geral com contadores de tarefas
- **Busca inteligente**: Debounce de 500ms para otimizar performance
- **Filtros rápidos**: Todas, Pendentes, Concluídas
- **Tema adaptável**: Alternância entre modo claro e escuro
- **Feedback visual**: Loading states, alertas, confirmações

### Experiência do Usuário
- **Autenticação fluida**: Login/registro com validação em tempo real
- **Gestão de tarefas**: Criar, editar, excluir com confirmações
- **Status dinâmico**: Toggle de conclusão com um clique
- **Exportação**: Backup completo das tarefas em JSON
- **Importação**: Restauração de dados com validação

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run start:dev    # Desenvolvimento com hot-reload
npm run start:prod   # Produção
npm run build        # Build para produção
npm run test         # Executar testes
```

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run test         # Executar testes
```

## 📋 Checklist de Funcionalidades

- ✅ CRUD completo de tarefas
- ✅ Filtros e busca em tempo real
- ✅ Autenticação JWT segura
- ✅ Interface responsiva e moderna
- ✅ Temas claro/escuro
- ✅ Export/Import de dados
- ✅ Validação robusta
- ✅ Tratamento de erros
- ✅ Documentação completa
- ✅ TypeScript em todo o projeto

---

**🚀 Sistema completo de gerenciamento de tarefas pronto para uso!**