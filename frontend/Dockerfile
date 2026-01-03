FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb* ./

# Check if we need to install dependencies
RUN bun install

COPY . .

# Expose Vite port
EXPOSE 5173

CMD ["bun", "run", "dev", "--host"]
