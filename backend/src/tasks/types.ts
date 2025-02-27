export type CreateApplicationTaskArgs = {
  amount: number;
  userID: number;
  expressDelivery: boolean;
};

export type CancelApplicationArgs = {
  applicationID: number;
};

export type RejectApplicationArgs = {
  applicationID: number;
};

export type DisburseFundsArgs = {
  applicationID: number;
  amount: number;
  tip: number;
};

export type RepayFundsArgs = {
  applicationID: number;
  amount: number;
};

export enum TaskType {
  CREATE_APPLICATION = "create_application",
  DISBURSE_FUNDS = "disburse_funds",
  REPAY_FUNDS = "repay_funds",
  CANCEL_APPLICATION = "cancel_application",
  REJECT_APPLICATION = "reject_application",
}

interface BaseTaskArgs {
  userID: number;
}

export type TaskArgs = BaseTaskArgs &
  (
    | {
        type: TaskType.CREATE_APPLICATION;
        data: CreateApplicationTaskArgs;
      }
    | { type: TaskType.CANCEL_APPLICATION; data: CancelApplicationArgs }
    | { type: TaskType.REJECT_APPLICATION; data: RejectApplicationArgs }
    | { type: TaskType.DISBURSE_FUNDS; data: DisburseFundsArgs }
    | { type: TaskType.REPAY_FUNDS; data: RepayFundsArgs }
  );
