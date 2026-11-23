import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import PilihPortal from "@/components/auth/PilihPortal";
import { PERAN, resolvePeran } from "@/lib/peran";
import { safeReturnTo, parameterHalaman, bukaHalaman } from "@/lib/authReturnTo";

// Portal bisa ditentukan lewat tautan: /login?peran=kasir
const portalAwal = () => {
  const kunci = parameterHalaman().get("peran");
  return PERAN[kunci] ? kunci : null;
};

export default function Login() {
  const [portal, setPortal] = useState(portalAwal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  const tautanDaftar =
    "/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "");
  const info = portal ? PERAN[portal] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.loginViaEmailPassword(email, password);
      const akun = await api.auth.me();
      const peranAkun = resolvePeran(akun);
      if (portal && peranAkun !== portal) {
        await api.auth.logout();
        setError(
          `Akun ini terdaftar sebagai ${PERAN[peranAkun].label}. Silakan masuk lewat portal ${PERAN[peranAkun].singkat}, atau minta pemilik salon mengubah peran akun Anda.`
        );
        return;
      }
      bukaHalaman(returnTo);
    } catch (err) {
      setError(err.message || "Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await api.auth.loginWithProvider("google", returnTo);
    } catch (err) {
      setError(err.message || "Masuk dengan Google tidak tersedia.");
    }
  };

  const footer = (
    <>
      Belum punya akun?{" "}
      <Link to={tautanDaftar} className="text-primary font-medium hover:underline">
        Daftar di sini
      </Link>
    </>
  );

  if (!portal) {
    return (
      <AuthLayout
        icon={LogIn}
        title="Masuk ke Liana Salon"
        subtitle="Pilih portal sesuai peran akun Anda"
        footer={footer}
      >
        <PilihPortal
          onPilih={(kunci) => {
            setError("");
            setPortal(kunci);
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={LogIn}
      title={`Portal ${info.singkat}`}
      subtitle={info.deskripsi}
      footer={footer}
    >
      <button
        type="button"
        onClick={() => {
          setError("");
          setPortal(null);
        }}
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Pilih portal lain
      </button>

      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Lanjut dengan Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">atau</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Kata sandi</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Lupa kata sandi?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-12 font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            `Masuk sebagai ${info.singkat}`
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}