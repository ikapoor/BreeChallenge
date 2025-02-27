"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useLocalStorage from "use-local-storage";
import { USER_COOKIE_NAME } from "@/components/header";
import { User } from "@/types/types";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [user] = useLocalStorage<User | null>(USER_COOKIE_NAME, null);

  useEffect(() => {
    if (!user || !user.is_admin) {
      router.push("/user/application");
    }
  }, [user, router]);

  return <div>{children}</div>;
};

export default AdminLayout;
