# KaiserInc - Financy

API de gerenciamento de transações financeiras arquitetada em microserviços.


## Rodando localmente

Certifique-se de ter o Docker e o pnpm instalado em sua máquina, caso contrário o setup abaixo pode não funcionar corretamente.

Clone o projeto

```bash
  git clone https://github.com/Kaiser-Inc/Financy-API.git

```

Entre no diretório do projeto

```bash
  cd Financy-API
```

Adicione as variáveis de ambiente:
| siga o .env.example

| no projeto base 

```bash
  JWT_SECRET=senhasupersecretaedepreferenciabemlonga
```

| em auth

```bash
  JWT_SECRET=senhasupersecretaedepreferenciabemlonga

  NODE_ENV=dev

  DATABASE_URL="postgresql://docker:docker@localhost:5432/FinancyDB?schema=public"

```

| em transactions

```bash
  NODE_ENV=dev

  DATABASE_URL="postgresql://docker:docker@localhost:5432/FinancyDB?schema=public"

  AUTH_SERVICE_URL="http://localhost:4013"

```

Monte a aplicação rodando:

```bash
  make mount-app
```

ou (alternativa)

```bash
  make mount-app-npm
```

## Tecnologias
- Docker
- Fastify
- JWT
- Cookies
- Proxy
- Prisma
- Vitest
- Axios
- TypeScript
- ExcelJS

## Técnicas/Arquitetura
- SOLID
- Microserviços
- Makefile

## Funcionalidades

Para acessar as funcionalidades basta fazer uma requisição para o entrypoint/serviço principal -> ([http://localhost:{port}]/{microserviço}/[endpoint]) 

ex: http://localhost:3333/transactions -> requisição para o entrypoint/serviço principal

alternativa: http://localhost:3333/auth/users -> o proxy redireciona a requisição para o microserviço de autenticação


| Autenticação
- cadastro (/auth/users) [POST] {body: email, name, password}

- login (/auth/authenticate) [POST] {body: email, password}
- perfil (/auth/me) [GET] {header -> Bearer Token}
- refresh token (/auth/token/refresh) [POST] {header -> Bearer Token}

| Transações
- criar transação (/transactions) [POST] {body: title, amount, type[credit | debit], category, accomplishment?} {header -> Bearer Token}
- listar transações (/transactions) [GET] {header -> Bearer Token}
- visualizar detalhes de uma transação (/transactions/:transactionId) [GET] {route params: transactionId} {header -> Bearer Token}
- procurar/filtrar transações (/transactions/search) [GET] {query parameter: query} {header -> Bearer Token}
- editar transação (/transactions/:transactionId) [PUT] {route params: transactionId} {body: title, amount, type[credit | debit], category, accomplishment?} {header -> Bearer Token}
- deletar transação (/transactions/:transactionId) [DELETE] {route params: transactionId} {header -> Bearer Token}
- obter resumo de transações geral (/summary) [GET] {header -> Bearer Token}
- obter resumo de transações em um período (/summary/period) [GET] {query parameters: startDate, endDate} {header -> Bearer Token}
- exportar um .xlsx (planilha) (/export) [GET] {header -> Bearer Token}
## Executando os testes unitários

```bash
  make test-unit
```

ou

```bash
  make test-unit-npm
```

## Visualizando entradas com o Prisma


```bash
  make prisma-studio
```

## Arrumar formatação do código

```
  make biome
```
## Autor

- [@pHenrymelo](https://github.com/pHenrymelo)

## Estudo e motivação

Essa aplicação surgiu como um projeto pessoal de app para gerenciamento de transações financeiras, unido a um estudo de arquitetura em microserviços para a utilização posterior em um projeto que trabalho como bolsista pela Universidade Federal do Ceará. Neste projeto eu utilizei um orquestrador de serviços do Docker rodando dois serviços principais, uma API de autenticação de usuários e uma API principal de transações, que possui um proxy que redireciona as requisições de autenticação para o outro serviço. Ambos os serviços estão arquitetados em camadas, aplicando boas práticas e princípios SOLID, além de alguns design patterns, como o repository pattern e o factory pattern.