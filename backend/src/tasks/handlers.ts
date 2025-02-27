import {
  CreateApplicationTaskArgs,
  TaskType,
  CancelApplicationArgs,
  RejectApplicationArgs,
  DisburseFundsArgs,
  RepayFundsArgs,
} from "./types";
import prisma from "../clients/prismaClient";
import {
  ApplicationStatus,
  LineOfCreditApplication,
  TransactionType,
} from "@prisma/client";
import { Job } from "bullmq";
import { TaskArgs } from "./types";
const createApplicationTask = async (args: CreateApplicationTaskArgs) => {
  const { expressDelivery, userID, amount } = args;
  const application = await prisma.lineOfCreditApplication.create({
    data: {
      amount,
      expressDelivery,
      user_id: userID,
      status: ApplicationStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

const handleCancelApplication = async (args: CancelApplicationArgs) => {
  const { applicationID } = args;
  const application = await prisma.lineOfCreditApplication.findUnique({
    where: {
      id: applicationID,
    },
  });
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.status !== ApplicationStatus.OPEN) {
    throw new Error("Cannot cancel application that is not open");
  }
  await prisma.lineOfCreditApplication.update({
    where: {
      id: applicationID,
    },
    data: {
      status: ApplicationStatus.CANCELLED,
    },
  });
};

const handleRejectApplication = async (args: RejectApplicationArgs) => {
  const { applicationID } = args;
  const application = await prisma.lineOfCreditApplication.findUnique({
    where: {
      id: applicationID,
    },
  });
  if (!application) {
    throw new Error("Application not found");
  }
  if (application.status !== ApplicationStatus.OPEN) {
    throw new Error("Cannot reject application that is not open");
  }
  await prisma.lineOfCreditApplication.update({
    where: {
      id: applicationID,
    },
    data: {
      status: ApplicationStatus.REJECTED,
    },
  });
};

export const handleDisburseFunds = async (args: DisburseFundsArgs) => {
  const { applicationID, amount, tip } = args;
  console.log("Disbursing funds ", applicationID, amount, tip);
  const application = await prisma.lineOfCreditApplication.findUnique({
    where: {
      id: applicationID,
    },
  });
  if (!application) {
    throw new Error("Application not found");
  }
  if (
    application.status in
    [ApplicationStatus.REJECTED, ApplicationStatus.CANCELLED]
  ) {
    throw new Error(
      "Cannot disburse funds for application that is rejected or cancelled"
    );
  }
  const availableAmount = application.amount - application.amount_disbursed;

  if (tip + amount > availableAmount) {
    throw new Error("Cannot disburse more than the available amount");
  }
  createTipTransaction(application, tip);
  createDisbursementTransaction(application, amount);

  await prisma.lineOfCreditApplication.update({
    where: {
      id: applicationID,
    },
    data: {
      amount_disbursed: application.amount_disbursed + amount + tip,
      status: ApplicationStatus.OUTSTANDING,
    },
  });
};

export const handleRepayFunds = async (args: RepayFundsArgs) => {
  const { applicationID, amount } = args;

  const application = await prisma.lineOfCreditApplication.findUnique({
    where: {
      id: applicationID,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }
  if (application.status !== ApplicationStatus.OUTSTANDING) {
    throw new Error(
      "Cannot repay funds for application that is not outstanding"
    );
  }

  const newAmountDisbursed = Math.max(0, application.amount_disbursed - amount);

  const overpaidAmount = amount - application.amount_disbursed;
  createRepaymentTransaction(application, amount - overpaidAmount);

  await prisma.lineOfCreditApplication.update({
    where: {
      id: applicationID,
    },
    data: {
      amount_disbursed: newAmountDisbursed,
      status:
        newAmountDisbursed === 0
          ? ApplicationStatus.REPAID
          : application.status,
    },
  });
};

export const handleTask = async (job: Job<TaskArgs>) => {
  const { type, data } = job.data;
  switch (type) {
    case TaskType.CREATE_APPLICATION:
      await createApplicationTask(data);
      return;
    case TaskType.CANCEL_APPLICATION:
      console.log("Cancelling application");
      await handleCancelApplication(data);
      return;
    case TaskType.REJECT_APPLICATION:
      await handleRejectApplication(data);
      return;
    case TaskType.DISBURSE_FUNDS:
      await handleDisburseFunds(data);
      return;
    case TaskType.REPAY_FUNDS:
      await handleRepayFunds(data);
      return;
    default:
      break;
  }
};

const handleOverpaidAmount = async (applicationID: number, amount: number) => {
  //TODO: handle overpaid amount
};

const createTipTransaction = async (
  application: LineOfCreditApplication,
  amount: number
) => {
  await prisma.transaction.create({
    data: {
      amount: amount,
      user_id: application.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TransactionType.TIP,
      application_id: application.id,
    },
  });

  //TODO: handle tip
};

const createDisbursementTransaction = async (
  application: LineOfCreditApplication,
  amountDisbursed: number
) => {
  await prisma.transaction.create({
    data: {
      amount: amountDisbursed,
      user_id: application.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TransactionType.DISBURSEMENT,
      application_id: application.id,
    },
  });
};

const createRepaymentTransaction = async (
  application: LineOfCreditApplication,
  amount: number
) => {
  await prisma.transaction.create({
    data: {
      amount: amount,
      user_id: application.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TransactionType.REPAYMENT,
      application_id: application.id,
    },
  });
};
