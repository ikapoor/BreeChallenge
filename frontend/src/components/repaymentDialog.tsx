"use client";
import { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";
import { USER_COOKIE_NAME } from "./header";

interface RepaymentDialogProps {
  open?: boolean;
  applicationId: number;
  setOpen: (open: boolean) => void;
}

export function RepaymentDialog({
  open = false,
  applicationId,
  setOpen,
}: RepaymentDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const [user] = useLocalStorage(USER_COOKIE_NAME, null);

  const handleSubmit = useCallback(async () => {
    if (amount <= 0) {
      setError(true);
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/applications/${applicationId}/repay`,
        {
          amount,
          userID: user?.id,
        }
      );
      toast.success("Repayment submitted successfully");
      router.push(`/user/application`);
      setOpen(false);
    } catch (error) {
      console.error("Failed to process repayment:", error);
      toast.error("Failed to process repayment");
    }
  }, [amount, setOpen, user?.id, applicationId, router]);

  const handleCancel = useCallback(() => {
    setAmount(0);
    setOpen(false);
  }, [setOpen]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Repay Amount</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the amount you would like to repay.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amount" className="text-right">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => {
                setError(false);
                setAmount(Number(parseFloat(e.target.value).toFixed(2)));
              }}
              className={`col-span-3 ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="Enter amount"
            />
          </div>
          {error && (
            <div className="col-span-4 text-red-500 text-sm">
              Please enter a valid amount greater than 0
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
