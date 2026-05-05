# MeetStranger Backend

Backend Node.js/Express para chat P2P em tempo real com Socket.IO e PostgreSQL.

## Stack

- Node.js + Express
- Socket.IO
- PostgreSQL via `pg`
- JWT + bcrypt
- Joi validation
- Helmet, CORS e rate limit
- Swagger em `/api-docs`





Depois rode:

```bash
npm install
npm run setup
npm run dev
```

## Contrato HTTP

Base URL: `http://localhost:3000/api`

Todas as respostas seguem:

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "error": "optional"
}
```

Categorias globais:

```txt
movies
gaming
music
study
```

Rotas principais:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `POST /api/matching/join`
- `DELETE /api/matching/leave`
- `GET /api/matching/stats`
- `GET /api/chat/rooms`
- `GET /api/chat/rooms/:roomId/messages`
- `POST /api/chat/rooms/:roomId/messages`
- `POST /api/chat/rooms/:roomId/leave`
- `GET /api/health`

## Contrato WebSocket

Padrão único: kebab-case.

Cliente para servidor:

- `authenticate`
- `find-match`
- `cancel-matching`
- `join-room`
- `send-message`
- `typing-start`
- `typing-stop`
- `leave-room`

Servidor para cliente:

- `authenticated`
- `auth-error`
- `queue-status`
- `match-found`
- `matching-cancelled`
- `room-joined`
- `new-message`
- `partner-typing`
- `partner-left`
- `partner-disconnected`

Payload de mensagem:

```json
{
  "text": "Hello!"
}
```

Mensagens são transitórias e entregues por WebSocket. O banco persiste usuários e status básico.
