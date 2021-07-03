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

# 2. Run
FROM node:lts-alpine

# Copy the package.json and run production install
COPY --from=builder /backend/dist/package.json /dist/
COPY --from=builder /backend/dist/package-lock.json /dist/
WORKDIR /dist
RUN npm ci --only=production

# Copy the rest dist
COPY --from=builder /backend/dist .

# Serve
EXPOSE 5000
CMD npm run serve
