import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Passo1Servico from "./steps/Passo1Servico";
import Passo2Profissional from "./steps/Passo2Profissional";
import Passo3DataHora from "./steps/Passo3DataHora";
import Passo4Dados from "./steps/Passo4Dados";
import Passo5Sucesso from "./steps/Passo5Sucesso";
import { Save, X } from "lucide-react";

export type BookingData = {
  servicoId: string;
  servicoNome: string;
  profissionalId: string;
  profissionalNome: string;
  data: string;
  horario: string;
  nomeCliente: string;
  whatsapp: string;
  localAtendimento: string; // 'helena' ou 'cliente'
  enderecoCliente?: string;
};

interface BookingStepperProps {
  initialServico?: { id: string; nome: string };
  onResetServico?: () => void;
  onClose?: () => void;
}

export default function BookingStepper({ initialServico, onResetServico, onClose }: BookingStepperProps) {
  const [passo, setPasso] = useState(1);
  const [dados, setDados] = useState<BookingData>({
    servicoId: initialServico?.id || "",
    servicoNome: initialServico?.nome || "",
    profissionalId: "",
    profissionalNome: "",
    data: "",
    horario: "",
    nomeCliente: "",
    whatsapp: "",
    localAtendimento: "helena",
    enderecoCliente: "",
  });

  const [loadingAuto, setLoadingAuto] = useState(false);

  // Efeito para lidar com serviço vindo de fora (Premium Cards)
  useEffect(() => {
    if (initialServico?.id && initialServico.id !== dados.servicoId) {
      handleAutoSelect(initialServico.id, initialServico.nome);
    }
  }, [initialServico]);

  const handleAutoSelect = async (id: string, nome: string) => {
    setLoadingAuto(true);
    atualizarDados({ servicoId: id, servicoNome: nome });
    
    try {
      const res = await fetch("/api/profissionais");
      const lista = await res.json();
      if (lista && lista.length === 1) {
        atualizarDados({ 
          servicoId: id, 
          servicoNome: nome,
          profissionalId: lista[0].id, 
          profissionalNome: lista[0].nome 
        });
        setPasso(3);
      } else {
        setPasso(2);
      }
    } catch (error) {
      setPasso(2);
    } finally {
      setLoadingAuto(false);
    }
  };

  const proximoPasso = () => setPasso((prev) => Math.min(prev + 1, 5));
  const passoAnterior = () => {
    if (passo === 2 && initialServico) {
      onResetServico?.();
      setPasso(1);
      return;
    }
    if (passo === 3 && initialServico) {
       // Se pulou o passo 2, volta pro 1 e reseta
       onResetServico?.();
       setPasso(1);
       return;
    }
    setPasso((prev) => Math.max(prev - 1, 1));
  };

  const atualizarDados = (novosDados: Partial<BookingData>) => {
    setDados((prev) => ({ ...prev, ...novosDados }));
  };

  const renderStep = () => {
    switch (passo) {
      case 1:
        return (
          <Passo1Servico 
            dados={dados} 
            onSelect={async (id: string, nome: string) => { 
              atualizarDados({ servicoId: id, servicoNome: nome }); 
              
              // Verificar profissionais para decidir se pula o Passo 2
              try {
                const res = await fetch("/api/profissionais");
                const lista = await res.json();
                if (lista && lista.length === 1) {
                  // Se só tem um, seleciona automaticamente e pula para o Passo 3
                  atualizarDados({ 
                    servicoId: id, 
                    servicoNome: nome,
                    profissionalId: lista[0].id, 
                    profissionalNome: lista[0].nome 
                  });
                  setPasso(3);
                } else {
                  setPasso(2);
                }
              } catch (error) {
                console.error("Erro ao buscar profissionais:", error);
                setPasso(2);
              }
            }} 
          />
        );
      case 2:
        return <Passo2Profissional dados={dados} onSelect={(id: string, nome: string) => { atualizarDados({ profissionalId: id, profissionalNome: nome }); setPasso(3); }} onBack={() => setPasso(1)} />;
      case 3:
        return <Passo3DataHora dados={dados} onSelect={(data: string, hora: string) => { atualizarDados({ data, horario: hora }); proximoPasso(); }} onBack={passoAnterior} />;
      case 4:
        return <Passo4Dados dados={dados} onSubmit={(nome: string, tel: string, local: string, endereco?: string) => { atualizarDados({ nomeCliente: nome, whatsapp: tel, localAtendimento: local, enderecoCliente: endereco }); proximoPasso(); }} onBack={passoAnterior} />;
      case 5:
        return <Passo5Sucesso dados={dados} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full md:h-auto md:max-w-xl mx-auto bg-white backdrop-blur-xl md:rounded-[2.5rem] md:shadow-2xl md:border md:border-creme-escuro overflow-y-auto md:overflow-hidden md:min-h-[500px] flex flex-col relative z-20">
      {/* Botão Fechar para Modal */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full hover:bg-creme-escuro transition-colors text-marrom-claro bg-white/50 backdrop-blur-sm shadow-sm md:shadow-none"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Progress Bar */}
      {passo < 5 && (
        <div className="flex px-4 pt-8 md:px-8 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                passo >= s ? "bg-dourado" : "bg-creme-escuro"
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={passo}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
