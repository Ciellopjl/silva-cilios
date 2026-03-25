import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import AdminLayout from "@/components/AdminLayout";
import { Calendar, LogOut, Sparkle, Trash2, Check, UserCheck, Plus, Sparkles } from "lucide-react";

type Agendamento = {
  id: string;
  nomeCliente: string;
  servico: string;
  dataHora: string;
  observacoes?: string;
  status: string;
  usuario?: { nome: string; email: string };
};

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
];

const SERVICOS = [
  "Extensão de Cílios — Fio a Fio",
  "Extensão de Cílios — Volume Russo",
  "Extensão de Cílios — Híbrido",
  "Manutenção de Cílios",
  "Remoção de Cílios",
  "Lash Lifting",
  "Design de Sobrancelha",
  "Brow Lamination",
];

export default function Agendamentos() {
  const { data: session } = useSession();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [form, setForm] = useState({
    nomeCliente: "",
    servico: SERVICOS[0],
    dataHora: "",
    observacoes: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const carregarAgendamentos = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/agendamentos");
      if (!res.ok) throw new Error("Erro ao carregar agendamentos");
      const dados = await res.json();
      setAgendamentos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setMensagem("Erro ao carregar agendamentos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMensagem("✅ Agendamento criado com sucesso!");
        setModalAberto(false);
        setForm({ nomeCliente: "", servico: SERVICOS[0], dataHora: "", observacoes: "" });
        carregarAgendamentos();
      } else {
        const dado = await res.json();
        setMensagem(`❌ ${dado.mensagem}`);
      }
    } finally {
      setSalvando(false);
      setTimeout(() => setMensagem(""), 4000);
    }
  };

  const handleExcluir = async (id: string, nome: string) => {
    if (!confirm(`Excluir agendamento de ${nome}?`)) return;
    await fetch(`/api/agendamentos/${id}`, { method: "DELETE" });
    setMensagem("🗑️ Agendamento excluído.");
    carregarAgendamentos();
    setTimeout(() => setMensagem(""), 4000);
  };

  const handleAlterarStatus = async (id: string, novoStatus: string) => {
    await fetch(`/api/agendamentos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    carregarAgendamentos();
  };

  const agendamentosFiltrados = filtroStatus === "todos"
    ? agendamentos
    : agendamentos.filter((a) => a.status === filtroStatus);

  const badgeClass: Record<string, string> = {
    pendente: "badge-pendente",
    confirmado: "badge-confirmado",
    cancelado: "badge-cancelado",
    concluido: "badge-concluido",
  };

  return (
    <AdminLayout titulo="Agendamentos">
      {/* Toast */}
      {mensagem && (
        <div className="fixed top-6 right-6 z-[100] animate-slide-up">
          <div className="bg-white border-l-4 border-dourado text-marrom px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-dourado animate-ping" />
             {mensagem}
          </div>
        </div>
      )}

      <div className="space-y-4 md:space-y-8">
        {/* Header - Mais elegante e responsivo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6 mb-2 md:mb-4">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold text-marrom font-cormorant leading-tight">Agendamentos</h2>
            <p className="text-marrom-claro text-[9px] sm:text-sm mt-1 sm:mt-2 opacity-80 uppercase tracking-[0.2em] font-black">Agenda de Luxo</p>
          </div>
          <button 
            onClick={() => setModalAberto(true)} 
            className="btn-dourado w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 !py-4 sm:!py-3 !px-6 !rounded-2xl shadow-xl hover:shadow-dourado/40 transition-all active:scale-95 group"
          >
            <Calendar className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-widest">Novo Agendamento</span>
          </button>
        </div>

        {/* Filtros - Otimizados para mobile */}
        <div className="flex overflow-x-auto pb-4 md:pb-8 gap-2 md:gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {[{ value: "todos", label: "Todos" }, ...STATUS_OPTIONS].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFiltroStatus(opt.value)}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                filtroStatus === opt.value
                  ? "bg-marrom text-white border-marrom shadow-lg"
                  : "bg-white text-marrom-claro border-creme-escuro hover:border-dourado/50"
              }`}
            >
              {opt.label === "Todos os Registros" ? "Todos" : opt.label}
            </button>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="space-y-6 lg:space-y-0">
          {carregando ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-creme-escuro">
              <div className="w-16 h-16 border-4 border-dourado/20 border-t-dourado rounded-full animate-spin mx-auto mb-6" />
              <p className="font-cormorant text-2xl text-marrom font-bold italic">Sincronizando agenda...</p>
            </div>
          ) : agendamentosFiltrados.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-creme-escuro group overflow-hidden relative">
              <div className="absolute inset-0 bg-creme/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-24 h-24 bg-creme-escuro/20 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Sparkles className="w-10 h-10 text-dourado/40" />
              </div>
              <p className="font-cormorant text-3xl font-bold text-marrom mb-2">Sua agenda está livre</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-marrom-claro opacity-60">Prepare-se para encantar suas próximas clientes</p>
            </div>
          ) : (
            <>
              {/* Desktop View (Tabela) */}
              <div className="hidden lg:block bg-white rounded-[3rem] overflow-hidden shadow-sm border border-creme-escuro">
                <table className="w-full">
                  <thead>
                    <tr className="bg-creme/30 border-b border-creme-escuro">
                      <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-marrom-claro">Cliente Elegante</th>
                      <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-marrom-claro">Serviço Pretendido</th>
                      <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-marrom-claro">Data e Horário</th>
                      <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-marrom-claro">Status Atual</th>
                      <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-marrom-claro">Gestão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-creme-escuro/40">
                    {agendamentosFiltrados.map((ag) => (
                      <tr key={ag.id} className="hover:bg-creme/20 transition-all group">
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-marrom text-white flex items-center justify-center text-xl font-bold font-cormorant shadow-xl group-hover:scale-110 transition-transform">
                              {ag.nomeCliente[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-marrom text-xl font-cormorant leading-none mb-1">{ag.nomeCliente}</p>
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-marrom-claro opacity-60">Cliente Premium</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                           <div className="flex items-center gap-2">
                              <Sparkle className="w-4 h-4 text-dourado" />
                              <span className="text-marrom font-bold text-sm">{ag.servico}</span>
                           </div>
                        </td>
                        <td className="px-10 py-7">
                          <p className="text-marrom font-bold text-sm">{new Date(ag.dataHora).toLocaleDateString("pt-BR")}</p>
                          <p className="text-marrom-claro text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{new Date(ag.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                        </td>
                        <td className="px-10 py-7 text-center">
                          <select
                            value={ag.status}
                            onChange={(e) => handleAlterarStatus(ag.id, e.target.value)}
                            className={`${badgeClass[ag.status]} cursor-pointer appearance-none px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-marrom/10 text-center w-full max-w-[140px]`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-10 py-7 text-right">
                          <button 
                            onClick={() => handleExcluir(ag.id, ag.nomeCliente)} 
                            className="bg-creme-escuro/20 p-3 rounded-2xl text-marrom-claro hover:bg-red-500 hover:text-white transition-all group/btn"
                          >
                            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View (Cards Premium) */}
              <div className="lg:hidden grid grid-cols-1 gap-4 md:gap-8">
                {agendamentosFiltrados.map((ag) => (
                  <div key={ag.id} className="bg-white rounded-3xl md:rounded-[3rem] border border-creme-escuro shadow-sm overflow-hidden relative group active:scale-[0.99] transition-all">
                    {/* Linha de Status */}
                    <div className="absolute top-0 left-0 w-full h-1.5 flex">
                       <div className={`h-full flex-1 ${ag.status === 'confirmado' ? 'bg-green-500' : ag.status === 'pendente' ? 'bg-dourado' : 'bg-marrom'}`} />
                    </div>
                    
                    <div className="p-5 md:p-8">
                      <div className="flex justify-between items-start mb-4 md:mb-8">
                        <div className="flex items-center gap-3 md:gap-5 overflow-hidden">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.8rem] bg-marrom text-white flex items-center justify-center text-xl md:text-3xl font-bold font-cormorant shadow-lg flex-shrink-0">
                            {ag.nomeCliente[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-marrom text-lg md:text-2xl font-cormorant leading-none mb-1 md:mb-2 truncate">{ag.nomeCliente}</h3>
                            <div className="flex items-center gap-1.5">
                               <Sparkle className="w-2.5 h-2.5 text-dourado" />
                               <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro truncate">{ag.servico}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`px-2.5 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                          ag.status === "confirmado" ? "bg-green-500 text-white border-green-400" :
                          ag.status === "concluido" ? "bg-marrom text-white border-marrom-claro" :
                          "bg-dourado text-white border-dourado-claro"
                        }`}>
                          {ag.status}
                        </div>
                      </div>

                      <div className="bg-creme/20 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-creme-escuro/50 mb-4 md:mb-8">
                        <div className="flex items-center justify-between">
                           <div className="space-y-0.5 md:space-y-1">
                              <span className="text-[7px] md:text-[9px] text-marrom-claro font-black uppercase tracking-widest opacity-60">Horário Marcado</span>
                              <p className="text-marrom font-bold text-sm md:text-lg leading-none">
                                 {new Date(ag.dataHora).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} — {new Date(ag.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                           </div>
                           <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-dourado shadow-sm">
                              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:gap-3">
                         <div className="flex-1">
                            <select
                              value={ag.status}
                              onChange={(e) => handleAlterarStatus(ag.id, e.target.value)}
                              className="w-full bg-creme-escuro/20 border-none rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-marrom focus:ring-1 focus:ring-dourado transition-all outline-none"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                         </div>
                         <button 
                           onClick={() => handleExcluir(ag.id, ag.nomeCliente)}
                           className="w-10 h-10 md:w-14 md:h-14 bg-red-50 text-red-500 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                         >
                            <Trash2 className="w-4 h-4 md:w-6 md:h-6" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal - Novo Agendamento */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-marrom/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-up">
            <div className="px-8 py-6 border-b border-creme-escuro flex items-center justify-between">
              <h3 className="font-cormorant text-2xl font-semibold text-marrom">Novo Agendamento</h3>
              <button onClick={() => setModalAberto(false)} className="text-marrom-claro hover:text-marrom text-2xl leading-none">×</button>
            </div>

            <form onSubmit={handleCriar} className="p-8 space-y-4">
              <div>
                <label className="label-elegante">Nome do Cliente *</label>
                <input
                  type="text"
                  value={form.nomeCliente}
                  onChange={(e) => setForm({ ...form, nomeCliente: e.target.value })}
                  placeholder="Ex: Maria Silva"
                  className="input-elegante"
                  required
                />
              </div>

              <div>
                <label className="label-elegante">Serviço *</label>
                <select
                  value={form.servico}
                  onChange={(e) => setForm({ ...form, servico: e.target.value })}
                  className="input-elegante"
                  required
                >
                  {SERVICOS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-elegante">Data e Hora *</label>
                <input
                  type="datetime-local"
                  value={form.dataHora}
                  onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
                  className="input-elegante"
                  required
                />
              </div>

              <div>
                <label className="label-elegante">Observações</label>
                <textarea
                  value={form.observacoes}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                  placeholder="Algum detalhe especial..."
                  rows={3}
                  className="input-elegante resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-outline-dourado flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="btn-dourado flex-1">
                  {salvando ? "Salvando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
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
