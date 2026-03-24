import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // Pequeno delay para garantir que o cookie foi gravado pelo navegador
      const timer = setTimeout(() => {
        router.replace("/admin");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-creme">
        <div className="w-12 h-12 border-4 border-dourado/20 border-t-dourado rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Entrar — Silva Cílios</title>
        <meta name="description" content="Acesse o painel de gerenciamento Silva Cílios" />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FDF6EC 0%, #D5D3E8 50%, #FDF6EC 100%)",
        }}
      >
        {/* Decoração de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #DFC27A, transparent)" }} />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #B8B5D4, transparent)" }} />
        </div>

        <div className="relative w-full max-w-md mx-4 animate-fade-in">
          {/* Card de login */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-creme-escuro">
            {/* Header dourado */}
            <div
              className="px-8 py-8 text-center"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #A07830 100%)" }}
            >
              <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <img src="/logo.png" alt="Silva Cílios" className="w-full h-full object-contain rounded-full shadow-lg" />
              </div>
              <h1 className="font-cormorant text-3xl font-bold text-white leading-tight">Silva Cílios</h1>
              <p className="text-white/80 text-sm mt-1 font-inter">Painel de Gerenciamento</p>
            </div>

            {/* Login com Google (Único Método) */}
            <div className="px-8 py-12 flex flex-col items-center">
              <h2 className="font-cormorant text-2xl font-semibold text-marrom mb-8 text-center">
                Acesse seu Painel ✨
              </h2>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/admin" })}
                className="w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 border border-creme-escuro rounded-2xl bg-white text-marrom font-bold hover:bg-creme transition-all duration-300 active:scale-95 shadow-lg group"
              >
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Entrar com Google
              </button>

              <div className="mt-10 text-center">
                <Link href="/" className="text-sm font-semibold text-marrom-claro hover:text-dourado transition-colors duration-200">
                  ← Voltar ao site
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-marrom-claro text-xs mt-6">
            © 2024 Silva Cílios — Todos os direitos reservados
          </p>
        </div>
      </div>
    </>
  );
}
