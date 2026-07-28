FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Persist local uploads (Cloudflare/Cloudinary preferred in production)
RUN mkdir -p /app/uploads && chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:9000/health || exit 1

CMD ["node", "server.js"]
