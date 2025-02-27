import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { userRoutes } from "./user/routes";
import cors from "@fastify/cors";
import { applicationRoutes } from "./application/routes";

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });

fastify.register(userRoutes);
fastify.register(applicationRoutes, { prefix: "/applications" });
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
