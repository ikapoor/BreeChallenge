"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useLocalStorage from "use-local-storage";
import { USER_COOKIE_NAME } from "../../layout";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Application() {
  const [user] = useLocalStorage(USER_COOKIE_NAME, null);
  const router = useRouter();

  const formSchema = z.object({
    amount: z.number().min(1, {
      message: "Amount must be greater than 0",
    }),
    express: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      express: false,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await axios.post(`http://localhost:3000/applications`, {
      userID: user?.id,
      amount: values.amount,
      express: values.express,
    });

    router.push(`/user/application`);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Amount Requested
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="express"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="checkbox"
                      className="w-4 h-4"
                      {...field}
                      checked={field.value}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Express Processing
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Get faster approval with express processing
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
