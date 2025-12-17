"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validation/auth";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";
import "@/styles/register.scss";

type RegisterInput = z.infer<typeof registerSchema> & { remember?: boolean };

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const emailValue = watch("email");
  const strengthScore = zxcvbn(password).score;

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Registration failed");
        return;
      }

      toast.success("Registered successfully — please login");
      if (data.remember) localStorage.setItem("rememberEmail", data.email);
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (emailValue) {
      localStorage.setItem("rememberEmail", emailValue);
    }
  }, [emailValue]);

  const getPasswordStrengthClass = () => {
    if (strengthScore < 2) return "weak";
    if (strengthScore < 4) return "fair";
    if (strengthScore === 4) return "very-strong";
    return "good";
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    return labels[strengthScore];
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Account</h1>

        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register("name")}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            {...register("email")}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <p className="text-sm">Typed Email: {emailValue}</p>

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-password-btn"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
          <p className={`password-strength ${getPasswordStrengthClass()}`}>
            {getPasswordStrengthLabel()}
          </p>
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" {...register("remember")} />
            Remember Me
          </label>
          <label>
            <input type="checkbox" {...register("terms")} required />
            I agree to <a href="/terms">Terms</a> & <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
