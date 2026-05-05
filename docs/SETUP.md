# Setup

## Variáveis de ambiente

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_SSL=false
JWT_SECRET=change-me
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
```

## Instalação

```bash
npm install
npm run setup
npm run dev
```

## Produção

- Use PostgreSQL gerenciado.
- Configure `ALLOWED_ORIGINS` sem wildcard.
- Use HTTPS.
- Para escalar WebSocket horizontalmente, mova filas/salas para Redis.
