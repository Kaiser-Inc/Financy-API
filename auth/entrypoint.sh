#/bin/sh

echo "Aguardando DB..."
sleep 5

echo "aplicando as migrações do prisma..."
pnpm prisma migrate deploy
pnpm prisma generate

echo "iniciando o app..."
pnpm dev