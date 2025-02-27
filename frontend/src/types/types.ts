export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  password_hash: string;
  balance: number;
  is_admin: boolean;
};
export type Application = {
  id: number;
  amount: number;
  amount_disbursed: number;
  status: string;
  expressDelivery: boolean;
  createdAt: string;
  updatedAt: string;
  user_id: number;
};
