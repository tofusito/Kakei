# Stage 1: Build Frontend
FROM oven/bun:1 as frontend
WORKDIR /app
COPY frontend/package.json frontend/bun.lock ./
RUN bun install
COPY frontend .
RUN bun run build

# Stage 2: Runtime (Backend + Static Frontend)
FROM oven/bun:1
WORKDIR /app

# Install Backend Deps
COPY backend/package.json backend/bun.lock ./
RUN bun install

# Copy Backend Source
COPY backend .

# Copy Built Frontend to Backend's Public dir
COPY --from=frontend /app/dist ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose API & Frontend port
EXPOSE 3000

# Start Elysia
CMD ["bun", "run", "src/index.ts"]
