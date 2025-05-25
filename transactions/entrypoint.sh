#!/bin/sh

echo "Aguardando o banco de dados..."
until pnpm prisma db push --accept-data-loss > /dev/null 2>&1; do
  echo "Banco de dados ainda não está pronto... aguardando"
  sleep 2
done

echo "Banco de dados está pronto!"
echo "Aplicando migrações do Prisma..."
pnpm prisma migrate deploy
pnpm prisma generate

echo "Iniciando a aplicação..."
pnpm dev