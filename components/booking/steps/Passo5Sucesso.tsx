import { useEffect, useState } from "react";
import { BookingData } from "../BookingStepper";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

export default function Passo5Sucesso({ dados }: { dados: BookingData }) {
  const [status, setStatus] = useState<"processando" | "sucesso" | "erro">("processando");

  const [agendamentoId, setAgendamentoId] = useState("");

  useEffect(() => {
    const finalizar = async () => {
      try {
        const res = await fetch("/api/agendamentos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            servico: dados.servicoNome,
            dataHora: `${dados.data}T${dados.horario}:00`,
            nomeCliente: dados.nomeCliente,
            whatsapp: dados.whatsapp,
            local: dados.localAtendimento,
            endereco: dados.enderecoCliente,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAgendamentoId(data.id || "");
          setStatus("sucesso");
        } else {
          setStatus("erro");
        }
      } catch (e) {
        setStatus("erro");
      }
    };

    finalizar();
  }, [dados]);

  // Função para gerar o código curto do agendamento (somente números, máx 4)
  const getCodigo = () => {
    if (!agendamentoId) return "";
    // Pega os últimos 4 caracteres e tenta converter para números (ou usa o timestamp como fallback)
    const seed = agendamentoId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const numericId = (seed % 9000) + 1000; // Garante 4 dígitos entre 1000 e 9999
    return `#AGENDAMENTO${numericId}#`;
  };

  const [finalizado, setFinalizado] = useState(false);

  if (status === "processando") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-dourado mb-6" />
        <h2 className="font-cormorant text-2xl font-bold text-marrom">Finalizando seu agendamento...</h2>
      </div>
    );
  }

  if (status === "erro") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="font-cormorant text-2xl font-bold text-marrom mb-4">Ops! Algo deu errado.</h2>
        <p className="text-marrom-claro mb-8">Não conseguimos processar seu pedido agora. Tente novamente mais tarde ou pelo WhatsApp.</p>
        <button onClick={() => window.location.reload()} className="btn-dourado px-8">Tentar Novamente</button>
      </div>
    );
  }

  if (finalizado) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center py-10 animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping bg-dourado/20 rounded-full" />
          <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
        </div>
        <h2 className="font-cormorant text-4xl font-bold text-marrom mb-4">Agendamento Realizado!</h2>
        <p className="text-marrom-claro text-lg mb-12 max-w-sm mx-auto">
          Obrigada pela confiança! Helena Silva já recebeu sua confirmação e te aguarda com carinho. ✨
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-dourado px-12 py-4 rounded-2xl text-lg shadow-dourado-lg"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  const textoWhatsApp = `${getCodigo()} Oii Helena! Acabei de agendar ${dados.servicoNome} para o dia ${new Date(dados.data).toLocaleDateString('pt-BR')} às ${dados.horario}.\n\nLocal: ${dados.localAtendimento === 'helena' ? 'Na Helena Silva' : 'Em meu endereço'}${dados.localAtendimento === 'cliente' ? `\nEndereço: ${dados.enderecoCliente}` : ''}`;

  return (
    <div className="flex-1 flex flex-col h-full items-center justify-center text-center py-4">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-8 h-8" />
      </motion.div>
      <h2 className="font-cormorant text-2xl font-bold text-marrom mb-1 uppercase tracking-tight">Quase lá!</h2>
      <p className="text-marrom-claro text-xs mb-1">Confirme seu horário com a Helena abaixo.</p>
      {agendamentoId && (
        <p className="text-[10px] font-mono text-dourado-escuro uppercase tracking-widest mb-6">{getCodigo()}</p>
      )}

      <div className="w-full bg-creme rounded-3xl p-5 text-left border border-creme-escuro mb-8">
        <p className="text-[10px] uppercase tracking-widest font-bold text-dourado mb-3">Resumo do Agendamento</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-marrom-claro text-xs">Serviço</span>
            <span className="text-marrom font-bold text-xs">{dados.servicoNome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marrom-claro text-xs">Data/Hora</span>
            <span className="text-marrom font-bold text-xs">{new Date(dados.data).toLocaleDateString('pt-BR')} às {dados.horario}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marrom-claro text-xs">Local</span>
            <span className="text-marrom font-bold text-xs">{dados.localAtendimento === 'helena' ? 'Na Helena' : 'Em seu endereço'}</span>
          </div>
          {dados.localAtendimento === 'cliente' && (
            <div className="flex justify-between border-t border-creme-escuro pt-2 mt-2">
              <span className="text-marrom-claro text-xs underline">Endereço:</span>
              <span className="text-marrom font-bold text-xs truncate max-w-[150px]">{dados.enderecoCliente}</span>
            </div>
          )}
        </div>
      </div>

      <a 
        href={`https://wa.me/5582981910063?text=${encodeURIComponent(textoWhatsApp)}`}
        target="_blank"
        onClick={() => setFinalizado(true)}
        className="btn-dourado w-full py-4 rounded-xl shadow-dourado-lg mb-3 text-center flex items-center justify-center gap-2 font-bold"
      >
        Confirmar Agendamento <MessageSquare className="w-5 h-5" />
      </a>
      <button onClick={() => window.location.reload()} className="text-marrom-claro text-[10px] hover:text-dourado transition-colors">Voltar ao início</button>
    </div>
  );
}
