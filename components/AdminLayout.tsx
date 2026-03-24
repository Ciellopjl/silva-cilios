import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Head from "next/head";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Sparkles, 
  LogOut, 
  ExternalLink,
  Sparkle,
  User,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
  titulo: string;
}

const navLinks = [
  { href: "/", label: "Página Inicial", icone: <ArrowLeft className="w-5 h-5" />, back: true },
  { href: "/admin", label: "Dashboard", icone: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/admin/agendamentos", label: "Agendamentos", icone: <Calendar className="w-5 h-5" /> },
  { href: "/admin/clientes", label: "Clientes", icone: <Users className="w-5 h-5" /> },
  { href: "/admin/servicos", label: "Serviços", icone: <Sparkle className="w-5 h-5" /> },
  { href: "/admin/equipe", label: "Equipe", icone: <User className="w-5 h-5" /> },
  { href: "/admin/galeria", label: "Galeria", icone: <Sparkles className="w-5 h-5" /> },
];

export default function AdminLayout({ children, titulo }: AdminLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSair = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <>
      <Head>
        <title>{titulo} — Silva Cílios</title>
      </Head>

      <div className="min-h-screen flex bg-creme relative overflow-x-hidden">
        {/* Backdrop para Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-marrom/60 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ background: "linear-gradient(180deg, #3D2B1F 0%, #6B4C3B 60%, #A07830 100%)" }}
        >
          {/* Container rolável */}
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar py-6 px-4">
            {/* Botão fechar (mobile) */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white md:hidden z-10"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Logo */}
            <div className="text-center mb-8 px-2">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-3">
                <img src="/logo.png" alt="Silva Cílios" className="w-full h-full object-contain rounded-full" />
              </div>
              <h1 className="font-cormorant text-2xl font-bold text-white">Silva Cílios</h1>
              <p className="text-creme/60 text-xs mt-1">Painel Administrativo</p>
            </div>

            {/* Separador dourado */}
            <div className="h-px bg-dourado/30 mb-6 flex-shrink-0" />

            {/* Navegação */}
            <nav className="flex-1 space-y-1">
              {navLinks.map((link) => {
                const ativo = router.pathname === link.href;
                return (
                  <div key={link.href}>
                    {link.back && <div className="h-px bg-white/10 my-4" />}
                    <Link
                      href={link.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={ativo ? "sidebar-link-ativo flex items-center gap-3" : "sidebar-link flex items-center gap-3"}
                    >
                      <span className="flex-shrink-0">{link.icone}</span>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                    {link.back && <div className="h-px bg-white/10 my-4" />}
                  </div>
                );
              })}
            </nav>

            {/* Separador dourado */}
            <div className="h-px bg-dourado/30 mb-4 mt-8 flex-shrink-0" />

            {/* Usuário logado */}
            {session?.user && (
              <div className="flex items-center gap-3 px-2 mb-6 flex-shrink-0">
                <div className="flex-shrink-0">
                  <UserAvatar user={session.user} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-creme/60 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Logado como</p>
                  <p className="text-white text-sm font-bold truncate leading-tight">{session.user.name}</p>
                  <p className="text-dourado-claro text-[10px] truncate opacity-80">{session.user.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleSair}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-creme/60 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200 font-medium w-full text-left flex-shrink-0 mb-8"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>

            {/* Desenvolvido por */}
            <div className="mt-auto pt-6 border-t border-white/10 text-center flex flex-col items-center gap-2">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-creme/50">Desenvolvido por</p>
              <a href="https://www.ajucode.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <img src="/logo ajucode.png" alt="ajucode" className="h-5 w-auto object-contain transition-transform group-hover:scale-105" />
              </a>
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 min-h-screen w-full">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-creme-escuro px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-creme rounded-xl text-marrom md:hidden flex-shrink-0"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <h2 className="font-cormorant text-lg md:text-2xl font-bold text-marrom truncate">{titulo}</h2>
            </div>
          </header>

          {/* Página */}
          <div className="p-4 md:p-8 w-full max-w-[100vw]">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

function UserAvatar({ user }: { user: any }) {
  const [error, setError] = useState(false);
  const iniciais = user.name ? user.name.charAt(0).toUpperCase() : "S";

  if (user.image && !error) {
    return (
      <img 
        src={user.image} 
        alt={user.name || "Avatar"} 
        onError={() => setError(true)}
        className="w-10 h-10 rounded-full border-2 border-dourado/50 shadow-sm object-cover"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-dourado/20 flex items-center justify-center text-white border-2 border-dourado/50 font-bold text-lg shadow-sm">
      {iniciais}
    </div>
  );
}
