# API Contract

Base URL: `http://localhost:3000/api`

Response padrão:

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "error": "optional"
}
```

## Auth

### POST `/auth/register`

Body:

```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "secret123"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "username": "user123", "email": "user@example.com" },
    "token": "jwt"
  }
}
```

### POST `/auth/login`

Body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### POST `/auth/logout`

Requer `Authorization: Bearer <token>`.

### GET `/auth/profile`

Requer `Authorization: Bearer <token>`.

## Matching

Categorias aceitas:

- `movies`
- `gaming`
- `music`
- `study`

### POST `/matching/join`

Body:

```json
{
  "category": "gaming"
}
```

Response:

```json
{
  "success": true,
  "data": { "category": "gaming" },
  "message": "Use WebSocket event find-match for real-time matching"
}
```

### DELETE `/matching/leave`

Remove o usuário autenticado das filas em memória.

### GET `/matching/stats`

Response:

```json
{
  "success": true,
  "data": {
    "movies": 0,
    "gaming": 0,
    "music": 0,
    "study": 0,
    "activeRooms": 0
  }
}
```

## Chat

### GET `/chat/rooms`

Lista salas ativas em memória do usuário autenticado.

### GET `/chat/rooms/:roomId/messages`

Mensagens são transitórias; esse endpoint retorna lista vazia com paginação.

### POST `/chat/rooms/:roomId/messages`

Body:

```json
{
  "text": "Hello!"
}
```

Response:

```json
{
  "success": true,
  "data": { "roomId": "uuid", "text": "Hello!" },
  "message": "Use WebSocket event send-message for real-time delivery"
}
```

### POST `/chat/rooms/:roomId/leave`

Sai de uma sala ativa.

## Health

### GET `/health`

Valida conexão real com PostgreSQL.
