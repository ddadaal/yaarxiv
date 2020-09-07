# yaarxiv frontend

The frontend of yaarxiv.

# Features

- With [grommet](https://v2.grommet.io/):
    - Complete flexbox layout
    - Every pixel is accurately aligned!
    - No styling on the source code whatsoever: all styles defined in theme object!
- Side-server rendering with [Next.js](https://nextjs.org/)
- SSR with responsive layout works fine with [@artsy/fresnel](https://github.com/artsy/fresnel) without any user agent sniffing hack (determine initial breakpoint by guessing device's type using user agent.)
- Automatic API client generation based on the [API project](https://github.com/ddadaal/yaarxiv/tree/master/api) with all types (response types, parameter types etc) inferred automatically!
- Separate API layer with mock for complete backend-less development
- Hot-changable i18n with [simstate-i18n](https://github.com/ddadaal/simstate-i18n)

# Development

Make sure the [API project](https://github.com/ddadaal/yaarxiv/tree/master/api) is located on the parent directory of this project (`../api`).

```bash
# Make sure you have good connection to GitHub
# since we need the stable branch of grommet-icons
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start at port 3000
npm start -- --port 3000
```

# Configuration

We utilize [next.js's environment variables feature](https://nextjs.org/docs/basic-features/environment-variables) to handle configs. Available configurations are as follows:

| env                       | Description                             | Possible Values |
| ------------------------- | --------------------------------------- | --------------- |
| `NEXT_PUBLIC_API_ROOT`    | The root of backend API                 | string          |
| `NEXT_PUBLIC_STATIC_ROOT` | The root of static files                | string          |
| `NEXT_PUBLIC_USE_MOCK`    | Whether to use mock API for development | 1/0             |


This git repo contains a `.env` as default config. You can create a `.env.production` for production configration and this `.env.production` should be git ignored.

To dynamically changing `USE_MOCK` config during development, changing the USE_MOCK directly on the code and after hot reload, new USE_MOCK will be available. But please remember not to check in the changed code. The value inside version control should always be derived from USE_MOCK config.
