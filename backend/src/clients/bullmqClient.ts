import { Queue } from 'bullmq' // Import BullMQ
import { TaskArgs } from '../tasks/types';



const QUEUE_NAME = 'taskQueue'

class BullMQClient {
  private static instance: BullMQClient;
  private taskQueue: Queue;

  private constructor() {
    this.taskQueue = new Queue(QUEUE_NAME, {
      connection: {
        host: 'localhost',
        port: 6379
      }
    });
  }

  public static getInstance(): BullMQClient {
    if (!BullMQClient.instance) {
      BullMQClient.instance = new BullMQClient();
    }
    return BullMQClient.instance;
  }

  public getQueue(): Queue {
    return this.taskQueue;
  }

  public addJob(jobName: string, jobData: TaskArgs) {
    this.taskQueue.add(jobName, jobData)
  }

}

export default BullMQClient.getInstance()
