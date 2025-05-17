FROM node:22

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json ./
RUN pnpm install

COPY . .

EXPOSE 3333

CMD ["./entrypoint.sh"]
