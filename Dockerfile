FROM node:18.12.1 AS builder
WORKDIR /app/folloca-server
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

FROM node:18.12.1-alpine
WORKDIR /app/folloca-server
RUN npm install -g pm2
COPY --from=builder /app/folloca-server ./