# 📮 Collection Postman - Todo API

Esta pasta contém os arquivos para testar a API de tarefas no Postman.

## 📁 Arquivos Inclusos

- **`Todo-API-Collection.json`** - Collection completa com todos os endpoints
- **`Todo-Backend-Environment.json`** - Environment de desenvolvimento
- **`README.md`** - Este arquivo de instruções

## 🚀 Como Importar no Postman

### 1. **Importar Collection**
1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione **Upload Files**
4. Escolha o arquivo `Todo-API-Collection.json`
5. Clique **Import**

### 2. **Importar Environment**
1. No Postman, clique no ícone de **Settings** (⚙️) 
2. Selecione **Manage Environments**
3. Clique **Import**
4. Escolha o arquivo `Todo-Backend-Environment.json`
5. Clique **Import**

### 3. **Ativar Environment**
1. No dropdown superior direito, selecione **"Todo Backend - Development"**
2. Verifique se `baseUrl` está definido como `http://localhost:3000`

## 📋 Estrutura da Collection

### 📝 **Tasks CRUD**
- ✅ **Criar Nova Tarefa** - POST `/api/tasks`
- 📝 **Criar Tarefa Apenas com Título** - POST `/api/tasks`
- 📋 **Listar Todas as Tarefas** - GET `/api/tasks`
- 🔍 **Buscar Tarefa por ID** - GET `/api/tasks/:id`
- ✏️ **Atualizar Tarefa** - PATCH `/api/tasks/:id`
- 🔄 **Alternar Status da Tarefa** - PATCH `/api/tasks/:id/toggle`
- ❌ **Excluir Tarefa** - DELETE `/api/tasks/:id`

### 🔍 **Filtros e Buscas**
- ✅ **Listar Tarefas Concluídas** - GET `/api/tasks?filter=completed`
- ⏳ **Listar Tarefas Pendentes** - GET `/api/tasks?filter=pending`
- 🔎 **Buscar por Texto** - GET `/api/tasks?search=termo`
- 🎯 **Filtro Combinado** - GET `/api/tasks?filter=pending&search=termo`

### 🧪 **Testes de Validação**
- ❌ **Criar Tarefa Sem Título** (Erro 400)
- ❌ **Criar Tarefa com Título Muito Longo** (Erro 400)
- ❌ **Buscar Tarefa Inexistente** (Erro 404)

### 📊 **Dados de Teste**
- 🗂️ **Criar Múltiplas Tarefas** - Para popular o banco
- 📝 **Criar Tarefa de Trabalho**
- 🏠 **Criar Tarefa Pessoal**

### 🌐 **Health Check**
- 🔌 **Verificar Servidor** - GET `/`
- 📚 **Acessar Swagger** - GET `/api`

## 🧪 Testes Automatizados

A collection inclui **testes automatizados** que verificam:

- ✅ **Status codes** corretos
- ✅ **Estrutura das respostas**
- ✅ **Validações de dados**
- ✅ **Funcionamento dos endpoints**

### Como Executar os Testes

1. **Teste Individual**: Clique em qualquer requisição e depois **Send**
2. **Teste da Pasta**: Clique com o botão direito numa pasta → **Run collection**
3. **Teste Completo**: Clique na collection → **Run**

## 📋 Fluxo de Teste Recomendado

### 1. **Verificação Inicial**
```
🌐 Health Check → 🔌 Verificar Servidor
```

### 2. **CRUD Básico**
```
📝 Tasks CRUD → ✅ Criar Nova Tarefa
📝 Tasks CRUD → 📋 Listar Todas as Tarefas
📝 Tasks CRUD → 🔍 Buscar Tarefa por ID
📝 Tasks CRUD → ✏️ Atualizar Tarefa
📝 Tasks CRUD → 🔄 Alternar Status
```

### 3. **Popular com Dados**
```
📊 Dados de Teste → (Executar todos)
```

### 4. **Testar Filtros**
```
🔍 Filtros e Buscas → (Executar todos)
```

### 5. **Validações**
```
🧪 Testes de Validação → (Executar todos)
```

## ⚙️ Variáveis Automáticas

A collection gerencia automaticamente:

- **`{{baseUrl}}`** - URL base do servidor
- **`{{apiUrl}}`** - URL da API (`{{baseUrl}}/api`)
- **`{{taskId}}`** - ID da última tarefa criada

## 🔧 Configuração Personalizada

Para usar em outros ambientes:

1. **Duplicar Environment**
2. **Alterar `baseUrl`** para seu servidor
3. **Ativar novo environment**

### Exemplo - Produção
```json
{
  "baseUrl": "https://sua-api.herokuapp.com",
  "apiUrl": "{{baseUrl}}/api"
}
```

## 📚 Documentação Adicional

- **Swagger UI**: http://localhost:3000/api
- **Código da API**: `../src/`
- **Variáveis de Ambiente**: `../.env`

## 🐛 Troubleshooting

### ❌ Erro de Conexão
```bash
# Verifique se o backend está rodando
cd backend
npm run start:dev
```

### ❌ Erro 404
- Verifique se `baseUrl` está correto no environment
- Confirme se o servidor está na porta 3000

### ❌ Testes Falhando
- Execute primeiro os dados de teste
- Verifique se o banco SQLite foi criado

---

**✅ Collection pronta para uso!** Execute os testes e valide sua API de tarefas.