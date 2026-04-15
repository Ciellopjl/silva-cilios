import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Save, Clock, CalendarDays, CheckCircle2 } from "lucide-react";

const diasStr = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

interface Horario {
  diaSemana: number;
  abertura: string;
  fechamento: string;
  ativo: boolean;
}

export default function AdminHorarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    fetch("/api/admin/horarios")
      .then(res => res.json())
      .then(data => {
         // Garantir que todos os 7 dias existam
         const hList = Array.from({length: 7}).map((_, i) => {
            const found = data.find((d: any) => d.diaSemana === i);
            return found || {
               diaSemana: i,
               abertura: "09:00",
               fechamento: "18:00",
               ativo: false
            };
         });
         setHorarios(hList);
         setLoading(false);
      });
  }, []);

  const handleMudarStatus = (dia: number, ativo: boolean) => {
     setHorarios(prev => prev.map(h => h.diaSemana === dia ? { ...h, ativo } : h));
  };

  const handleMudarHora = (dia: number, campo: "abertura" | "fechamento", valor: string) => {
     setHorarios(prev => prev.map(h => h.diaSemana === dia ? { ...h, [campo]: valor } : h));
  };

  const handleSalvar = async () => {
    setSalvando(true);
    setSucesso(false);
    try {
      const res = await fetch("/api/admin/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horarios })
      });
      if (res.ok) {
         setSucesso(true);
         setTimeout(() => setSucesso(false), 3000);
      } else {
         alert("Erro ao salvar horários.");
      }
    } catch (e) {
      alert("Erro de conexão ao salvar.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <AdminLayout titulo="Horários de Funcionamento">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-marrom font-cormorant flex items-center gap-2">
               <CalendarDays className="w-6 h-6 text-dourado" /> 
               Horários da Semana
            </h2>
            <p className="text-marrom-claro text-sm mt-1">Configure os dias e horários em que o estúdio está aberto.</p>
          </div>
          
          <button
            onClick={handleSalvar}
            disabled={salvando || loading}
            className="btn-dourado flex items-center gap-2 px-6 py-3 disabled:opacity-50"
          >
            {sucesso ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {salvando ? "Salvando..." : sucesso ? "Salvos!" : "Salvar Horários"}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-creme-escuro p-4 md:p-8 shadow-sm">
          {loading ? (
             <div className="space-y-4 animate-pulse">
                {[1,2,3,4,5,6,7].map(i => (
                   <div key={i} className="h-16 bg-creme rounded-2xl" />
                ))}
             </div>
          ) : (
            <div className="space-y-3">
              {horarios.map((h) => (
                <div key={h.diaSemana} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border transition-colors ${h.ativo ? 'bg-white border-dourado/20 shadow-sm' : 'bg-creme/30 border-transparent'}`}>
                   
                   {/* Dia da Semana Toggle */}
                   <div className="flex items-center gap-3 md:w-48">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                           type="checkbox" 
                           className="sr-only peer" 
                           checked={h.ativo} 
                           onChange={(e) => handleMudarStatus(h.diaSemana, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-creme-escuro peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dourado"></div>
                      </label>
                      <span className={`font-bold ${h.ativo ? 'text-marrom' : 'text-marrom-claro opacity-50'}`}>
                         {diasStr[h.diaSemana]}
                      </span>
                   </div>

                   {/* Seleção de Horários */}
                   <div className={`flex flex-wrap md:flex-nowrap items-center gap-3 flex-1 transition-opacity ${h.ativo ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                      <div className="flex items-center gap-2 flex-1 md:flex-none">
                         <div className="p-2 bg-creme rounded-lg"><Clock className="w-4 h-4 text-dourado" /></div>
                         <input 
                            type="time" 
                            value={h.abertura}
                            onChange={(e) => handleMudarHora(h.diaSemana, "abertura", e.target.value)}
                            className="input-elegante !py-2 !px-3 font-semibold text-center w-full md:w-32"
                         />
                      </div>
                      <span className="text-marrom-claro font-medium text-sm">até</span>
                      <div className="flex items-center gap-2 flex-1 md:flex-none">
                         <input 
                            type="time" 
                            value={h.fechamento}
                            onChange={(e) => handleMudarHora(h.diaSemana, "fechamento", e.target.value)}
                            className="input-elegante !py-2 !px-3 font-semibold text-center w-full md:w-32"
                         />
                      </div>
                   </div>

                   {/* Etiqueta de Status Decorativa */}
                   <div className="hidden lg:block w-24 text-right">
                      {h.ativo ? (
                         <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-lg">Aberto</span>
                      ) : (
                         <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-1 rounded-lg">Fechado</span>
                      )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
