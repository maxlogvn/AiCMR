"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  LogIn, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { LoginRequest } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type ErrorType = "invalid_credentials" | "network" | "server" | "unknown";

const getErrorType = (message: string): ErrorType => {
  if (message.includes("Invalid email or password")) return "invalid_credentials";
  if (message.includes("Network") || message.includes("fetch")) return "network";
  if (message.includes("500") || message.includes("server")) return "server";
  return "unknown";
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formError, setFormError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (error: unknown): string => {
    const fallback = "Đăng nhập thất bại. Vui lòng thử lại.";
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (typeof error === "object") {
      const anyError = error as {
        message?: unknown;
        response?: { data?: { detail?: unknown } };
      };
      const detail = anyError.response?.data?.detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        const msgs = detail
          .map((d) => (d && typeof d === "object" ? (d as { msg?: unknown }).msg : null))
          .filter((m): m is string => typeof m === "string");
        if (msgs.length > 0) return msgs.join("\n");
      }
      if (detail != null) {
        try {
          return JSON.stringify(detail);
        } catch {
          return String(detail);
        }
      }
      if (typeof anyError.message === "string") return anyError.message;
    }
    return fallback;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

   const onSubmit = async (data: LoginRequest) => {
     try {
       setFormError(null);
       setErrorType(null);
       setIsLoading(true);
       console.log("[LoginPage] Submitting login form for:", data.email);
       
       await login(data);
       console.log("[LoginPage] Login succeeded, showing success toast");
       showSuccess("✓ Đăng nhập thành công! Đang chuyển hướng...");

       // ✅ NEW: Invalidate user cache on new login to fetch fresh user data
       // This ensures we don't show old user's data from React Query cache
       const { useQueryClient } = await import("@tanstack/react-query");
       // Note: Can't use queryClient hook here, but localStorage change will trigger it
       
       // Fetch user info với retry logic
       let retries = 0;
       const maxRetries = 3;
       let user = null;

       while (retries < maxRetries && !user) {
         try {
           const response = await fetch("/backend/api/v1/users/me", {
             headers: {
               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
             },
           });

           if (response.ok) {
             user = await response.json();
             break;
           } else if (response.status === 401) {
             console.warn("[LoginPage] User fetch 401, retrying...");
             retries++;
             await new Promise(resolve => setTimeout(resolve, 500));
           } else {
             console.error("[LoginPage] User fetch failed with status:", response.status);
             break;
           }
         } catch (fetchError) {
           console.error("[LoginPage] User fetch error:", fetchError);
           retries++;
           if (retries < maxRetries) {
             await new Promise(resolve => setTimeout(resolve, 500));
           }
         }
       }

       if (user && user.rank >= 3) {
         console.log("[LoginPage] User has admin rank, redirecting to dashboard");
         router.push("/dashboard/stats");
       } else {
         console.log("[LoginPage] User is regular user, redirecting to home");
         router.push("/");
       }
     } catch (error) {
       console.error("[LoginPage] Login error:", error);
       const message = getErrorMessage(error);
       const type = getErrorType(message);
       setFormError(message);
       setErrorType(type);
       console.log("[LoginPage] Showing error toast with message:", message);
       showError(message, 8000);
       setIsLoading(false);
     }
   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-500/20 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto mb-4 shadow-lg">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Đăng nhập
          </h1>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
            Hệ thống quản lý hồ sơ y tế AiCMR
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Error Alert */}
          {formError && (
            <div className={`animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-lg border-l-4 flex gap-3 ${
              errorType === "invalid_credentials" 
                ? "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-700 dark:text-red-200"
                : errorType === "network"
                ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500 text-yellow-700 dark:text-yellow-200"
                : errorType === "server"
                ? "bg-orange-50 dark:bg-orange-950/30 border-orange-500 text-orange-700 dark:text-orange-200"
                : "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-700 dark:text-red-200"
            }`}>
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  {errorType === "invalid_credentials" && "Email hoặc mật khẩu không đúng"}
                  {errorType === "network" && "Lỗi kết nối mạng"}
                  {errorType === "server" && "Lỗi máy chủ"}
                  {!errorType && "Đăng nhập thất bại"}
                </h3>
                <p className="text-sm opacity-90 whitespace-pre-wrap">{formError}</p>
                {errorType === "invalid_credentials" && (
                  <p className="text-xs opacity-75 mt-2">
                    Vui lòng kiểm tra email và mật khẩu của bạn. Nếu bạn quên mật khẩu, <a href="/forgot-password" className="underline hover:opacity-100">click vào đây</a>.
                  </p>
                )}
                {errorType === "network" && (
                  <p className="text-xs opacity-75 mt-2">
                    Kiểm tra kết nối internet của bạn và thử lại.
                  </p>
                )}
                {errorType === "server" && (
                  <p className="text-xs opacity-75 mt-2">
                    Máy chủ đang gặp sự cố. Vui lòng thử lại trong vài phút.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="your.email@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 focus:outline-none font-body ${
                  errors.email
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
                    : "border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/30"
                } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <span className="text-red-500">!</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-2.5 rounded-lg border-2 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 focus:outline-none font-body ${
                  errors.password
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
                    : "border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/30"
                } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <span className="text-red-500">!</span>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-6 ${
              isSubmitting || isLoading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl active:scale-95"
            }`}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                Đăng nhập
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
                hoặc
              </span>
            </div>
          </div>

          {/* Auth Links */}
          <div className="space-y-3">
            <a
              href="/register"
              className="block w-full py-2.5 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-center transition-all duration-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
            >
              Tạo tài khoản mới
            </a>
            <a
              href="/forgot-password"
              className="block text-sm text-center text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-1"
            >
              Quên mật khẩu?
            </a>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>🔒 Hệ thống bảo mật. Thông tin của bạn được mã hóa.</p>
        </div>
      </div>
    </div>
  );
}
