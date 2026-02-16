import { Response } from 'express';
import { createRedisClient } from '../config/redis';

// Singleton to manage ALL SSE connections

class SSEManager {
  private clients: Map<string, Response> = new Map();
  private redisSub = createRedisClient('subscriber');

  constructor() {
    this.redisSub.psubscribe('job:*'); // Listen to all job channels
    
    this.redisSub.on('pmessage', (_pattern, channel, message) => {
      const jobId = channel.split(':')[1];
      this.broadcast(jobId, message);
    });
  }

  // Add a user connection
  public subscribe(jobId: string, res: Response) {
    console.log("seeManager:",jobId)
    this.clients.set(jobId, res);

    // Heartbeat (prevent timeouts)
    const keepAlive = setInterval(() => res.write(': ping\n\n'), 15000);

    res.on('close', () => {
      clearInterval(keepAlive);
      this.clients.delete(jobId);
    });
  }

  // Send data to specific user
  private broadcast(jobId: string, data: string) {
    const client = this.clients.get(jobId);
    if (client) {
      client.write(`data: ${data}\n\n`);
      
      const parsed = JSON.parse(data);
      if (parsed.status === 'completed' || parsed.status === 'failed') {
        console.log("sseManage: complexted Or failed:",parsed.status)
        client.end(); // Close connection on finish
        this.clients.delete(jobId);
      }
    }
  }
}

export const sseManager = new SSEManager();