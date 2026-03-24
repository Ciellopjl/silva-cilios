import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BookingStepper from "@/components/booking/BookingStepper";
import { Sparkles, Calendar, Instagram, ArrowRight, CheckCircle2, X, Menu, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home({ servicosIniciais }: { servicosIniciais: any[] }) {
  const { data: session } = useSession();
  const [servicos, setServicos] = useState<any[]>(servicosIniciais || []);
  const [loading, setLoading] = useState(!servicosIniciais);
  const [selectedServico, setSelectedServico] = useState<{ id: string; nome: string } | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!servicosIniciais) {
      fetch("/api/servicos")
        .then(res => res.json())
        .then(data => {
          setServicos(data);
          setLoading(false);
        });
    }
  }, [servicosIniciais]);

  const handleAgendar = (servico: any) => {
    setSelectedServico({ id: servico.id, nome: servico.nome });
  };

  return (
    <div className="min-h-screen bg-creme selection:bg-dourado/30 overflow-x-hidden">
      <Head>
        <title>Silva Cílios | Especialista em Extensão e Estética do Olhar</title>
        <meta name="description" content="Especialista em extensão de cílios, lash lifting e design de sobrancelhas em um ambiente luxuoso e confortável." />
      </Head>

      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-creme/90 md:bg-creme/90 backdrop-blur-md border-b border-creme-escuro/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Silva Cílios" className="h-10 md:h-16 w-auto object-contain rounded-full shadow-sm" />
            <span className="font-cormorant text-xl md:text-3xl font-bold text-marrom tracking-tight leading-none bg-gradient-to-r from-marrom to-marrom-claro bg-clip-text">Silva Cílios</span>
          </div>
          <div className="flex items-center gap-3 md:gap-10">
             <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-marrom-claro">
                <a href="#servicos" className="hover:text-dourado transition-colors">Serviços</a>
                <a href="#galeria" className="hover:text-dourado transition-colors">Galeria</a>
                <a href="#sobre" className="hover:text-dourado transition-colors">Sobre</a>
                {session && (
                  <Link href="/admin" className="flex items-center gap-2 text-dourado hover:text-dourado-escuro transition-colors border-l border-creme-escuro pl-6">
                    <LayoutDashboard className="w-4 h-4" />
                    Painel Admin
                  </Link>
                )}
             </div>
            <a href="#servicos" className="btn-dourado !py-1.5 !px-4 !text-xs md:!text-sm">
              Agendar
            </a>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-marrom p-1 hover:bg-marrom/5 rounded-lg transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[9998] bg-marrom/60 backdrop-blur-sm md:hidden"
            />
            
            {/* Drawer Lateral - Sólido e 70% */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[9999] w-[70%] bg-[#FDF6EC] shadow-2xl flex flex-col p-8 md:hidden"
              style={{ backgroundColor: '#FDF6EC', opacity: 1 }} // Garantia total de solidez
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-cormorant text-xl font-bold text-marrom uppercase tracking-widest">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 bg-marrom/5 rounded-full text-marrom"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6 flex-1">
                {[
                  { name: "Início", href: "#" },
                  { name: "Serviços", href: "#servicos" },
                  { name: "Galeria", href: "#galeria" },
                  { name: "Sobre", href: "#sobre" },
                ].map((item, i) => (
                  <motion.a 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="font-cormorant text-3xl font-bold text-marrom hover:text-dourado transition-colors"
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                {session ? (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-6 flex items-center gap-3 text-marrom-claro font-bold uppercase tracking-widest text-[10px] hover:text-dourado transition-colors"
                  >
                    <span className="w-8 h-8 bg-dourado/10 rounded-full flex items-center justify-center text-xs">📊</span>
                    Ir para o Painel
                  </Link>
                ) : (
                  <Link 
                    href="/auth/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-6 flex items-center gap-3 text-marrom-claro font-bold uppercase tracking-widest text-[10px] hover:text-dourado transition-colors"
                  >
                    <span className="w-8 h-8 bg-marrom/5 rounded-full flex items-center justify-center text-xs">🔐</span>
                    Entrar como Admin
                  </Link>
                )}
              </div>

              <div className="mt-auto border-t border-creme-escuro pt-8 pb-4">
                <div className="flex gap-6">
                  <a href="https://www.instagram.com/silva_clios6/" target="_blank" className="text-marrom-claro hover:text-dourado">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="https://wa.me/5582981910063" target="_blank" className="text-marrom-claro hover:text-dourado">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section Redesenhado (Premium & Imersivo) */}
      <header className="relative min-h-[90vh] md:min-h-0 md:pt-56 md:pb-40 flex items-center overflow-hidden bg-creme">
        {/* Imagem de Fundo (Mobile Only) */}
        <div className="absolute inset-0 z-0 md:hidden overflow-hidden">
          <div className="absolute inset-0 bg-marrom/40 z-10" />
          <img 
            src="/hero-premium.png" 
            alt="Silva Cílios Hero" 
            className="w-full h-full object-cover scale-110 blur-[1px]" 
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-16 relative z-20">
          {/* Texto à Esquerda / Centralizado Mobile */}
          <div className="flex-1 text-center md:text-left py-20 md:py-0">
            <span className="md:hidden text-dourado-claro font-bold text-[10px] uppercase tracking-[0.4em] mb-6 block drop-shadow-md">Especialista em Olhares</span>
            <h1 className="font-cormorant text-3xl sm:text-5xl md:text-9xl font-bold text-white md:text-marrom leading-[1.1] md:leading-[1] mb-8 tracking-tight md:tracking-tighter drop-shadow-lg md:drop-shadow-none">
              Olhar marcante <br className="hidden md:block" />
              com <span className="text-dourado-claro md:text-dourado text-premium-italic px-1">tufinhos</span> <br className="md:hidden" /> perfeitos.
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-creme md:text-marrom-claro text-sm md:text-2xl font-medium leading-relaxed mb-12 opacity-90 md:opacity-80 drop-shadow-md md:drop-shadow-none">
              Extensão de cílios com acabamento natural <br className="hidden md:block" /> e duradouro. Elevando sua autoestima.
            </p>
            <div className="flex justify-center md:justify-start">
              <a href="#servicos" className="btn-dourado !px-12 !py-5 text-xl shadow-dourado-lg active:scale-95 transition-all w-full md:w-auto">
                <Calendar className="w-7 h-7" /> Agendar agora
              </a>
            </div>
          </div>

          {/* Imagem à Direita (Desktop Only) */}
          <div className="flex-1 relative w-full h-[700px] hidden md:block">
             <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-creme to-transparent z-10" />
             <img 
               src="/hero-premium.png" 
               alt="Silva Cílios Hero" 
               className="w-full h-full object-cover rounded-l-[8rem] shadow-elegante"
               loading="eager"
               fetchPriority="high"
             />
          </div>
        </div>
      </header>

      {/* Seção de Serviços Premium */}
      <section id="servicos" className="py-32 bg-creme relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-dourado font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Nossos Procedimentos</span>
            <h2 className="heading-silva mb-6">Escolha sua Transformação</h2>
            <div className="w-24 h-1 bg-dourado/20 mx-auto rounded-full mb-8" />
            <p className="text-marrom-claro max-w-2xl mx-auto text-lg md:text-xl opacity-80">Técnicas modernas e personalizadas para realçar a beleza única do seu olhar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-[450px] bg-creme rounded-[3rem] animate-pulse" />)
            ) : (
              servicos.map((s, i) => (
                <div key={s.id} className="group bg-creme rounded-[4rem] border border-creme-escuro/50 shadow-sm hover:shadow-elegante transition-all duration-700 flex flex-col overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  {/* Imagem do Serviço */}
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={s.fotoUrl || "https://images.unsplash.com/photo-1512496015851-a90fb38ba496?q=80&w=800&auto=format&fit=crop"} 
                      alt={s.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
                      <span className="text-xs font-bold text-marrom uppercase tracking-widest">{s.duracaoMin} min</span>
                    </div>
                  </div>

                  {/* Conteúdo do Serviço */}
                  <div className="p-8 md:p-10 flex-1 flex flex-col">
                    <h3 className="font-cormorant text-4xl font-bold text-marrom mb-4 tracking-tight">{s.nome}</h3>
                    <p className="text-marrom-claro text-base leading-relaxed mb-8 flex-1 opacity-70">
                      {s.descricao || "A nossa especialidade: aplicação impecável para um olhar realçado e com naturalidade perfeita."}
                    </p>
                    
                    {/* Divisor Elegante */}
                    <div className="flex items-center gap-4 mb-8 opacity-20">
                      <div className="h-px bg-marrom-claro flex-1" />
                      <Sparkles className="w-4 h-4 text-dourado" />
                      <div className="h-px bg-marrom-claro flex-1" />
                    </div>

                    <div className="flex items-center justify-between mb-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-marrom-claro uppercase font-black tracking-widest mb-1">A partir de</span>
                        <span className="text-3xl font-bold text-dourado font-cormorant">R$ {s.preco.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAgendar(s)}
                      className="btn-dourado !rounded-3xl w-full"
                    >
                      Agendar Agora <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal de Agendamento (Embutido) */}
      <AnimatePresence>
        {selectedServico && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-6 overflow-hidden">
            {/* Overlay com Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedServico(undefined)}
              className="absolute inset-0 bg-marrom/60 backdrop-blur-sm hidden md:block"
            />
            
            {/* Stepper Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: "100%" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] relative z-10"
            >
              <BookingStepper 
                initialServico={selectedServico} 
                onResetServico={() => setSelectedServico(undefined)}
                onClose={() => setSelectedServico(undefined)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Galeria de Trabalhos Realizados */}
      <section id="galeria" className="py-32 bg-creme relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-dourado font-bold text-sm uppercase tracking-[0.3em] mb-4 block">Portfólio Silva Cílios</span>
            <h2 className="heading-silva mb-6">Resultados que Encantam</h2>
            <div className="w-24 h-1 bg-dourado/20 mx-auto rounded-full mb-8" />
            <p className="text-marrom-claro max-w-2xl mx-auto text-lg md:text-xl opacity-80">Confira alguns dos trabalhos realizados em nosso estúdio e veja a transformação no olhar de nossas clientes.</p>
          </div>

          <GaleriaDinamica />
        </div>
      </section>

      {/* Sobre a Silva Cílios */}
      <section id="sobre" className="py-32 bg-creme overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 relative animate-fade-in">
            <div className="relative z-10 w-full aspect-[4/5] rounded-[5rem] overflow-hidden shadow-elegante bg-dourado/5 border-[12px] border-creme-escuro/30">
              <div className="absolute inset-0 bg-silva-gradient flex items-center justify-center">
                 <span className="font-cormorant text-dourado text-6xl italic opacity-40">Silva Cílios</span>
              </div>
              <img src="/logo.png" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 opacity-10 grayscale brightness-200" />
            </div>
            {/* Detalhe Decorativo */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-dourado/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-lavanda/5 rounded-full blur-3xl -z-10" />
          </div>
          <div className="flex-1 animate-slide-up">
            <span className="text-dourado font-bold text-sm uppercase tracking-[0.3em] mb-6 block">Especialista Certificada</span>
            <h2 className="heading-silva mb-8 leading-[1.2]">O olhar que você sempre sonhou, com cuidado e excelência.</h2>
            <p className="text-marrom-claro text-xl mb-10 leading-relaxed opacity-80">
              No <strong>Silva Cílios</strong>, cada detalhe é pensado para proporcionar uma experiência única. Com foco no conforto e na excelência, unimos técnicas avançadas e materiais de altíssima qualidade para garantir um resultado impecável e duradouro no seu olhar.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {["Materiais antialergênicos premium", "Experiência confortável e segura", "Técnicas modernas e exclusivas", "Atendimento personalizado"].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-marrom font-semibold text-sm">
                  <span className="flex-shrink-0 w-8 h-8 bg-dourado text-white rounded-full flex items-center justify-center shadow-dourado">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="https://wa.me/5582981910063" target="_blank" className="btn-dourado inline-flex">
              Saiba Mais Sobre Nós
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer id="contato" className="bg-marrom pt-20 pb-10 text-creme/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">🌸</span>
                <span className="font-cormorant text-3xl font-bold text-white tracking-tight">Silva Cílios</span>
             </div>
             <p className="max-w-sm mb-6">
               Transformando olhares e elevando a autoestima com elegância e profissionalismo. Venha viver a experiência Silva Cílios.
             </p>
              <div className="flex gap-6">
                 {/* Redes Sociais Minimalistas */}
                 <motion.a 
                    href="https://www.instagram.com/silva_clios6/" 
                    target="_blank" 
                    className="w-12 h-12 rounded-full border border-creme/20 flex items-center justify-center text-creme/80 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, borderColor: "rgba(253, 246, 236, 0.6)" }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 >
                    <Instagram className="w-5 h-5 stroke-[1.5px]" />
                 </motion.a>
                 <motion.a 
                    href="https://wa.me/5582981910063" 
                    target="_blank" 
                    className="w-12 h-12 rounded-full border border-creme/20 flex items-center justify-center text-creme/80 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, borderColor: "rgba(253, 246, 236, 0.6)" }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                 </motion.a>
              </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 font-cormorant text-xl">Links Rápidos</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-dourado transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-dourado transition-colors">Serviços</a></li>
              <li><a href="#sobre" className="hover:text-dourado transition-colors">Sobre</a></li>
              <li><Link href="/auth/login" className="hover:text-dourado transition-colors">Entrar como Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 font-bold mb-4 font-cormorant text-lg uppercase tracking-wider">Atendimento</h4>
            <p className="text-xs leading-relaxed opacity-70">
              Lagoa de Pedra — Pão de Açúcar, AL<br />
              <span className="italic">Atendimento em domicílio ou local</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-creme/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-widest uppercase font-medium opacity-60">© 2024 Silva Cílios — Todos os direitos reservados</p>
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">Desenvolvido por</span>
            <a href="https://www.ajucode.com.br/" target="_blank" rel="noopener noreferrer" className="group">
              <img src="/logo ajucode.png" alt="ajucode" className="h-5 w-auto transition-transform group-hover:scale-105" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GaleriaDinamica() {
  const [fotos, setFotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/galeria")
      .then(res => res.json())
      .then(data => {
        setFotos(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-creme-escuro/50 rounded-[3rem]" />)}
    </div>
  );

  if (fotos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
      {fotos.map((f, i) => (
        <div key={f.id} className={`group relative aspect-square rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-elegante ${i % 2 === 0 ? 'md:translate-y-12' : ''}`}>
          <img 
            src={f.fotoUrl} 
            alt={f.titulo || "Trabalho Silva Cílios"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-marrom/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
            <span className="text-white font-bold text-sm tracking-wide uppercase">{f.titulo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);

    // Busca serviços diretamente do banco para evitar delay de fetch no client
    const servicos = await prisma.servico.findMany({
      where: { ativo: true }
    });

    return {
      props: {
        session: session ? JSON.parse(JSON.stringify(session)) : null,
        servicosIniciais: JSON.parse(JSON.stringify(servicos)),
      },
    };
  } catch (error) {
    console.error("Erro no SSR:", error);
    return {
      props: {
        session: null,
        servicosIniciais: [],
      },
    };
  }
};
