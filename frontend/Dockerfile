# Install dependencies only when needed
FROM node:16-alpine AS builder
COPY frontend/ /app/frontend
COPY api/ /app/api

WORKDIR /app/frontend
RUN npm ci

# Build args
ARG USE_MOCK=0

# Build image
ENV NEXT_PUBLIC_USE_MOCK=$USE_MOCK

RUN npm run build

# Remove devDependencies
RUN npm prune --production

# Remove devDependencies in api
WORKDIR /app/api
RUN npm prune --production


# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app/frontend

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/frontend/next.config.js ./
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json
COPY --from=builder /app/api/ ../api


EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]
