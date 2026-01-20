# Base image cho Node.js (Next.js 16 yêu cầu Node.js >= 20.9.0)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json và package-lock.json trước - chỉ rebuild khi thay đổi dependencies
COPY package*.json ./

# Install dependencies với BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy application code - rebuild khi thay đổi code
COPY . .

# Expose port 3000 (Next.js default port)
EXPOSE 3000

# Command để chạy development server với hot reload
CMD ["npm", "run", "dev"]
