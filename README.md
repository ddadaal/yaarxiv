# yaarxiv: Yet Another ArXiv

A new open-source and modern preprint platform.

# Vision

- Power a new and modern preprint platform
- Provide a protocol and an implementation for a federated (distributed) preprint platform network.

# Development

A Node.js TypeScript full stack

- Frontend: [Next.js](https://nextjs.org/) with TypeScript
- Backend: [fastify](https://www.fastify.io/) with TypeScript and [typeorm](https://typeorm.io)

# Deployment

## Docker Compose

A `docker-compose.yml` is provided. So you can just `docker-compose up` to start a system.

Default configs are provided in `docker-compose.yml`. The following can be changed.

| config                     | default value                                  | extra                                                       |
| -------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| frontend port              | 80                                             | mapped from 3000                                            |
| backend port               | 5000                                           | mapped from 3000                                            |
| frontend args (see below)  | USE_MOCK=false, API_ROOT=http://localhost:5000 |                                                             |
| backend db file            | ./prod.db                                      | Currently a SQLite db, will change to real db in the future |
| backend configuration file | ./backend/config/production.sample.env         |                                                             |

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
# -it to ctrl+c to kill the container
docker run -p 5000:3000 -it \
    -v $PWD/backend/config/production.json:/dist/config/production.json \
    -v $PWD/backend/distupload:/dist/upload \
    backend

```

# License

AGPL 3.0

