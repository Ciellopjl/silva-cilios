import { useEffect, useState } from "react";
import { BookingData } from "../BookingStepper";
import { Clock } from "lucide-react";

type Servico = {
  id: string;
  nome: string;
  preco: number;
  duracaoMin: number;
  descricao?: string;
};

export default function Passo1Servico({ onSelect }: { dados: BookingData; onSelect: (id: string, nome: string) => void }) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/servicos")
      .then((res) => res.json())
      .then((data) => {
        setServicos(data);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="font-cormorant text-3xl font-bold text-marrom mb-2">Escolha o Serviço</h2>
      <p className="text-marrom-claro text-sm mb-8">Selecione técnica desejada para o seu olhar.</p>

      {carregando ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-dourado" />
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {servicos.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id, s.nome)}
              className="w-full p-5 md:p-6 bg-white border border-creme-escuro rounded-3xl hover:border-dourado/50 hover:bg-creme/30 transition-all duration-300 text-left group shadow-sm active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <h3 className="font-cormorant text-lg md:text-xl font-bold text-marrom group-hover:text-dourado-escuro transition-colors">{s.nome}</h3>
                <span className="text-dourado font-bold text-sm md:text-base whitespace-nowrap ml-2">R$ {s.preco.toFixed(2)}</span>
              </div>
              <p className="text-marrom-claro text-[11px] md:text-xs leading-relaxed mb-3">{s.descricao}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-marrom-claro font-semibold uppercase tracking-wider">
                <Clock className="w-3 h-3 text-dourado" />
                {s.duracaoMin} MINUTOS
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
