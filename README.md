# yaarxiv: Yet Another ArXiv

!! WIP !!

A new open-source and modern preprint platform.

# Vision

- Power a new and modern preprint platform
- Provide a protocol and an implementation for a federated (distributed) preprint platform network.

# Development

A Node.js TypeScript full stack

- Frontend: [Next.js](https://nextjs.org/) with TypeScript
- Backend: [fastify](https://www.fastify.io/) with TypeScript and [typeorm](https://typeorm.io)

# Deployment

## Build

```bash
# CWD is ., not inside frontend or backend

# Build frontend container (STATIC_ROOT is optional)
docker build -f frontend/Dockerfile . --build-arg API_ROOT=$API_ROOT STATIC_ROOT=$STATIC_ROOT

# Build 

```

# License

AGPL 3.0

