import { FastifyInstance } from "fastify";
import { CreateApplicationBody } from "./types";
import prisma from "../clients/prismaClient";
import { ApplicationStatus } from "@prisma/client";
import BullMQClient from "../clients/bullmqClient";

import { TaskType, CreateApplicationTaskArgs } from "../tasks/types";

export async function applicationRoutes(fastify: FastifyInstance) {
  fastify.post("/", async (request, reply) => {
    const { userID, amount, expressDelivery } =
      request.body as CreateApplicationBody;

    BullMQClient.addJob(
      `create-application-${userID}-amount-${amount}-express-${expressDelivery}`,
      {
        userID,
        type: TaskType.CREATE_APPLICATION,
        data: {
          userID,
          expressDelivery,
          amount,
        },
      }
    );
  });

  fastify.get("", async (request, reply) => {
    const { status } = request.query as { status?: ApplicationStatus };

    const whereClause = status ? { status } : {};

    return prisma.lineOfCreditApplication.findMany({
      where: whereClause,
    });
  });

  fastify.get("/user/:userID", async (request, reply) => {
    const { userID } = request.params as { userID: string };

    return prisma.lineOfCreditApplication.findMany({
      where: {
        user_id: parseInt(userID),
      },
    });
  });

  fastify.get("/:applicationID", async (request, reply) => {
    const { applicationID } = request.params as { applicationID: string };

    return prisma.lineOfCreditApplication.findUnique({
      where: {
        id: parseInt(applicationID),
      },
    });
  });

  fastify.post("/cancel", async (request, reply) => {
    const { userID, applicationID } = request.body as {
      userID: number;
      applicationID: number;
    };

    const application = await prisma.lineOfCreditApplication.findUnique({
      where: {
        id: applicationID,
      },
    });
    if (userID !== application?.user_id) {
      throw new Error(
        "User does not have permission to cancel this application"
      );
    }

    BullMQClient.addJob(`cancel-application-${applicationID}`, {
      type: TaskType.CANCEL_APPLICATION,
      userID,
      data: {
        applicationID,
      },
    });
  });

  fastify.post("/:applicationID/disburse", async (request, reply) => {
    const { applicationID } = request.params as { applicationID: string };
    const { amount, tip, userID } = request.body as {
      amount: number;
      tip: number;
      userID: number;
    };
    const application = await prisma.lineOfCreditApplication.findUnique({
      where: {
        id: parseInt(applicationID),
      },
    });
    if (!application) {
      throw new Error("Application not found");
    }
    if (userID !== application?.user_id) {
      throw new Error(
        "User does not have permission to disburse funds for this application"
      );
    }
    BullMQClient.addJob(`disburse-application-${applicationID}`, {
      type: TaskType.DISBURSE_FUNDS,
      userID,
      data: {
        applicationID: parseInt(applicationID),
        amount,
        tip,
      },
    });
  });

  fastify.post("/:applicationID/repay", async (request, reply) => {
    const { applicationID } = request.params as { applicationID: string };
    const { amount, userID } = request.body as {
      amount: number;
      userID: number;
    };
    const application = await prisma.lineOfCreditApplication.findUnique({
      where: {
        id: parseInt(applicationID),
      },
    });
    if (!application) {
      throw new Error("Application not found");
    }
    if (userID !== application?.user_id) {
      throw new Error(
        "User does not have permission to disburse funds for this application"
      );
    }
    BullMQClient.addJob(`repay-application-${applicationID}`, {
      type: TaskType.REPAY_FUNDS,
      userID,
      data: {
        applicationID: parseInt(applicationID),
        amount,
      },
    });
  });

  fastify.post("/:applicationID/reject", async (request, reply) => {
    const { applicationID } = request.params as { applicationID: string };

    const application = await prisma.lineOfCreditApplication.findUnique({
      where: {
        id: parseInt(applicationID),
      },
    });
    if (!application) {
      throw new Error("Application not found");
    }

    BullMQClient.addJob(`reject-application-${applicationID}`, {
      type: TaskType.REJECT_APPLICATION,
      userID: application.user_id,
      data: {
        applicationID: parseInt(applicationID),
      },
    });
  });
}
