[Versão em português](./README.md)

# KaiserInc - Financy

Financial transaction management API built with microservices architecture.

## Running Locally

Make sure you have Docker and pnpm installed on your machine, otherwise the setup below may not work correctly.

Clone the project

```bash
  git clone https://github.com/Kaiser-Inc/Financy-API.git
```

Enter the project directory

```bash
  cd Financy-API
```

Add environment variables:
| follow the .env.example

| in the base project

```bash
  JWT_SECRET=supersecretpasswordpreferablyverylong
```

| in auth

```bash
  JWT_SECRET=supersecretpasswordpreferablyverylong

  NODE_ENV=dev

  DATABASE_URL="postgresql://docker:docker@localhost:5432/FinancyDB?schema=public"
```

| in transactions

```bash
  NODE_ENV=dev

  DATABASE_URL="postgresql://docker:docker@localhost:5432/FinancyDB?schema=public"

  AUTH_SERVICE_URL="http://localhost:4013"
```

Mount the application by running:

```bash
  make mount-app
```

or (alternative)

```bash
  make mount-app-npm
```

## Technologies
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

## Techniques/Architecture
- SOLID
- Microservices
- Makefile

<p align="center">
  <img src="./diagram.png" alt="Financy API Architecture" />
</p>

## Features

To access the features, simply make a request to the main entrypoint/service -> ([http://localhost:{port}]/{microservice}/[endpoint])

ex: http://localhost:3333/transactions -> request to the main entrypoint/service

alternative: http://localhost:3333/auth/users -> the proxy redirects the request to the authentication microservice

| Authentication
- register (/auth/users) [POST] {body: email, name, password}
- login (/auth/authenticate) [POST] {body: email, password}
- profile (/auth/me) [GET] {header -> Bearer Token}
- refresh token (/auth/token/refresh) [POST] {header -> Bearer Token}

| Transactions
- create transaction (/transactions) [POST] {body: title, amount, type[credit | debit], category, accomplishment?} {header -> Bearer Token}
- list transactions (/transactions) [GET] {header -> Bearer Token}
- view transaction details (/transactions/:transactionId) [GET] {route params: transactionId} {header -> Bearer Token}
- search/filter transactions (/transactions/search) [GET] {query parameter: query} {header -> Bearer Token}
- edit transaction (/transactions/:transactionId) [PUT] {route params: transactionId} {body: title, amount, type[credit | debit], category, accomplishment?} {header -> Bearer Token}
- delete transaction (/transactions/:transactionId) [DELETE] {route params: transactionId} {header -> Bearer Token}
- get general transaction summary (/summary) [GET] {header -> Bearer Token}
- get transaction summary for a period (/summary/period) [GET] {query parameters: startDate, endDate} {header -> Bearer Token}
- export .xlsx (spreadsheet) (/export) [GET] {header -> Bearer Token}

## Running Unit Tests

```bash
  make test-unit
```

or

```bash
  make test-unit-npm
```

## Viewing Entries with Prisma

```bash
  make prisma-studio
```

## Fix Code Formatting

```
  make biome
```

## Author

- [@pHenrymelo](https://github.com/pHenrymelo)

## Study and Motivation

This application emerged as a personal project for financial transaction management, combined with a study of microservices architecture for later use in a project I work on as a scholarship holder at the Federal University of Ceará. In this project, I used a Docker service orchestrator running two main services: a user authentication API and a main transactions API, which has a proxy that redirects authentication requests to the other service. Both services are architected in layers, applying good practices and SOLID principles, as well as some design patterns, such as the repository pattern and factory pattern. 
