# yaarxiv API

This project contains the API information (endpoints and data schema) of yaarxiv, which can be used by both the frontend and backend to generate clients and server routes.

# Development

After modifying any API, run `npm run compile` to generate data schemas `schemas.json` based on the `Schema` interface, which will be used by the backend to generate validation rules.

This project should NOT be compiled. Instead, the build pipelines of frontend and backend will include this project and bundle its content into frontand and backend bundles.
