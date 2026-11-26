# Stage 1: Build React + Vite Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Production Node.js + Express Server (API + Built SPA)
FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=5000
ENV AUTO_SEED=true

EXPOSE 5000

CMD ["node", "server.js"]
