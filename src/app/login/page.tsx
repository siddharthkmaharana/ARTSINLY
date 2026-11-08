"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Check,
  Award,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "bg-gray-200 dark:bg-gray-700", text: "text-gray-400" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
  return { score: 4, label: "Strong", color: "bg-emerald-600", text: "text-emerald-700 dark:text-emerald-300" };
}

function sanitizeAuthError(err?: string, fallback = "Authentication error"): string {
  if (!err) return fallback;
  if (
    err.includes("Can't reach database") ||
    err.includes("TURBOPACK") ||
    err.includes("invocation") ||
    err.includes("localhost:5432")
  ) {
    return "Database server is offline. Please try again with offline demo mode.";
  }
  return err;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { login, register } = useAuth();
  const [signupRole, setSignupRole] = useState<"BUYER" | "SELLER">("BUYER");

  // Form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const passwordStrength = getPasswordStrength(signupPassword);

  const validateLogin = () => {
    const errs: { [key: string]: string } = {};
    if (!loginEmail.trim()) {
      errs.loginEmail = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      errs.loginEmail = "Please enter a valid email address";
    }

    if (!loginPassword) {
      errs.loginPassword = "Password is required";
    } else if (loginPassword.length < 6) {
      errs.loginPassword = "Password must be at least 6 characters";
    }
    return errs;
  };

  const validateSignup = () => {
    const errs: { [key: string]: string } = {};
    if (!signupName.trim()) {
      errs.signupName = "Name is required";
    } else if (signupName.trim().length < 2) {
      errs.signupName = "Name must be at least 2 characters";
    }

    if (!signupEmail.trim()) {
      errs.signupEmail = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      errs.signupEmail = "Please enter a valid email address";
    }

    if (!signupPassword) {
      errs.signupPassword = "Password is required";
    } else if (signupPassword.length < 8) {
      errs.signupPassword = "Password must be at least 8 characters";
    }

    if (!signupConfirmPassword) {
      errs.signupConfirmPassword = "Confirm password is required";
    } else if (signupPassword !== signupConfirmPassword) {
      errs.signupConfirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      errs.agreeTerms = "You must accept the Terms of Service to continue";
    }
    return errs;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const result = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!result.success) {
      const msg = sanitizeAuthError(result.error, "Invalid email or password");
      setErrors({ loginEmail: msg });
      return;
    }

    setIsSuccess(true);
    setSuccessMessage(`Welcome back, ${result.user?.name || loginEmail.split("@")[0]}!`);

    setTimeout(() => {
      if (result.user?.role === "SELLER") {
        if (!result.user.sellerProfile) {
          router.push("/seller/onboarding");
        } else {
          router.push("/seller/dashboard");
        }
      } else {
        router.push("/buyer/dashboard");
      }
    }, 1100);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const result = await register({
      email: signupEmail,
      password: signupPassword,
      name: signupName,
      role: signupRole,
    });
    setIsSubmitting(false);

    if (!result.success) {
      const msg = sanitizeAuthError(result.error, "Failed to create account");
      setErrors({ signupEmail: msg });
      return;
    }

    setIsSuccess(true);
    setSuccessMessage(`Account created for ${signupName}! Redirecting...`);

    setTimeout(() => {
      if (signupRole === "SELLER") {
        router.push("/seller/onboarding");
      } else {
        router.push("/buyer/dashboard");
      }
    }, 1100);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] dark:bg-[#141311] text-[#1E1E1C] dark:text-[#FAF7F2] flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* 1. Header Bar: Pavilion Back Link + Brand Wordmark + Theme Toggle */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#6E6A62] dark:text-[#A8A297] hover:text-[#1E1E1C] dark:hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#1E1E1C] dark:text-[#FAF7F2]">
          ARTISANLY
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="pill" />
        </div>
      </header>

      {/* 2. Main Editorial Dual-Column Card */}
      <main className="max-w-5xl w-full mx-auto my-auto">
        <div className="bg-white dark:bg-[#1E1C19] border border-[#E5E0D7] dark:border-[#2D2A25] rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT COLUMN: Editorial Heritage Narrative & Craft Showcase */}
            <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-[#181614] p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5E0D7] dark:border-[#2D2A25]">
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-2.5">
                  AUTHENTIC INDIAN CRAFTS
                </span>

                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C] dark:text-[#FAF7F2] tracking-tight leading-snug">
                  Handcrafted Indian Art, Direct from Master Artisans.
                </h1>

                <p className="text-xs sm:text-[13px] text-[#6E6A62] dark:text-[#A8A297] leading-relaxed pt-2.5 font-light">
                  Discover genuine handmade crafts directly from verified artisans across India. Backed by certified Geographical Indication (GI) and direct fair-trade pricing.
                </p>

                {/* Heritage Craft Hero Visual Card */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#ECE6DC] dark:bg-[#24211D] border border-[#DDD5C8] dark:border-[#2D2A25] shadow-2xs mt-6 mb-5">
                  <img
                    src="/images/products/Odisha/Sambalpur Terracotta decorative lantern.png"
                    alt="Sambalpur Heritage Terracotta Lantern"
                    width={500}
                    height={375}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-amber-300 block mb-0.5">
                      FEATURED CRAFT
                    </span>
                    <span className="font-serif text-sm font-medium leading-snug text-white">
                      Sambalpur Heritage Terracotta Lantern
                    </span>
                    <div className="flex items-center justify-between pt-1.5 text-[10px] text-white/85">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-mono text-[9px]">
                        GI-IN-OD-POT
                      </span>
                      <span className="font-light">Master Kumbhar Artisans</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Trust Metrics */}
              <div className="pt-4 border-t border-[#E5E0D7] dark:border-[#2D2A25] grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="font-serif text-base font-semibold text-[#1E1E1C] dark:text-[#FAF7F2] block">88%+</span>
                  <span className="text-[10px] text-[#807B72] dark:text-[#A8A297] block leading-tight">Direct Artisan Payout</span>
                </div>
                <div>
                  <span className="font-serif text-base font-semibold text-[#1E1E1C] dark:text-[#FAF7F2] block">GI Tagged</span>
                  <span className="text-[10px] text-[#807B72] dark:text-[#A8A297] block leading-tight">Certified Origin</span>
                </div>
                <div>
                  <span className="font-serif text-base font-semibold text-[#1E1E1C] dark:text-[#FAF7F2] block">100%</span>
                  <span className="text-[10px] text-[#807B72] dark:text-[#A8A297] block leading-tight">Secure Payments</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sign In / Registration Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#1E1C19]">
              {isSuccess ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="font-serif text-2xl font-normal text-[#1E1E1C] dark:text-[#FAF7F2]">
                    Authentication Successful
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6A62] dark:text-[#A8A297] max-w-sm mx-auto leading-relaxed">
                    {successMessage}
                  </p>
                  <div className="pt-3 flex items-center justify-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[#C2410C]" />
                    <span className="text-xs text-[#7A756D] dark:text-[#A8A297]">Redirecting...</span>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Segmented Tab Pill */}
                  <div className="inline-flex items-center p-1 rounded-lg bg-[#EFECE6] dark:bg-[#161513] border border-[#DDD5C8] dark:border-[#2D2A25] w-full max-w-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrors({});
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        mode === "login"
                          ? "bg-white dark:bg-[#282622] text-[#1E1E1C] dark:text-[#FAF7F2] shadow-2xs"
                          : "text-[#6E6A62] dark:text-[#A8A297] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2]"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setErrors({});
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        mode === "signup"
                          ? "bg-white dark:bg-[#282622] text-[#1E1E1C] dark:text-[#FAF7F2] shadow-2xs"
                          : "text-[#6E6A62] dark:text-[#A8A297] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2]"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Section Title */}
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl font-normal text-[#1E1E1C] dark:text-[#FAF7F2] tracking-tight">
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </h2>
                    <p className="text-xs text-[#6E6A62] dark:text-[#A8A297]">
                      {mode === "login"
                        ? "Enter your credentials to access your account."
                        : "Join as a buyer to purchase crafts or register as an artisan to sell."}
                    </p>
                  </div>

                  {/* ================= LOGIN FORM ================= */}
                  {mode === "login" ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                      {/* Email Address */}
                      <div>
                        <label
                          htmlFor="login-email"
                          className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="login-email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => {
                              setLoginEmail(e.target.value);
                              if (errors.loginEmail) setErrors((prev) => ({ ...prev, loginEmail: "" }));
                            }}
                            placeholder="Enter your email"
                            autoComplete="email"
                            className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none transition-colors ${
                              errors.loginEmail
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-[#DDD5C8] dark:border-[#33302A] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                            }`}
                          />
                        </div>
                        {errors.loginEmail && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.loginEmail}</span>
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="login-password"
                            className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7]"
                          >
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowForgotModal(true)}
                            className="text-xs text-[#C2410C] hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (errors.loginPassword) setErrors((prev) => ({ ...prev, loginPassword: "" }));
                            }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none transition-colors ${
                              errors.loginPassword
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-[#DDD5C8] dark:border-[#33302A] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C877E] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2] cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.loginPassword && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.loginPassword}</span>
                          </p>
                        )}
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center pt-1">
                        <label className="flex items-center gap-2 text-xs text-[#555049] dark:text-[#A8A297] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-[#DDD5C8] text-[#C2410C] focus:ring-[#C2410C] cursor-pointer"
                          />
                          <span>Keep me signed in on this device</span>
                        </label>
                      </div>

                      {/* Primary Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 rounded-lg font-semibold text-xs tracking-wider uppercase text-white bg-[#1E1E1C] hover:bg-[#33302A] dark:bg-[#FAF7F2] dark:hover:bg-white dark:text-[#141311] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Signing In...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      {/* Footer toggle */}
                      <div className="text-center text-xs text-[#6E6A62] dark:text-[#A8A297] pt-2">
                        Don&apos;t have an account yet?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signup");
                            setErrors({});
                          }}
                          className="font-semibold text-[#C2410C] hover:underline cursor-pointer ml-1"
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ================= SIGNUP FORM ================= */
                    <form onSubmit={handleSignupSubmit} className="space-y-4" noValidate>
                      {/* Role Selector */}
                      <div>
                        <span className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5">
                          I am joining as:
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSignupRole("BUYER")}
                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                              signupRole === "BUYER"
                                ? "bg-[#FAF2EC] dark:bg-[#2A1D18] border-[#C2410C] shadow-2xs"
                                : "bg-[#FAF8F5] dark:bg-[#161513] border-[#DDD5C8] dark:border-[#33302A] hover:border-[#89714F]"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E1E1C] dark:text-[#FAF7F2]">
                              <User className={`w-3.5 h-3.5 ${signupRole === "BUYER" ? "text-[#C2410C]" : "text-[#8C877E]"}`} />
                              <span>Customer (Buyer)</span>
                            </div>
                            <p className="text-[10px] text-[#7A756D] dark:text-[#A8A297] mt-1">
                              Browse and purchase authentic crafts
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignupRole("SELLER")}
                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                              signupRole === "SELLER"
                                ? "bg-[#FAF2EC] dark:bg-[#2A1D18] border-[#C2410C] shadow-2xs"
                                : "bg-[#FAF8F5] dark:bg-[#161513] border-[#DDD5C8] dark:border-[#33302A] hover:border-[#89714F]"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E1E1C] dark:text-[#FAF7F2]">
                              <Award className={`w-3.5 h-3.5 ${signupRole === "SELLER" ? "text-[#C2410C]" : "text-[#8C877E]"}`} />
                              <span>Artisan (Seller)</span>
                            </div>
                            <p className="text-[10px] text-[#7A756D] dark:text-[#A8A297] mt-1">
                              Showcase and sell your handcrafted work
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label
                          htmlFor="signup-name"
                          className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5"
                        >
                          Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            id="signup-name"
                            type="text"
                            value={signupName}
                            onChange={(e) => {
                              setSignupName(e.target.value);
                              if (errors.signupName) setErrors((prev) => ({ ...prev, signupName: "" }));
                            }}
                            placeholder="Name"
                            autoComplete="name"
                            className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none transition-colors ${
                              errors.signupName
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-[#DDD5C8] dark:border-[#33302A] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                            }`}
                          />
                        </div>
                        {errors.signupName && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.signupName}</span>
                          </p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label
                          htmlFor="signup-email"
                          className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="signup-email"
                            type="email"
                            value={signupEmail}
                            onChange={(e) => {
                              setSignupEmail(e.target.value);
                              if (errors.signupEmail) setErrors((prev) => ({ ...prev, signupEmail: "" }));
                            }}
                            placeholder="Email address"
                            autoComplete="email"
                            className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none transition-colors ${
                              errors.signupEmail
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-[#DDD5C8] dark:border-[#33302A] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                            }`}
                          />
                        </div>
                        {errors.signupEmail && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.signupEmail}</span>
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label
                          htmlFor="signup-password"
                          className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5"
                        >
                          Password (min. 8 characters)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            value={signupPassword}
                            onChange={(e) => {
                              setSignupPassword(e.target.value);
                              if (errors.signupPassword) setErrors((prev) => ({ ...prev, signupPassword: "" }));
                            }}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none transition-colors ${
                              errors.signupPassword
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-[#DDD5C8] dark:border-[#33302A] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C877E] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2] cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.signupPassword && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.signupPassword}</span>
                          </p>
                        )}

                        {/* Password Strength Indicator */}
                        {signupPassword && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-[#807B72] dark:text-[#A8A297]">Strength:</span>
                              <span className={`font-semibold ${passwordStrength.text}`}>
                                {passwordStrength.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 h-1 bg-[#EAE5DD] dark:bg-[#2D2A25] rounded-full overflow-hidden">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-full rounded-full transition-colors ${
                                    level <= passwordStrength.score ? passwordStrength.color : "bg-transparent"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label
                          htmlFor="signup-confirm"
                          className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="signup-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            value={signupConfirmPassword}
                            onChange={(e) => {
                              setSignupConfirmPassword(e.target.value);
                              if (errors.signupConfirmPassword)
                                setErrors((prev) => ({ ...prev, signupConfirmPassword: "" }));
                            }}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none transition-colors ${
                              errors.signupConfirmPassword
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-[#DDD5C8] dark:border-[#33302A] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C877E] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2] cursor-pointer"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.signupConfirmPassword && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.signupConfirmPassword}</span>
                          </p>
                        )}
                      </div>

                      {/* Terms and Conditions Checkbox */}
                      <div>
                        <label className="flex items-start gap-2.5 text-xs text-[#555049] dark:text-[#A8A297] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => {
                              setAgreeTerms(e.target.checked);
                              if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: "" }));
                            }}
                            className="w-4 h-4 mt-0.5 rounded border-[#DDD5C8] text-[#C2410C] focus:ring-[#C2410C] cursor-pointer shrink-0"
                          />
                          <span className="leading-relaxed">
                            I agree to the{" "}
                            <Link href="/terms" className="text-[#C2410C] hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-[#C2410C] hover:underline">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>
                        {errors.agreeTerms && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 pl-6">
                            {errors.agreeTerms}
                          </p>
                        )}
                      </div>

                      {/* Signup Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 rounded-lg font-semibold text-xs tracking-wider uppercase text-white bg-[#1E1E1C] hover:bg-[#33302A] dark:bg-[#FAF7F2] dark:hover:bg-white dark:text-[#141311] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      {/* Footer toggle */}
                      <div className="text-center text-xs text-[#6E6A62] dark:text-[#A8A297] pt-2">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setErrors({});
                          }}
                          className="font-semibold text-[#C2410C] hover:underline cursor-pointer ml-1"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer Line */}
      <footer className="max-w-5xl w-full mx-auto text-center pt-6 text-[11px] text-[#8C877E] dark:text-[#7A756D]">
        © 2026 ARTSINLY · Authentic Handcrafted Art Direct From Master Artisans
      </footer>

      {/* 4. Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative z-10 w-full max-w-md p-6 sm:p-7 rounded-2xl border border-[#DDD5C8] dark:border-[#2D2A25] bg-white dark:bg-[#1E1C19] shadow-xl text-[#1E1E1C] dark:text-[#FAF7F2] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DD] dark:border-[#2D2A25]">
                <h3 className="font-serif text-lg font-normal">Reset Your Password</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="text-[#8C877E] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2] text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {forgotSent ? (
                <div className="py-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold">Instructions Dispatched</h4>
                  <p className="text-xs text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
                    We have dispatched password recovery instructions to <span className="font-semibold text-[#1E1E1C] dark:text-[#FAF7F2]">{forgotEmail}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#1E1E1C] hover:bg-[#33302A] dark:bg-[#FAF7F2] dark:hover:bg-white text-white dark:text-[#141311] font-semibold text-xs mt-3 cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
                    Enter the email address registered with your collector or artisan account and we will dispatch a secure recovery link.
                  </p>
                  <div>
                    <label htmlFor="forgot-email" className="block text-xs font-semibold text-[#3C3A35] dark:text-[#D6D1C7] mb-1.5">
                      Account Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C877E]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#161513] border border-[#DDD5C8] dark:border-[#33302A] rounded-lg text-xs sm:text-sm text-[#1E1E1C] dark:text-[#FAF7F2] placeholder-[#8C877E] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-[#6E6A62] dark:text-[#A8A297] hover:text-[#1E1E1C] dark:hover:text-[#FAF7F2] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Send Instructions
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F5EF] dark:bg-[#141311] text-[#1E1E1C] dark:text-[#FAF7F2]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C2410C]" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
