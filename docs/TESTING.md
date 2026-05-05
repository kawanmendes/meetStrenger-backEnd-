# Testing

## Pré-requisitos

- PostgreSQL acessível via `DATABASE_URL`
- Servidor rodando para `npm run test:api`

## Scripts

```bash
npm test
npm run test:api
npm run test:quick
```

## Contratos cobertos

- Auth HTTP
- Matching HTTP
- Health check com PostgreSQL
- WebSocket em kebab-case
- Categorias `movies`, `gaming`, `music`, `study`
- Payload de mensagem `{ text }`
