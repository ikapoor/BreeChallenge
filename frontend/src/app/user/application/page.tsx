"use client";
import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import { USER_COOKIE_NAME } from "../layout";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Application {
  id: number;
  amount: number;
  status: string;
  expressDelivery: boolean;
  createdAt: string;
}

export default function ApplicationList() {
  const [user] = useLocalStorage<User | null>(USER_COOKIE_NAME, null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/applications/user/${user.id}`
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
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Applications</h1>
        <Button onClick={() => router.push("/user/application/create")}>
          New Application
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center text-gray-500">
          No applications found. Create your first application!
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <div
              onClick={() => router.push(`/user/application/${application.id}`)}
              key={application.id}
              className="border rounded-lg p-4 shadow-sm  hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Amount: ${application.amount}</p>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      application.status === "OPEN"
                        ? "bg-green-100 text-green-800"
                        : application.status === "OUTSTANDING"
                        ? "bg-blue-100 text-blue-800"
                        : application.status === "REPAID"
                        ? "bg-yellow-100 text-yellow-800"
                        : application.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {application.status}
                  </span>
                  {application.expressDelivery && (
                    <span className="text-sm text-purple-600 mt-1">
                      Express Delivery
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
