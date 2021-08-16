# yaarxiv: Yet Another ArXiv

![Frontend Build and Deploy Status](https://img.shields.io/github/workflow/status/ddadaal/yaarxiv/Build%20and%20Publish%20frontend?label=Frontend%20Build%20and%20Deploy&style=flat-square)
![Backend Build and Deploy Status](https://img.shields.io/github/workflow/status/ddadaal/yaarxiv/Build%20and%20Publish%20backend?label=Backend%20Build%20and%20Deploy&style=flat-square)
![Backend Coveralls](https://img.shields.io/coveralls/github/ddadaal/yaarxiv?label=Backend%20Test%20Coverage&style=flat-square)

A new open-source and modern preprint platform.

# Development

A Node.js TypeScript full stack

- Frontend: [Next.js](https://nextjs.org/) with TypeScript
- Backend: [fastify](https://www.fastify.io/) with TypeScript and [mikro-orm](https://mikro-orm.io)

Start backend:

```bash
cd backend
npm install
npm run devenv
npm run dev
```

Develop frontend using real backend

```bash
cd frontend
npm install
npm run devapi
```

More commands can be found in `frontend/README.md` and `backend/README.md`.

# Deployment

1. Configure db initial password in `.env`
1. Create and modify `backend/config/production.js` based on `backend/config/production.sample.js`
2. `docker-compose up`

Default configs are provided in `docker-compose.yml`. The following can be changed.

| config                     | default value                  | extra                            |
| -------------------------- | ------------------------------ | -------------------------------- |
| frontend port              | 3000                           | mapped from 3000                 |
| backend port               | 5000                           | mapped from 3000                 |
| frontend args (see below)  | USE_MOCK=0                     |                                  |
| static files directory     | ./static                       |                                  |
| backend configuration file | ./backend/config/production.js | Must be created before starting. |
| backend db files           | ./backend/distdb               | MySQL                            |
| backend upload dir         | ./backend/distupload           |                                  |

Note: The default timeout for db connection is **20s**, which can be changed at the backend configuration file. Because of this connection timeout, there is no need to use `wait-for-it.sh` to wait for db connection.

## Build

```bash
# CWD is ., not inside frontend or backend

# Build frontend image 
# The USE_MOCK must be provided during build
docker build . -f frontend/Dockerfile \
    --build-arg USE_MOCK=0 \
    --tag frontend

# Run frontend container at port 3000
# As well as setting env config
# Extra args can be found at ./frontend/README.md
docker run -p 3000:3000 -it \
    -e API_ROOT=http://localhost:5000 \
    frontend

# Build backend image. 
# The configuration can be mapped when run
docker build . -f backend/Dockerfile \
    --tag backend

# Run the backend at 5000
# with mappings to production conf and upload folder
# -it to ctrl+c to kill the container
docker run -p 5000:5000 -it \
    -v $PWD/backend/config/production.js:/dist/config/production.js \
    -v $PWD/upload:/dist/upload \
    backend

```

# License

AGPL 3.0

