# api_Server

CRUD operations on a DB

## Changelog

- created repo with MIT license and node `.gitignore`.

- branched into `basic` branch.
- installed app (`dotenv@16.4.5`, `express@4.19.2`, `sequelize`, `sequelize-cli`, `pg`, and `sqlite3`) and dev (`--save-dev`)(`jest@29.7.0`, `supertest@6.3.4`, and `nodemon`) dependencies.
- created `src/error-handlers`, `src/middleware`, `src/models`, `src/routes`, `__tests__`, `.github/workflows` directories.
- pulled `index.js`, `/error-handlers/404.js`, `/error-handlers/500.js`, `/.middleware/logger.js`, `/workflows/javascript-tests.yml` from `basicExpressServer/`.
- created files:
  - `server.js` in `src/`;
  - `index.js`, `food.js`, `clothes.js` in  `src/models/`.
  - `food.js` and `clothes.js` in `src/routes/`.
  - `server.test.js` in `__tests__/`.
- configured `package.json` with `"scripts"` (including temp SQLite DB) and corrected license.
- installed `cors@2.8.5`; added in `src/server.js`.
- defined `foodModel();` -> `food.js`, `clothesModel();` -> `clothes.js`, and `index.js`; `models/`.
- implemented both (`food.js`, `clothes.js`) CRUD routers.
- 