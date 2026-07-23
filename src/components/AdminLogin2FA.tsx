import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Key,
  User,
  ArrowRight,
  Smartphone,
  RefreshCw,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Logo from "./Logo";

interface AdminLogin2FAProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export default function AdminLogin2FA({
  onLoginSuccess,
  onBackToStore,
}: AdminLogin2FAProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("elizabethgallery123");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"CREDENTIALS" | "2FA">("CREDENTIALS");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Simulated 2FA dynamic code generation rotating every 30 seconds
  const [current2FACode, setCurrent2FACode] = useState("583912");
  const [timerProgress, setTimerProgress] = useState(100);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (step !== "2FA") return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Generate new 6 digit code
          const newCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          setCurrent2FACode(newCode);
          setTimerProgress(100);
          return 30;
        }
        const nextSeconds = prev - 1;
        setTimerProgress((nextSeconds / 30) * 100);
        return nextSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Handle Login Credentials (Direct login without 2FA requirement)
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.trim() === "admin" && password === "elizabethgallery123") {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 600);
    } else {
      setError(
        "Kredensial salah! Gunakan username: admin dan password: elizabethgallery123",
      );
    }
  };

  // Handle second stage: 2FA Verification code entry
  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if the entered code matches the current simulated 2FA code
    if (totpCode.replace(/\s+/g, "") === current2FACode) {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } else {
      setError(
        "Kode 2FA salah atau telah kedaluwarsa! Silakan periksa Authenticator Simulator di samping.",
      );
    }
  };

  const autofill2FACode = () => {
    setTotpCode(current2FACode);
    setError("");
  };

  const handleQuickDemoFill = () => {
    setUsername("admin");
    setPassword("elizabethgallery123");
    setError("");
  };

  return (
    <div
      className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden"
      id="admin-login-screen"
    >
      {/* Absolute Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-indigo-900/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-amber-900/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto max-h-[92vh] overflow-y-auto">
        {/* Left Side: Brand presentation (Compact on mobile) */}
        <div className="md:w-1/2 bg-[#0B132B] p-4 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 text-center space-y-2 sm:space-y-4 shrink-0">
          <Logo size="lg" showDetails={false} />
          <div className="space-y-1">
            <h3 className="text-amber-400 font-serif text-base sm:text-xl italic font-bold">
              Portal Administrasi Toko
            </h3>
            <p className="text-xs text-slate-400 px-2 sm:px-6 max-w-xs mx-auto leading-relaxed hidden sm:block">
              Selamat datang di sistem manajemen penjualan Elizabeth Signature
              Gallery.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToStore}
            className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 px-3 py-1.5 sm:py-2.5 rounded-xl transition duration-200 mt-1 sm:mt-4 cursor-pointer min-h-[40px] sm:min-h-[44px] flex items-center justify-center active:scale-95"
          >
            ← Kembali ke Toko Bunga
          </button>
        </div>

        {/* Right Side: Step forms */}
        <div className="md:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-slate-900 text-white shrink-0">
          {step === "CREDENTIALS" ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldAlert size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Akses Terproteksi
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
                  Login Administrator
                </h2>
                <p className="text-xs text-slate-400">
                  Masukkan akun admin Elizabeth Signature Anda.
                </p>
              </div>

              <form
                onSubmit={handleCredentialsSubmit}
                className="space-y-3.5 sm:space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-3.5 text-slate-500"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 min-h-[48px]"
                      placeholder="Username admin"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3.5 top-3.5 text-slate-500"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-200 min-h-[48px]"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 min-h-[40px] flex items-center px-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-800/60 p-3 rounded-xl text-xs text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-950/50 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-400 flex items-center gap-2 animate-fade-in">
                    <CheckCircle size={16} />
                    <span>Login Berhasil! Memuat Dashboard Admin...</span>
                  </div>
                )}

                {/* Helper info block for demo with Quick 1-Tap Fill Button */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-500 space-y-2 leading-normal flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      💡 Akun Demo:
                    </p>
                    <p className="text-slate-300">
                      Username: <strong>admin</strong> | Password:{" "}
                      <strong>elizabethgallery123</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="shrink-0 bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 text-[11px] font-bold py-1.5 px-2.5 rounded-lg cursor-pointer transition active:scale-95"
                  >
                    ⚡ Isi Otomatis
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={success}
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4 min-h-[48px] touch-manipulation"
                >
                  <span>Masuk ke Dashboard Admin</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-teal-400">
                  <Smartphone size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Lapis Keamanan Kedua
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-serif tracking-tight text-white">
                  Verifikasi Otentikasi 2FA
                </h2>
                <p className="text-xs text-slate-400">
                  Masukkan 6 digit kode keamanan dari aplikasi authenticator
                  Anda.
                </p>
              </div>

              {/* Two-Factor verification inputs and Simulator Widget */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Form input - 7 cols */}
                <form
                  onSubmit={handle2FASubmit}
                  className="sm:col-span-7 space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Kode Keamanan 6-Digit
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) =>
                        setTotpCode(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-2xl font-mono font-extrabold tracking-widest focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-amber-400 placeholder:text-slate-800"
                      placeholder="000000"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-950">
                      {error}
                    </p>
                  )}

                  {success && (
                    <div className="bg-emerald-950/50 border border-emerald-800 p-3 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                      <CheckCircle size={14} />
                      <span>Verifikasi Berhasil! Memuat Dashboard...</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("CREDENTIALS")}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 px-3 rounded-xl transition min-h-[44px] cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={success}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-extrabold py-3 px-3 rounded-xl transition cursor-pointer min-h-[44px]"
                    >
                      Verifikasi & Masuk
                    </button>
                  </div>
                </form>

                {/* 2FA Simulator Widget - 5 cols */}
                <div className="sm:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                      Authenticator Simulation
                    </span>
                    <button
                      type="button"
                      onClick={autofill2FACode}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg cursor-pointer min-h-[36px] flex items-center gap-1"
                      title="Auto-fill kode dari simulator"
                    >
                      ⚡ Isi Otomatis
                    </button>
                  </div>

                  {/* 2FA Display */}
                  <div className="text-center space-y-1.5">
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Elizabeth Admin OTP Key
                    </p>
                    <div
                      onClick={autofill2FACode}
                      className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl py-2.5 cursor-pointer transition active:scale-95 flex flex-col items-center justify-center group"
                      title="Ketuk untuk isi otomatis di HP"
                    >
                      <span className="text-2xl font-mono font-extrabold text-teal-400 tracking-wider group-hover:text-amber-400 transition">
                        {current2FACode.slice(0, 3)} {current2FACode.slice(3)}
                      </span>
                      <span className="text-[9px] text-slate-500 group-hover:text-amber-400/80 font-sans mt-0.5">
                        (Ketuk untuk Salin / Isi Otomatis)
                      </span>
                    </div>

                    {/* Progress Loader Bar */}
                    <div className="space-y-1 text-right">
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${timerProgress}%` }}
                          className="h-full bg-teal-400 transition-all duration-1000 ease-linear"
                        ></div>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        Kode berputar dalam {secondsLeft}s
                      </span>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 leading-normal">
                    *Simulator ini merepresentasikan integrasi Google/Microsoft
                    Authenticator MFA untuk melindungi halaman admin Anda secara
                    maksimal.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
