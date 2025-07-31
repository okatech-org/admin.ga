# ================================================
# Dockerfile multi-stage pour Administration.GA
# Optimisé pour la production avec sécurité renforcée
# ================================================

# Stage 1: Dependencies
FROM node:18-alpine AS deps
LABEL stage=deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# ================================================
# Stage 2: Builder
FROM node:18-alpine AS builder
LABEL stage=builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Set default values for build-time variables (can be overridden with --build-arg)
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:password@localhost:5432/administration_ga}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-development-secret-key-for-build}
ENV NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# ================================================
# Stage 3: Runner (Production)
FROM node:18-alpine AS runner
LABEL maintainer="Administration.GA Team"
LABEL version="1.0.0"

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Runtime environment variables with defaults
ENV DATABASE_URL=postgresql://postgres:password@localhost:5432/administration_ga
ENV NEXTAUTH_SECRET=runtime-secret-key-change-in-production
ENV NEXTAUTH_URL=http://localhost:3000

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built Next.js application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Security: Use non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
