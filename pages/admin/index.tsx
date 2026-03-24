import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { 
  Calendar, 
  ClipboardList, 
  Users, 
  Sparkle, 
  Plus, 
  Sparkles, 
  User,
  ArrowRight
} from "lucide-react";

interface DashboardProps {
  totalAgendamentos: number;
  agendamentosHoje: number;
  totalClientes: number;
  proximosAgendamentos: {
    id: string;
    nomeCliente: string;
    servico: string;
    dataHora: string;
    status: string;
  }[];
}

export default function Dashboard({
  totalAgendamentos,
  agendamentosHoje,
  totalClientes,
  proximosAgendamentos,
}: DashboardProps) {
  const cards = [
    { titulo: "Agendamentos Hoje", valor: agendamentosHoje, icone: <Calendar className="w-8 h-8 md:w-10 md:h-10" />, cor: "from-dourado to-dourado-escuro" },
    { titulo: "Total de Agendamentos", valor: totalAgendamentos, icone: <ClipboardList className="w-8 h-8 md:w-10 md:h-10" />, cor: "from-lavanda-escuro to-lavanda" },
    { titulo: "Clientes Únicos", valor: totalClientes, icone: <Users className="w-8 h-8 md:w-10 md:h-10" />, cor: "from-marrom-claro to-marrom" },
  ];

  const statusLabel: Record<string, string> = {
    pendente: "Pendente",
    confirmado: "Confirmado",
    cancelado: "Cancelado",
    concluido: "Concluído",
  };

  return (
    <AdminLayout titulo="Dashboard">
      {/* Cards de resumo - Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
        {cards.map((card) => (
          <div
            key={card.titulo}
            className={`bg-gradient-to-br ${card.cor} rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl transform transition-transform hover:scale-[1.02] active:scale-95`}
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <span className="text-3xl md:text-5xl bg-white/20 p-3 md:p-4 rounded-2xl md:rounded-3xl backdrop-blur-sm">{card.icone}</span>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-ping" />
            </div>
            <p className="text-white/70 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{card.titulo}</p>
            <p className="font-cormorant text-4xl md:text-6xl font-bold mt-1 md:mt-2 leading-none">{card.valor}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Próximos agendamentos - Destaque */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-cormorant text-2xl md:text-3xl font-bold text-marrom">Próximos Agendamentos</h2>
            <Link href="/admin/agendamentos" className="text-marrom-claro text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-dourado transition-colors flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>

          <div className="card-elegante !p-0 overflow-hidden !border-none !shadow-none bg-transparent">
            {proximosAgendamentos.length === 0 ? (
              <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-16 text-center shadow-lg border border-creme-escuro">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-creme rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                   <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-dourado/40" />
                </div>
                <p className="font-cormorant text-xl md:text-2xl font-semibold text-marrom">Sua agenda está livre por enquanto</p>
                <Link href="/admin/agendamentos" className="btn-dourado inline-block mt-6 md:mt-8 !px-8 md:!px-10 !py-3 md:!py-4 rounded-xl md:rounded-2xl shadow-dourado transform active:scale-95">
                  Novo Agendamento
                </Link>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {proximosAgendamentos.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-white rounded-2xl md:rounded-[2rem] border border-creme-escuro hover:border-dourado/40 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-0">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-creme-escuro/20 flex items-center justify-center border border-white group-hover:bg-dourado/10 transition-colors">
                        <Sparkle className="w-5 h-5 md:w-6 md:h-6 text-dourado" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-marrom text-base md:text-lg leading-tight truncate">{ag.nomeCliente}</p>
                        <p className="text-marrom-claro text-[9px] md:text-xs font-black uppercase tracking-widest mt-0.5 opacity-60 truncate">{ag.servico}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 bg-creme/20 sm:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-creme-escuro/30 sm:border-none">
                      <div className="text-left sm:text-right">
                        <p className="text-marrom text-xs md:text-sm font-bold">
                          {new Date(ag.dataHora).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-marrom-claro text-[10px] md:text-xs font-medium">
                          {new Date(ag.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className={`badge-${ag.status} !px-3 md:!px-4 !py-1 !text-[8px] md:!text-[9px] font-black uppercase tracking-widest`}>
                        {statusLabel[ag.status] || ag.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Atalhos rápidos - Lateral/Abaixo */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="font-cormorant text-xl md:text-2xl font-bold text-marrom px-2">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { href: "/admin/agendamentos", label: "Novo Agendamento", icone: <Plus className="w-6 h-6 md:w-8 md:h-8" /> },
              { href: "/admin/agendamentos", label: "Calendário", icone: <Calendar className="w-6 h-6 md:w-8 md:h-8" /> },
              { href: "/admin/clientes", label: "Clientes", icone: <Users className="w-6 h-6 md:w-8 md:h-8" /> },
              { href: "/admin/servicos", label: "Serviços", icone: <Sparkle className="w-6 h-6 md:w-8 md:h-8" /> },
            ].map((atalho) => (
              <Link
                key={atalho.label}
                href={atalho.href}
                className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-center border border-creme-escuro hover:border-dourado/40 hover:shadow-lg transition-all flex flex-col items-center gap-2 md:gap-3 transform active:scale-95"
              >
                <span className="bg-creme/50 p-2 md:p-3 rounded-xl md:rounded-2xl text-dourado">{atalho.icone}</span>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-marrom leading-tight">{atalho.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth/login", permanent: false } };
  }

  const agora = new Date();
  const inicioDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const fimDia = new Date(inicioDia.getTime() + 24 * 60 * 60 * 1000);

  const [totalAgendamentos, agendamentosHojeLista, totalClientesAgregado, proximosAgendamentos] =
    await Promise.all([
      prisma.agendamento.count(),
      prisma.agendamento.count({ where: { dataHora: { gte: inicioDia, lt: fimDia } } }),
      prisma.agendamento.groupBy({ by: ["nomeCliente"], _count: true }),
      prisma.agendamento.findMany({
        where: { dataHora: { gte: agora } },
        orderBy: { dataHora: "asc" },
        take: 5,
      }),
    ]);

  return {
    props: {
      totalAgendamentos,
      agendamentosHoje: agendamentosHojeLista,
      totalClientes: totalClientesAgregado.length,
      proximosAgendamentos: proximosAgendamentos.map((ag) => ({
        ...ag,
        dataHora: ag.dataHora.toISOString(),
        criadoEm: ag.criadoEm.toISOString(),
      })),
    },
  };
};
