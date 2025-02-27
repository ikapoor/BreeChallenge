"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import useLocalStorage from "use-local-storage";
import { useRouter } from "next/navigation";
import { USER_COOKIE_NAME } from "@/app/user/layout";

export default function LoginForm({}: React.ComponentPropsWithoutRef<"div">) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useLocalStorage(USER_COOKIE_NAME, null);
  const router = useRouter();

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        if (isLogin) {
          const res = await axios.post("http://localhost:3000/login", {
            email,
            password,
          });
          toast.success("Login successful");
          setUser(res.data);
          router.push("/user/application");
        } else {
          const res = await axios.post("http://localhost:3000/signup", {
            email,
            password,
            isAdmin,
            name,
          });
          toast.success("Account created successfully");
          setUser(res.data);
          router.push("/user/application");
        }
      } catch (error) {
        const errorMessage =
          (error as any).response.data.error || "An error occurred";
        toast.error(errorMessage);
      }
    },
    [email, password, isLogin, name, isAdmin, router, user]
  );

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your email below to login to your account"
              : "Enter your email below to sign up for an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="text"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </div>
              {!isLogin && (
                <div className="grid gap-2">
                  <div className="flex items-center justify-center">
                    <Label htmlFor="isAdmin">Admin</Label>
                  </div>
                  <div className="flex justify-center">
                    <Input
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      id="isAdmin"
                      type="checkbox"
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full">
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </div>
            {isLogin ? (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </a>
              </div>
            ) : (
              <div className="mt-4 text-center text-sm">
                Have an account?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
