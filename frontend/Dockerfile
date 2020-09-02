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
RUN npm install

# Build args
ARG API_ROOT
ARG STATIC_ROOT=$API_ROOT

# Build image
ENV USE_MOCK=false
ENV NEXT_PUBLIC_API_ROOT=$API_ROOT
ENV NEXT_PUBLIC_STATIC_ROOT=$STATIC_ROOT
COPY frontend .
RUN npm run build

# Run
EXPOSE 3000
CMD npm run start