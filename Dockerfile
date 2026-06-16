FROM node:20-alpine AS base

# Step 1: Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine for more info.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Step 2: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create a system user and group for running the Express app securely
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy dependencies and application source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure proper permission ownership for non-root user
RUN chown -R expressjs:nodejs /app

# Switch to the non-root user
USER expressjs

EXPOSE 5000

CMD ["node", "server.js"]
