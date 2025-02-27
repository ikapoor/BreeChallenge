"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Application } from "@/types/types";
import { WarningDialog } from "@/components/warning-dialog";
import { toast } from "sonner";
import { DisbursementDialog } from "@/components/disbursement-dialog";
import { RepaymentDialog } from "@/components/repaymentDialog";

export default function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isCancelWarningDialogShowing, setisCancelWarningDialogShowing] =
    useState(false);
  const [isDisbursementDialogShowing, setisDisbursementDialogShowing] =
    useState(false);

  const [isRepaymentDialogShowing, setisRepaymentDialogShowing] =
    useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/applications/${id}`
        );

        setApplication(response.data);
      } catch (err) {
        setError("Failed to load application details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDisbursement = async () => {
    try {
      await axios.post(`http://localhost:3000/applications/${id}/disburse`);
      // Refresh application data
      const response = await axios.get(
        `http://localhost:3000/application/${id}`
      );
      setApplication(response.data);
    } catch (err) {
      setError("Failed to request disbursement");
      console.error(err);
    }
  };

  const handleCancel = async () => {
    try {
      await axios.post(`http://localhost:3000/applications/cancel`, {
        userID: application?.user_id,
        applicationID: application?.id,
      });
      toast.success("Cancellation request sent");
      router.push("/user/application");
    } catch (err) {
      setError("Failed to cancel application");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading...
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || "Application not found"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Application Details</h1>
        <WarningDialog
          open={isCancelWarningDialogShowing}
          title="Cancel Application"
          subtitle="Are you sure you want to cancel this application?"
          onCancel={() => {
            setisCancelWarningDialogShowing(false);
          }}
          onConfirm={() => {
            handleCancel();
            setisCancelWarningDialogShowing(false);
          }}
        />
        <DisbursementDialog
          applicationId={application.id}
          open={isDisbursementDialogShowing}
          setOpen={setisDisbursementDialogShowing}
        />
        <RepaymentDialog
          applicationId={application.id}
          open={isRepaymentDialogShowing}
          setOpen={setisRepaymentDialogShowing}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                application.status === "OPEN"
                  ? "bg-blue-100 text-blue-800"
                  : application.status === "OUTSTANDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : application.status === "REPAID"
                  ? "bg-green-100 text-green-800"
                  : application.status === "CANCELLED"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {application.status}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">${application.amount}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Amount Disbursed</span>
            <span className="font-medium">${application.amount_disbursed}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Express Delivery</span>
            <span className="font-medium">
              {application.expressDelivery ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Created At</span>
            <span className="font-medium">
              {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {(application.status === "OPEN" ||
          application.status === "OUTSTANDING" ||
          application.status === "REPAID") && (
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => setisDisbursementDialogShowing(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Request Disbursement
            </Button>
            {application.status === "OPEN" && (
              <Button
                onClick={() => setisCancelWarningDialogShowing(true)}
                variant="destructive"
              >
                Cancel Application
              </Button>
            )}
          </div>
        )}
        {application.status === "OUTSTANDING" && (
          <div className="mt-6">
            <Button
              onClick={() => {
                setisRepaymentDialogShowing(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Repay Amount
            </Button>
          </div>
        )}
        <div className="mt-6">
          <Button
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
