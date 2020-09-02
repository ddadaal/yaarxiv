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

# Build frontend image 
# STATIC_ROOT is optional
# The args must be provided during build
docker build . -f frontend/Dockerfile \
    --build-arg API_ROOT=$API_ROOT \
    --build-arg STATIC_ROOT=$STATIC_ROOT \
    --tag frontend

# Run frontend container at port 3000
docker run -p 3000:3000 frontend

# Build backend image. 
# The configuration can be mapped when run
docker build . -f backend/Dockerfile \
    --tag backend

# Run the backend at 5000
# with mappings to production conf and upload folder
docker run -p 5000:3000 \
    -v $PWD/backend/config/production.json:/dist/config/production.json \
    -v $PWD/backend/distupload:/dist/upload \
    backend

```

# License

AGPL 3.0

