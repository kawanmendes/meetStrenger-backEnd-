# WebSocket Events

## Client to Server

- `authenticate` `{ token }`
- `find-match` `{ category }`
- `cancel-matching` `{}`
- `join-room` `{ roomId }`
- `send-message` `{ text }`
- `typing-start` `{}`
- `typing-stop` `{}`
- `leave-room` `{ roomId }`

## Server to Client

- `authenticated` `{ userId }`
- `auth-error` `{ error }`
- `error` `{ error }`
- `queue-status` `{ category, position, estimatedWait }`
- `match-found` `{ roomId, category, partner }`
- `matching-cancelled` `{ success }`
- `room-joined` `{ roomId }`
- `new-message` `{ id, text, senderId, username, timestamp }`
- `partner-typing` `{ isTyping }`
- `partner-left` `{ roomId, message }`
- `partner-disconnected` `{ message }`

## Categories

- `movies`
- `gaming`
- `music`
- `study`
