import { Worker, Job } from 'bullmq'
import { TaskArgs } from './tasks/types'
import { handleTask } from './tasks/handlers'


const QUEUE_NAME = 'taskQueue'


const worker = new Worker(QUEUE_NAME, async (job: Job<TaskArgs>) => {
  
  console.log(`Processing job ${job.id} with data:`, job.data)
  await handleTask(job)

}, {
  connection: {
    host: 'localhost',
    port: 6379
  }
})

worker.on('completed', job => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err)
})