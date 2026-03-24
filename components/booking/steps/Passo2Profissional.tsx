import { useState, useEffect } from "react";
import { BookingData } from "../BookingStepper";
import { User } from "lucide-react";

export default function Passo2Profissional({ onSelect, onBack }: { dados: BookingData; onSelect: (id: string, nome: string) => void; onBack: () => void }) {
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profissionais")
      .then((res) => res.json())
      .then((data) => {
        setProfissionais(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dourado"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="text-marrom hover:text-dourado transition-colors">←</button>
        <h2 className="font-cormorant text-3xl font-bold text-marrom">Escolha o Profissional</h2>
      </div>
      <p className="text-marrom-claro text-sm mb-8 ml-8">Selecione quem irá cuidar do seu olhar.</p>

      <div className="flex-1 space-y-4">
        {profissionais.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id, p.nome)}
            className="w-full p-5 md:p-6 bg-white border border-creme-escuro rounded-3xl hover:border-dourado/50 hover:bg-creme/30 transition-all duration-300 text-left group shadow-sm active:scale-[0.98] flex items-center gap-4"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              <img src={p.fotoUrl || "/logo.png"} alt={p.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-cormorant text-lg md:text-xl font-bold text-marrom group-hover:text-dourado-escuro transition-colors">{p.nome}</h3>
              <p className="text-marrom-claro text-[10px] md:text-xs font-semibold uppercase tracking-wider">{p.especialidade}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
