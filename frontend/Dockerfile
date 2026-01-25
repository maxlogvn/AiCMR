# ============================================
# AiCMR Frontend Dockerfile
# Supports: development, production targets
# ============================================

# Development target (default)
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Development command with hot reload
CMD ["npm", "run", "dev"]

# ============================================
# Production target (for staging/production)
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# ============================================
# Production runtime stage
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install only runtime dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from build stage
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Expose port 3000
EXPOSE 3000

# Production server command
CMD ["node", "server.js"]
