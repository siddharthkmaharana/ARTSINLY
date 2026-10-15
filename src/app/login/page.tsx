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
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Check,
  Award,
  Globe2,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "bg-white/20", text: "text-white/40" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-orange-500", text: "text-orange-400" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-amber-500", text: "text-amber-400" };
  return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
}

interface FloatingInputProps {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ElementType;
  rightElement?: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
}

function FloatingInput({
  id,
  type = "text",
  label,
  value,
  onChange,
  error,
  icon: Icon,
  rightElement,
  autoComplete,
  required,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 backdrop-blur-md ${
          error
            ? "border-rose-500/70 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.18)]"
            : isFocused
            ? "border-amber-400/80 bg-white/10 shadow-[0_0_20px_rgba(251,191,36,0.2)] -translate-y-0.5"
            : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08] hover:-translate-y-0.5"
        }`}
      >
        {Icon && (
          <div className="pl-3.5 pr-1 text-white/50">
            <Icon className={`w-4 h-4 transition-colors ${isFocused ? "text-amber-300" : "text-white/50"}`} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete}
          required={required}
          className="w-full bg-transparent px-3 py-3.5 text-sm text-white placeholder-transparent focus:outline-none"
          placeholder={label}
        />
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 pointer-events-none select-none ${
            Icon ? "left-10" : "left-3"
          } ${
            isFloating
              ? "-top-2.5 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-slate-900/90 text-amber-300 border border-amber-400/30 backdrop-blur-sm"
              : "top-3.5 text-xs text-white/50"
          }`}
        >
          {label}
        </label>
        {rightElement && <div className="pr-3 flex items-center">{rightElement}</div>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-rose-400 flex items-center gap-1 mt-1 pl-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
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
  const [shakeKey, setShakeKey] = useState(0);

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
      errs.signupName = "Full name is required";
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
      setShakeKey((prev) => prev + 1);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const result = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!result.success) {
      setErrors({ loginEmail: result.error || "Invalid email or password" });
      setShakeKey((prev) => prev + 1);
      return;
    }

    setIsSuccess(true);
    setSuccessMessage(`Welcome back, ${result.user?.name || loginEmail.split("@")[0]}! Connecting to Pavilion...`);

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
    }, 1200);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShakeKey((prev) => prev + 1);
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
      setErrors({ signupEmail: result.error || "Failed to create account" });
      setShakeKey((prev) => prev + 1);
      return;
    }

    setIsSuccess(true);
    setSuccessMessage(`Atelier Account created for ${signupName}! Redirecting...`);

    setTimeout(() => {
      if (signupRole === "SELLER") {
        router.push("/seller/onboarding");
      } else {
        router.push("/buyer/dashboard");
      }
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotSent(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#0A0D14]">
      {/* 1. Animated Gradient Mesh & Floating Blurred Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient base radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

        {/* Floating Orb 1: Deep Indigo */}
        <motion.div
          animate={{
            x: [0, 45, -35, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.18, 0.92, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-indigo-600/25 blur-[120px]"
        />

        {/* Floating Orb 2: Warm Terracotta */}
        <motion.div
          animate={{
            x: [0, -40, 45, 0],
            y: [0, 60, -35, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-32 w-[440px] h-[440px] rounded-full bg-amber-600/20 blur-[130px]"
        />

        {/* Floating Orb 3: Craft Emerald / Teal */}
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -35, 50, 0],
            scale: [1, 1.12, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 left-1/4 w-[460px] h-[460px] rounded-full bg-teal-600/20 blur-[130px]"
        />

        {/* Floating Orb 4: Rose / Crimson */}
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 45, -45, 0],
            scale: [1, 1.22, 0.94, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-rose-600/15 blur-[110px]"
        />

        {/* Micro-dot subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* 2. Top Navigation Bar for Login Screen */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium backdrop-blur-md transition-all group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Pavilion</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30">
        <ThemeToggle variant="icon" />
      </div>

      {/* 3. Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl my-8 rounded-3xl border border-white/20 bg-white/[0.06] backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),inset_0_1px_1px_0_rgba(255,255,255,0.2)] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* LEFT COLUMN: Editorial Branding & Heritage Showcase */}
          <div className="relative lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent">
            {/* Top Branding */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-serif text-2xl tracking-[0.1em] text-white font-normal uppercase">
                  ARTISANLY
                </span>
              </div>

              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase text-amber-300 border border-amber-400/30 bg-amber-400/10 backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Sovereign Craft Ledger
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-tight">
                  Where Generational Mastery Meets Patrons Worldwide.
                </h1>
                <p className="text-xs text-white/70 leading-relaxed pt-1">
                  Connect directly with verified master artisans across India&apos;s ancestral craft terroirs. Direct fair-trade compensation, certified Geographical Indication (GI), and sovereign craft authentication.
                </p>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="py-6 space-y-3 hidden sm:block">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Authentic GI Certification</h4>
                  <p className="text-[11px] text-white/60">Every artifact backed by government craft verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xs">
                <Award className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Direct Guild Settlement</h4>
                  <p className="text-[11px] text-white/60">Fair-trade remuneration going straight to the maker&apos;s hands</p>
                </div>
              </div>
            </div>

            {/* Bottom Proof Metric */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                28 Craft Terroirs
              </span>
              <span>3,400+ Master Guilds</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Glassmorphism Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {isSuccess ? (
              /* Success State Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 px-4 text-center space-y-5"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-white">Authentication Successful</h3>
                  <p className="text-sm text-white/70 max-w-sm mx-auto">{successMessage}</p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/buyer/dashboard")}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
                  >
                    Open Collector Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/catalog")}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
                  >
                    Explore Masterpieces
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Form State Screen with Toggle */
              <div className="space-y-6">
                {/* Segmented Glass Pill Switcher */}
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center p-1 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md w-full max-w-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrors({});
                      }}
                      className={`relative z-10 flex-1 py-1.5 text-xs font-semibold text-center transition-colors cursor-pointer ${
                        mode === "login" ? "text-slate-900" : "text-white/60 hover:text-white"
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
                      className={`relative z-10 flex-1 py-1.5 text-xs font-semibold text-center transition-colors cursor-pointer ${
                        mode === "signup" ? "text-slate-900" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Create Account
                    </button>

                    {/* Sliding indicator pill */}
                    <motion.div
                      className="absolute inset-y-1 rounded-xl bg-white shadow-md"
                      layoutId="activeFormTab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{
                        width: "calc(50% - 4px)",
                        left: mode === "login" ? "4px" : "calc(50%)",
                      }}
                    />
                  </div>
                </div>

                {/* Form Content Animated Presence */}
                <motion.div
                  key={shakeKey}
                  animate={errors && Object.keys(errors).length > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <AnimatePresence mode="wait">
                    {mode === "login" ? (
                      /* ================= LOGIN FORM ================= */
                      <motion.form
                        key="login"
                        initial={{ opacity: 0, x: -22, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 22, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onSubmit={handleLoginSubmit}
                        className="space-y-4"
                        noValidate
                      >
                        <div className="space-y-1">
                          <h2 className="text-xl font-semibold text-white tracking-tight">
                            Collector Sign In
                          </h2>
                          <p className="text-xs text-white/60">
                            Enter your credentials to access your acquired art collection.
                          </p>
                        </div>

                        {/* Email Input */}
                        <FloatingInput
                          id="login-email"
                          type="email"
                          label="Email Address"
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                            if (errors.loginEmail) setErrors((prev) => ({ ...prev, loginEmail: "" }));
                          }}
                          error={errors.loginEmail}
                          icon={Mail}
                          autoComplete="email"
                          required
                        />

                        {/* Password Input */}
                        <FloatingInput
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          value={loginPassword}
                          onChange={(e) => {
                            setLoginPassword(e.target.value);
                            if (errors.loginPassword) setErrors((prev) => ({ ...prev, loginPassword: "" }));
                          }}
                          error={errors.loginPassword}
                          icon={Lock}
                          autoComplete="current-password"
                          required
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-white/50 hover:text-white transition-colors cursor-pointer"
                              tabIndex={-1}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <label className="flex items-center gap-2 text-white/70 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="sr-only"
                            />
                            <span
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                rememberMe
                                  ? "bg-amber-500 border-amber-400 text-slate-950"
                                  : "border-white/30 bg-white/5"
                              }`}
                            >
                              {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <span>Remember me</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setShowForgotModal(true)}
                            className="relative group text-amber-300/90 hover:text-amber-200 font-medium transition-colors cursor-pointer"
                          >
                            <span>Forgot Password?</span>
                            <span className="absolute left-0 bottom-0 w-0 h-px bg-amber-300 transition-all duration-300 group-hover:w-full" />
                          </button>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wide uppercase text-white bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.4)] transition-all cursor-pointer overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed group mt-2"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Authenticating...</span>
                              </>
                            ) : (
                              <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </span>
                          {/* Button shimmer reflection */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                        </motion.button>

                        {/* Switch to Signup */}
                        <div className="text-center text-xs text-white/60 pt-2">
                          Don&apos;t have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setMode("signup");
                              setErrors({});
                            }}
                            className="relative group font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer ml-1"
                          >
                            <span>Sign Up</span>
                            <span className="absolute left-0 bottom-0 w-0 h-px bg-amber-300 transition-all duration-300 group-hover:w-full" />
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      /* ================= SIGNUP FORM ================= */
                      <motion.form
                        key="signup"
                        initial={{ opacity: 0, x: 22, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -22, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onSubmit={handleSignupSubmit}
                        className="space-y-3.5"
                        noValidate
                      >
                        <div className="space-y-1">
                          <h2 className="text-xl font-semibold text-white tracking-tight">
                            Create Atelier Account
                          </h2>
                          <p className="text-xs text-white/60">
                            Join the sovereign network of patrons and generational craft guardians.
                          </p>
                        </div>

                        {/* Role Selector: Collector vs Master Artisan */}
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                          <button
                            type="button"
                            onClick={() => setSignupRole("BUYER")}
                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              signupRole === "BUYER"
                                ? "bg-amber-500 text-slate-950 font-semibold shadow-xs"
                                : "text-white/70 hover:text-white"
                            }`}
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>Collector (Buyer)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignupRole("SELLER")}
                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              signupRole === "SELLER"
                                ? "bg-amber-500 text-slate-950 font-semibold shadow-xs"
                                : "text-white/70 hover:text-white"
                            }`}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Master Artisan</span>
                          </button>
                        </div>

                        {/* Full Name */}
                        <FloatingInput
                          id="signup-name"
                          type="text"
                          label="Full Name"
                          value={signupName}
                          onChange={(e) => {
                            setSignupName(e.target.value);
                            if (errors.signupName) setErrors((prev) => ({ ...prev, signupName: "" }));
                          }}
                          error={errors.signupName}
                          icon={User}
                          autoComplete="name"
                          required
                        />

                        {/* Email */}
                        <FloatingInput
                          id="signup-email"
                          type="email"
                          label="Email Address"
                          value={signupEmail}
                          onChange={(e) => {
                            setSignupEmail(e.target.value);
                            if (errors.signupEmail) setErrors((prev) => ({ ...prev, signupEmail: "" }));
                          }}
                          error={errors.signupEmail}
                          icon={Mail}
                          autoComplete="email"
                          required
                        />

                        {/* Password */}
                        <FloatingInput
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          label="Password (min 8 chars)"
                          value={signupPassword}
                          onChange={(e) => {
                            setSignupPassword(e.target.value);
                            if (errors.signupPassword) setErrors((prev) => ({ ...prev, signupPassword: "" }));
                          }}
                          error={errors.signupPassword}
                          icon={Lock}
                          autoComplete="new-password"
                          required
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-white/50 hover:text-white transition-colors cursor-pointer"
                              tabIndex={-1}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />

                        {/* Password Strength Indicator Bar */}
                        {signupPassword && (
                          <div className="space-y-1.5 px-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-white/60">Password Strength:</span>
                              <span className={`font-semibold ${passwordStrength.text}`}>
                                {passwordStrength.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                              {[1, 2, 3, 4].map((step) => (
                                <motion.div
                                  key={step}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: step <= passwordStrength.score ? 1 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className={`h-full rounded-full ${
                                    step <= passwordStrength.score ? passwordStrength.color : "bg-transparent"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Confirm Password */}
                        <FloatingInput
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          label="Confirm Password"
                          value={signupConfirmPassword}
                          onChange={(e) => {
                            setSignupConfirmPassword(e.target.value);
                            if (errors.signupConfirmPassword)
                              setErrors((prev) => ({ ...prev, signupConfirmPassword: "" }));
                          }}
                          error={errors.signupConfirmPassword}
                          icon={Lock}
                          autoComplete="new-password"
                          required
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="text-white/50 hover:text-white transition-colors cursor-pointer"
                              tabIndex={-1}
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />

                        {/* Terms & Conditions Checkbox */}
                        <div>
                          <label className="flex items-start gap-2.5 text-xs text-white/70 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={agreeTerms}
                              onChange={(e) => {
                                setAgreeTerms(e.target.checked);
                                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: "" }));
                              }}
                              className="sr-only"
                            />
                            <span
                              className={`w-4 h-4 rounded-md border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                                agreeTerms
                                  ? "bg-amber-500 border-amber-400 text-slate-950"
                                  : "border-white/30 bg-white/5"
                              }`}
                            >
                              {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <span className="leading-tight">
                              I agree to the{" "}
                              <Link
                                href="/about"
                                className="text-amber-300 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/about"
                                className="text-amber-300 hover:underline underline-offset-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Fair Trade Privacy Policy
                              </Link>
                              .
                            </span>
                          </label>
                          {errors.agreeTerms && (
                            <p className="text-xs text-rose-400 mt-1 pl-1">{errors.agreeTerms}</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wide uppercase text-white bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.4)] transition-all cursor-pointer overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed group mt-2"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating Account...</span>
                              </>
                            ) : (
                              <>
                                <span>Create Account</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                        </motion.button>

                        {/* Switch to Login */}
                        <div className="text-center text-xs text-white/60 pt-2">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setMode("login");
                              setErrors({});
                            }}
                            className="relative group font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer ml-1"
                          >
                            <span>Sign In</span>
                            <span className="absolute left-0 bottom-0 w-0 h-px bg-amber-300 transition-all duration-300 group-hover:w-full" />
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4. Forgot Password Modal (Glassmorphism) */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-900/90 backdrop-blur-2xl shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="font-serif text-xl font-normal">Reset Password</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="text-white/60 hover:text-white text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {forgotSent ? (
                <div className="py-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-emerald-400/30 bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold">Verification Link Dispatched</h4>
                  <p className="text-xs text-white/70">
                    We have dispatched password recovery instructions to <span className="text-amber-300 font-medium">{forgotEmail}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs mt-3 cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-white/70">
                    Enter your collector email and our secure registry will send you a reset link.
                  </p>
                  <FloatingInput
                    id="forgot-email"
                    type="email"
                    label="Account Email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    icon={Mail}
                    required
                  />
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer"
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
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0D14] text-white">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
