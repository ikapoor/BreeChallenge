import { FastifyInstance } from 'fastify'
import prisma from '../clients/prismaClient'
import { CreateUserBody } from "./types"
const bcrypt = require('bcrypt')
import BullMQClient from '../clients/bullmqClient'

const SALT_ROUNDS = 10

export async function userRoutes(fastify: FastifyInstance) {


  fastify.get('/users', async (_, reply) => {
    try {
      const users = await prisma.user.findMany()
      return reply.send(users)
    } catch (err) {
      fastify.log.error(err)
      return reply.status(500).send({ error: 'Internal Server Error' })
    }
  })


  fastify.post('/signup', async (request, reply) => {
    const { name, email, password, isAdmin } = request.body as CreateUserBody

    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (user) {
      return reply.status(400).send({ error: 'User with this email already exists' })
    }
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS)
      const newUser = await prisma.user.create({
        data: { 
          name,
          email,
          password_hash,
          is_admin: isAdmin
          
        }
      })
      return reply.status(201).send(newUser)
  })
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as CreateUserBody

    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }
     
      return reply.status(201).send(user)
  })
}