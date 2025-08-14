FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=stripe_key \
    --mount=type=secret,id=stripe_public_key \
    export STRIPE_SECRET_KEY=$(cat /run/secrets/stripe_key) && \
    export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$(cat /run/secrets/stripe_public_key)
#only for tests    
RUN echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY"
RUN echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY" > .env 
RUN echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
RUN echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" >> .env 
RUN corepack enable pnpm && pnpm generate && \
    corepack enable pnpm && pnpm run build && \
    rm -f .env
FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
