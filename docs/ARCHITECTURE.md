# Architecture

MeetStranger Backend é uma API Express com Socket.IO para matching P2P em tempo real.

## Camadas

```txt
request -> route -> middleware -> controller -> service -> database/memory
socket event -> websocket service -> matching service -> socket emit
```

## Banco

PostgreSQL é a fonte de verdade para usuários.

Dados persistidos:

- users
- status online/offline
- último login

Dados em memória:

- filas por categoria
- salas ativas

Mensagens são transitórias.

## Categorias

- `movies`
- `gaming`
- `music`
- `study`

## Limitações atuais

- Filas e salas em memória não escalam horizontalmente sem Redis.
- Mensagens não são persistidas.
- Logout não revoga JWT, apenas marca usuário offline.
