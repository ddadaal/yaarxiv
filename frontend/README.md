# yaarxiv frontend

The frontend of yaarxiv.

# Features

- With [grommet](https://v2.grommet.io/):
    - Complete flexbox layout
    - Every pixel is accurately aligned!
    - No styling on the source code whatsoever: all styles defined in theme object!
- Side-server rendering with [Next.js](https://nextjs.org/)
- Automatic API client generation based on the [API project](https://github.com/ddadaal/yaarxiv/tree/master/api) with all types (response types, parameter types etc) inferred automatically!
- Separate API layer with mock for complete backend-less development
- Hot-changable i18n with [simstate-i18n](https://github.com/ddadaal/simstate-i18n)

# Development

Make sure the [API project](https://github.com/ddadaal/yaarxiv/tree/master/api) is located on the parent directory of this project (`../api`).

```bash
# Start dev server
npm run dev

# Build for production
npm run build
```
