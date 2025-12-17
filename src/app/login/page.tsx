"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/auth";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import "@/styles/LoginPage.scss";

type LoginInput = z.infer<typeof loginSchema> & { remember?: boolean };

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail") ?? "";
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("remember", true);
    }
  }, [setValue]);

  const toggleShowPassword = useCallback(() => setShowPassword(prev => !prev), []);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Logged in successfully!");

      if (data.remember) localStorage.setItem("rememberEmail", data.email);
      else localStorage.removeItem("rememberEmail");


      const session = await getSession();
      if (session?.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(`/account`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error — try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
        <h1 className="loginTitle">Login</h1>

        <div>
          <label htmlFor="email" className="sr-only">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            {...register("email")}
            className={`inputField ${errors.email ? "inputError" : ""}`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="errorMsg">{errors.email.message}</p>}
        </div>

        <div className="passwordWrapper">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className={`inputField ${errors.password ? "inputError" : ""}`}
            aria-invalid={errors.password ? "true" : "false"}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="togglePassword"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="errorMsg">{errors.password.message}</p>}
        </div>

        <label className="rememberLabel">
          <input type="checkbox" {...register("remember")} /> Remember Me
        </label>

        <button type="submit" disabled={loading} className="btnPrimary">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="registerText">
          {"Don't have an account? "}
          <Link href="/register" className="linkPrimary">Register</Link>
        </p>
      </form>
    </div>
  );
}
