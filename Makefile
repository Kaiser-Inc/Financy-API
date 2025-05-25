deploy: 
	docker compose down -v && docker compose up -d

stop:
	docker stop financy-api-financy-auth-1 financy-api-FinancyDB-1 financy-api-financy-transactions-1

prisma-studio:
	docker exec -it financy-api-financy-transactions-1 pnpm prisma studio

biome:
	cd auth && pnpm biome format --write
	cd auth && pnpm biome lint --write
	cd auth && pnpm biome check --write
	cd transactions && pnpm biome format --write
	cd transactions && pnpm biome lint --write
	cd transactions && pnpm biome check --write

mount-app:
	cd auth && pnpm i
	cd transactions && pnpm i
	docker compose down -v && docker-compose up --build -d FinancyDB
	sleep 3
	cd transactions && pnpm prisma migrate deploy
	cd transactions && pnpm prisma generate
	make deploy

test-unit:
	cd auth && pnpm test 
	cd transactions && pnpm test

mount-app-npm:
	cd auth && npm install
	cd transactions && npm install
	cd transactions && npx prisma migrate deploy
	cd transactions && npx prisma generate
	make deploy

test-unit-npm:
	cd auth && npm run test 
	cd transactions && npm run test