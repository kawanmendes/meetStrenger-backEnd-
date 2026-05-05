const { v4: uuidv4 } = require('uuid');

const CATEGORIES = ['movies', 'gaming', 'music', 'study'];

const waitingQueues = CATEGORIES.reduce((queues, category) => {
  queues[category] = [];
  return queues;
}, {});

const activeRooms = new Map();

class MatchingService {
  joinQueue(userId, socketId, category) {
    this.leaveAllQueues(userId);

    const queue = waitingQueues[category];
    if (!queue) {
      throw new Error('Invalid category');
    }

    if (queue.length > 0) {
      const partner = queue.shift();
      const roomId = uuidv4();
      const room = {
        id: roomId,
        category,
        user1Id: partner.userId,
        user2Id: userId,
        user1SocketId: partner.socketId,
        user2SocketId: socketId,
        status: 'active',
        createdAt: new Date()
      };

      activeRooms.set(roomId, room);

      return {
        matched: true,
        roomId,
        category,
        partnerId: partner.userId,
        partnerSocketId: partner.socketId
      };
    }

    queue.push({
      userId,
      socketId,
      timestamp: Date.now()
    });

    return {
      matched: false,
      category,
      queuePosition: queue.length,
      estimatedWait: this.calculateEstimatedWait(queue.length)
    };
  }

  leaveQueue(userId, category = null) {
    if (category) {
      const queue = waitingQueues[category];
      if (!queue) return false;

      const index = queue.findIndex(item => item.userId === userId);
      if (index === -1) return false;

      queue.splice(index, 1);
      return true;
    }

    this.leaveAllQueues(userId);
    return true;
  }

  leaveAllQueues(userId) {
    Object.keys(waitingQueues).forEach(category => {
      const queue = waitingQueues[category];
      const index = queue.findIndex(item => item.userId === userId);
      if (index > -1) {
        queue.splice(index, 1);
      }
    });
  }

  getRoom(roomId) {
    return activeRooms.get(roomId);
  }

  getUserRoom(userId) {
    return Array.from(activeRooms.values()).find(
      room => room.user1Id === userId || room.user2Id === userId
    );
  }

  getUserRooms(userId) {
    return Array.from(activeRooms.values()).filter(
      room => room.user1Id === userId || room.user2Id === userId
    );
  }

  leaveRoom(roomId, userId) {
    const room = activeRooms.get(roomId);
    if (!room) return null;

    activeRooms.delete(roomId);

    const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;
    const partnerSocketId = room.user1Id === userId ? room.user2SocketId : room.user1SocketId;

    return {
      ...room,
      partnerId,
      partnerSocketId,
      status: 'ended',
      endedAt: new Date()
    };
  }

  calculateEstimatedWait(queuePosition) {
    const estimatedSeconds = queuePosition * 15;
    return estimatedSeconds < 60 ? `${estimatedSeconds}s` : `${Math.ceil(estimatedSeconds / 60)}m`;
  }

  getQueueStats() {
    return {
      movies: waitingQueues.movies.length,
      gaming: waitingQueues.gaming.length,
      music: waitingQueues.music.length,
      study: waitingQueues.study.length,
      activeRooms: activeRooms.size
    };
  }

  cleanupInactiveRooms() {
    const now = Date.now();
    const maxInactiveTime = 5 * 60 * 1000;

    for (const [roomId, room] of activeRooms.entries()) {
      if (now - room.createdAt.getTime() > maxInactiveTime) {
        activeRooms.delete(roomId);
      }
    }
  }
}

module.exports = new MatchingService();
module.exports.CATEGORIES = CATEGORIES;
