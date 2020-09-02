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
RUN npm install

# Build image
COPY backend .
RUN npm run build

# 2. Run
FROM node:lts-alpine

# Copy the package.json and run production install
COPY --from=builder /backend/dist/package.json /dist/
WORKDIR /dist
RUN npm install --production

# Copy the rest dist
COPY --from=builder /backend/dist .

# Serve
EXPOSE 3000
CMD npm run serve
