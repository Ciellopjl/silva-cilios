import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/AdminLayout";

interface ClienteInfo {
  nomeCliente: string;
  total: number;
  ultimaVisita: string;
}

interface ClientesProps {
  clientes: ClienteInfo[];
}

export default function Clientes({ clientes }: ClientesProps) {
  return (
    <AdminLayout titulo="Gestão de Clientes">
      <div className="space-y-6 md:space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-marrom font-cormorant leading-tight">Sua Base de Clientes</h2>
          <p className="text-marrom-claro text-[10px] md:text-sm mt-1 opacity-80">Acompanhe a fidelidade e o histórico de cada pessoa que escolhe a Silva Cílios.</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-creme-escuro/20 rounded-full border border-creme-escuro/30">
            <span className="w-1.5 h-1.5 rounded-full bg-dourado animate-pulse" />
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro">
              {clientes.length} {clientes.length === 1 ? "cliente ativo" : "clientes ativos"} no total
            </p>
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="bg-white rounded-3xl md:rounded-[3rem] border-2 border-dashed border-creme-escuro p-10 md:p-20 text-center group hover:border-dourado/30 transition-all">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-creme rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-3xl md:text-4xl opacity-40 group-hover:scale-110 transition-transform">👤</div>
            <p className="font-cormorant text-xl md:text-2xl font-bold text-marrom">Sua lista está vazia</p>
            <p className="text-marrom-claro text-[9px] md:text-xs font-black uppercase tracking-widest mt-2">Os clientes aparecerão aqui após o primeiro agendamento.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-creme-escuro">
              <table className="w-full">
                <thead>
                  <tr className="bg-creme/50 border-b border-creme-escuro">
                    <th className="text-left px-8 py-6 text-marrom-claro text-[10px] font-black uppercase tracking-widest">Identificação do Cliente</th>
                    <th className="text-center px-8 py-6 text-marrom-claro text-[10px] font-black uppercase tracking-widest">Frequência</th>
                    <th className="text-right px-8 py-6 text-marrom-claro text-[10px] font-black uppercase tracking-widest">Última Visita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-creme-escuro/50">
                  {clientes.map((cliente) => (
                    <tr key={cliente.nomeCliente} className="hover:bg-creme/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-marrom text-white flex items-center justify-center text-xl font-bold font-cormorant shadow-lg group-hover:scale-110 transition-transform">
                            {cliente.nomeCliente[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-marrom text-lg font-cormorant block leading-none">{cliente.nomeCliente}</span>
                            <span className="text-[9px] text-marrom-claro font-black uppercase tracking-widest opacity-60">Cliente Reconhecido</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-dourado text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-dourado-sm">
                          {cliente.total} {cliente.total === 1 ? "visita" : "visitas"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <p className="text-marrom font-bold text-sm">
                            {new Date(cliente.ultimaVisita).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                         </p>
                         <p className="text-[9px] text-marrom-claro font-black uppercase tracking-widest opacity-50 mt-1">Conforme registro</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 md:space-y-4">
              {clientes.map((cliente) => (
                <div key={cliente.nomeCliente} className="bg-white p-5 rounded-3xl border border-creme-escuro shadow-sm active:scale-[0.99] transition-all overflow-hidden relative">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-creme-escuro/50">
                    <div className="w-12 h-12 rounded-2xl bg-marrom text-white flex items-center justify-center text-xl font-bold font-cormorant shadow-md flex-shrink-0">
                      {cliente.nomeCliente[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-marrom text-lg font-cormorant leading-none mb-1 truncate">{cliente.nomeCliente}</h3>
                      <p className="text-[8px] text-marrom-claro font-black uppercase tracking-widest opacity-60">Histórico de Atendimento</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-creme/20 p-3 rounded-2xl border border-creme-escuro/30">
                       <p className="text-[8px] text-marrom-claro font-black uppercase tracking-widest mb-1 opacity-60">Frequência</p>
                       <p className="text-marrom font-bold text-base">{cliente.total}x</p>
                    </div>
                    <div className="bg-creme/20 p-3 rounded-2xl border border-creme-escuro/30">
                       <p className="text-[8px] text-marrom-claro font-black uppercase tracking-widest mb-1 opacity-60">Última Visita</p>
                       <p className="text-marrom font-bold text-[10px] whitespace-nowrap">
                          {new Date(cliente.ultimaVisita).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit"
                          })}
                       </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) return { redirect: { destination: "/auth/login", permanent: false } };

    const agendamentos = await prisma.agendamento.findMany({
      orderBy: { dataHora: "desc" },
      select: { nomeCliente: true, dataHora: true },
    });

    // Agrupa por nomeCliente
    const mapaClientes: Record<string, { total: number; ultimaVisita: string }> = {};
    for (const ag of agendamentos) {
      if (!mapaClientes[ag.nomeCliente]) {
        mapaClientes[ag.nomeCliente] = { total: 0, ultimaVisita: ag.dataHora.toISOString() };
      }
      mapaClientes[ag.nomeCliente].total++;
      if (ag.dataHora.toISOString() > mapaClientes[ag.nomeCliente].ultimaVisita) {
        mapaClientes[ag.nomeCliente].ultimaVisita = ag.dataHora.toISOString();
      }
    }

    const clientes = Object.entries(mapaClientes)
      .map(([nomeCliente, dados]) => ({ nomeCliente, ...dados }))
      .sort((a, b) => b.total - a.total);

    return { props: { clientes } };
  } catch (error) {
    console.error("Erro SSR Clientes:", error);
    return { props: { clientes: [] } };
  }
};
