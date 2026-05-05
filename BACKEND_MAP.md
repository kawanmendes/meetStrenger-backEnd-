# MeetStranger Backend Map

## Estrutura

```txt
src/
  app.js
  controllers/
  database/
  middleware/
  routes/
  services/
docs/
tests/
```

## Banco

PostgreSQL via `DATABASE_URL`.

Tabela criada automaticamente:

```sql
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
)
```

## API

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

## WebSocket

Eventos em kebab-case:

- `authenticate`
- `find-match`
- `cancel-matching`
- `join-room`
- `send-message`
- `typing-start`
- `typing-stop`
- `leave-room`
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

## Categorias

- `movies`
- `gaming`
- `music`
- `study`

## Payload de mensagem

```json
{
  "text": "Hello!"
}
```
