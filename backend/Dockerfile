FROM node:16-alpine3.18 AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci
COPY ./src ./src

RUN npm run build

FROM node:16-alpine3.18 AS production
WORKDIR /app

COPY package*.json ./
RUN npm install -g pm2
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js ./ecosystem.config.js

EXPOSE 4000
CMD ["pm2-runtime", "ecosystem.config.js"]