# WebSocket Contract

URL local: `ws://localhost:3000`

Padrão único de eventos: kebab-case.

## Autenticação

```js
socket.emit('authenticate', { token });

socket.on('authenticated', ({ userId }) => {});
socket.on('auth-error', ({ error }) => {});
```

## Matching

Categorias:

- `movies`
- `gaming`
- `music`
- `study`

```js
socket.emit('find-match', { category: 'gaming' });

socket.on('queue-status', ({ category, position, estimatedWait }) => {});
socket.on('match-found', ({ roomId, category, partner }) => {
  socket.emit('join-room', { roomId });
});
socket.emit('cancel-matching');
socket.on('matching-cancelled', ({ success }) => {});
```

## Chat

```js
socket.emit('join-room', { roomId });
socket.on('room-joined', ({ roomId }) => {});

socket.emit('send-message', { text: 'Hello!' });
socket.on('new-message', ({ id, text, senderId, username, timestamp }) => {});

socket.emit('typing-start');
socket.emit('typing-stop');
socket.on('partner-typing', ({ isTyping }) => {});

socket.emit('leave-room', { roomId });
socket.on('partner-left', ({ roomId, message }) => {});
socket.on('partner-disconnected', ({ message }) => {});
```

Mensagens não são persistidas no banco.
