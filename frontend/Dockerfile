# This Dockerfile is intended to be run at the root dir of whole project,
# not at the frontend dir,
# because build needs api project.

FROM node:lts-alpine

# Copy API project. Don't need build
COPY api /src/api

# Change WORKDIR
WORKDIR /src/frontend

# Copy package.json and install all dependencies
COPY frontend/package.json .
COPY frontend/package-lock.json .
RUN npm ci

# Build args
ARG USE_MOCK=0

# Build image
ENV NEXT_PUBLIC_USE_MOCK=$USE_MOCK
COPY frontend .
RUN npm run build

# Run with env
EXPOSE 3000
CMD npm run start
