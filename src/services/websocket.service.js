const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const matchingService = require('./matching.service');
const authService = require('./auth.service');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(io) {
    this.io = io;

    io.on('connection', (socket) => {
      socket.on('authenticate', async ({ token } = {}) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          socket.userId = decoded.userId;
          this.connectedUsers.set(decoded.userId, socket.id);
          await authService.setUserOnline(decoded.userId, true);
          socket.emit('authenticated', { userId: decoded.userId });
        } catch (error) {
          socket.emit('auth-error', { error: 'Invalid token' });
        }
      });

      socket.on('find-match', async ({ category } = {}) => {
        if (!socket.userId) {
          socket.emit('error', { error: 'Not authenticated' });
          return;
        }

        if (!matchingService.CATEGORIES.includes(category)) {
          socket.emit('error', { error: 'Invalid category. Use: movies, gaming, music, study' });
          return;
        }

        const result = matchingService.joinQueue(socket.userId, socket.id, category);

        if (result.matched) {
          const user1 = await authService.getUserById(socket.userId);
          const user2 = await authService.getUserById(result.partnerId);
          const partnerSocket = io.sockets.sockets.get(result.partnerSocketId);

          socket.emit('match-found', {
            roomId: result.roomId,
            category: result.category,
            partner: { username: user2 ? user2.username : 'User' }
          });

          if (partnerSocket) {
            partnerSocket.emit('match-found', {
              roomId: result.roomId,
              category: result.category,
              partner: { username: user1 ? user1.username : 'User' }
            });
          }

          return;
        }

        socket.emit('queue-status', {
          category: result.category,
          position: result.queuePosition,
          estimatedWait: result.estimatedWait
        });
      });

      socket.on('cancel-matching', () => {
        if (!socket.userId) return;
        matchingService.leaveAllQueues(socket.userId);
        socket.emit('matching-cancelled', { success: true });
      });

      socket.on('join-room', ({ roomId } = {}) => {
        const room = matchingService.getRoom(roomId);
        if (!room || (room.user1Id !== socket.userId && room.user2Id !== socket.userId)) {
          socket.emit('error', { error: 'Access denied to this room' });
          return;
        }

        socket.join(roomId);
        socket.currentRoom = roomId;
        socket.emit('room-joined', { roomId });
      });

      socket.on('send-message', async ({ text } = {}) => {
        if (!socket.currentRoom || !socket.userId || typeof text !== 'string' || !text.trim()) return;

        const sender = await authService.getUserById(socket.userId);
        socket.to(socket.currentRoom).emit('new-message', {
          id: uuidv4(),
          text: text.trim(),
          senderId: socket.userId,
          username: sender ? sender.username : 'User',
          timestamp: new Date()
        });
      });

      socket.on('typing-start', () => {
        if (socket.currentRoom) {
          socket.to(socket.currentRoom).emit('partner-typing', { isTyping: true });
        }
      });

      socket.on('typing-stop', () => {
        if (socket.currentRoom) {
          socket.to(socket.currentRoom).emit('partner-typing', { isTyping: false });
        }
      });

      socket.on('leave-room', ({ roomId } = {}) => {
        this.handleLeaveRoom(socket, roomId);
      });

      socket.on('disconnect', async () => {
        if (!socket.userId) return;

        await authService.setUserOnline(socket.userId, false);
        matchingService.leaveAllQueues(socket.userId);
        this.connectedUsers.delete(socket.userId);
        this.handleLeaveRoom(socket, socket.currentRoom, true);
      });
    });

    setInterval(() => {
      matchingService.cleanupInactiveRooms();
    }, 5 * 60 * 1000);
  }

  handleLeaveRoom(socket, roomId = null, isDisconnect = false) {
    const targetRoom = roomId || socket.currentRoom;
    if (!targetRoom) return;

    const roomData = matchingService.leaveRoom(targetRoom, socket.userId);

    if (roomData) {
      socket.to(targetRoom).emit('partner-left', {
        roomId: targetRoom,
        message: isDisconnect ? 'Your partner disconnected' : 'Your partner left the conversation'
      });

      this.requeuePartner(roomData);
    }

    socket.leave(targetRoom);
    socket.currentRoom = null;
  }

  requeuePartner(roomData) {
    if (!roomData.partnerSocketId || !this.io) return;

    const partnerSocket = this.io.sockets.sockets.get(roomData.partnerSocketId);
    if (!partnerSocket) return;

    partnerSocket.currentRoom = null;
    partnerSocket.emit('partner-disconnected', {
      message: 'Finding a new person...'
    });

    setTimeout(async () => {
      if (!partnerSocket.userId) return;

      const result = matchingService.joinQueue(partnerSocket.userId, partnerSocket.id, roomData.category);

      if (result.matched) {
        const newPartnerSocket = this.io.sockets.sockets.get(result.partnerSocketId);

        partnerSocket.emit('match-found', {
          roomId: result.roomId,
          category: result.category,
          partner: { username: 'User' }
        });

        if (newPartnerSocket) {
          newPartnerSocket.emit('match-found', {
            roomId: result.roomId,
            category: result.category,
            partner: { username: 'User' }
          });
        }

        return;
      }

      partnerSocket.emit('queue-status', {
        category: result.category,
        position: result.queuePosition,
        estimatedWait: result.estimatedWait
      });
    }, 1000);
  }

  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  isInitialized() {
    return Boolean(this.io);
  }
}

module.exports = new WebSocketService();
