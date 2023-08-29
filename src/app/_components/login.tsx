"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import { EnterIcon } from "@radix-ui/react-icons";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, {
      message: "Password must be at least 3 characters.",
    })
    .max(50),
});

type FormSchemaInput = z.infer<typeof formSchema>;

function Login() {
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
    credential: false,
  });

  const { theme } = useTheme();

  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Define your form.
  const form = useForm<FormSchemaInput>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function loginWithGoogle() {
    console.log("Google");
    setIsLoading((prev) => (prev = { ...prev, google: !prev.google }));
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => (prev = { ...prev, google: !prev.google }));
    }
  }

  async function loginWithGithub() {
    console.log("Github");

    setIsLoading((prev) => (prev = { ...prev, github: !prev.github }));
    try {
      await signIn("github");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => (prev = { ...prev, github: !prev.github }));
    }
  }

  async function onSubmit(values: FormSchemaInput) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // console.log(form.formState.isSubmitting);

    setIsLoading((prev) => (prev = { ...prev, credential: !prev.credential }));
    try {
      const user = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log(user)

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(
        (prev) => (prev = { ...prev, credential: !prev.credential })
      );
    }
  }

  return (
    <Card className="flex-1 rounded-md max-w-xl py-8 px-2">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <Form {...form}>
          <form className="space-y-8">
            <div className="flex-1 flex space-y-6 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jsmith@example.com"
                        type="email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
              isLoading={isLoading.credential}
            >
              {isLoading.credential ? null : (<EnterIcon className="mr-2" />)}
              <span>Sign in to your account</span>
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              {"Don't"} have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </form>
        </Form>
        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="button"
          className="w-full"
          size="lg"
          onClick={loginWithGithub}
          isLoading={isLoading.github}
        >
          {isLoading.github ? null : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              className="mr-2 h-5 w-5"
              viewBox="0 0 64 64"
              fill={
                isMounted
                  ? cn({
                      ["#FFFFFF"]: theme === "light", //always applies
                      ["black"]: theme === "dark", //only when open === true
                    })
                  : ""
              }
            >
              <path d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z"></path>
            </svg>
          )}
          <span>Sign in with Github</span>
        </Button>
        <Button
          type="button"
          className="w-full"
          size="lg"
          onClick={loginWithGoogle}
          isLoading={isLoading.google}
        >
          {isLoading.google ? null : (
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="github"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          )}
          <span>Sign in with Google</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
