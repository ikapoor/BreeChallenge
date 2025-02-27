"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AdminLayout from "./layout";
import { Application } from "@/types/types";

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/applications?status=OPEN"
        );
        setApplications(response.data);
      } catch (err) {
        setError("Failed to load applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleReject = async (applicationID: number) => {
    try {
      await axios.post(
        `http://localhost:3000/applications/${applicationID}/reject`
      );
      toast.success("Application rejected ");
      setApplications(applications.filter((app) => app.id !== applicationID));
    } catch (err) {
      setError("Failed to reject application");
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

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Open Applications</h1>
        {applications.length === 0 ? (
          <div className="text-center text-gray-500">
            No open applications found
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    Application ID: {application.id}
                  </div>
                  <div className="text-gray-600">
                    Amount: ${application.amount}
                  </div>
                  <div className="text-gray-600">
                    User ID: {application.user_id}
                  </div>
                </div>
                <Button
                  onClick={() => handleReject(application.id)}
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
