# This Dockerfile is intended to be run at the root dir of whole project,
# not at the backend dir,
# because build needs api project.

# 1. Build
FROM node:lts-alpine as builder

# Copy API project. Don't need build
COPY api /api

# Change WORKDIR
WORKDIR /backend

# Copy package.json and install all dependencies
COPY backend/package.json .
COPY backend/package-lock.json .
RUN npm ci

# Build image
COPY backend .
RUN npm run build

# Prune non-production dependency
RUN npm prune --production

# 2. Run
FROM node:lts-alpine as runner

# Copy the package.json, lock and node_modules
WORKDIR /dist

COPY --from=builder /backend/package.json .
COPY --from=builder /backend/package-lock.json .
COPY --from=builder /backend/node_modules/ ./node_modules


COPY --from=builder /backend/tsconfig.json ./
COPY --from=builder /backend/mikro-orm.config.ts ./
COPY --from=builder /backend/migrations/ ./migrations

COPY --from=builder /backend/config/ ./config
COPY --from=builder /backend/out/bundle.js index.js
COPY --from=builder /backend/src/ ./src/



# Set NODE_ENV to run command in container
ENV NODE_ENV production

# Serve
EXPOSE 5000
CMD node index.js
