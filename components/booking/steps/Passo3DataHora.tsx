import { useState, useMemo, useEffect } from "react";
import { BookingData } from "../BookingStepper";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function Passo3DataHora({ onSelect, onBack }: { dados: BookingData; onSelect: (data: string, hora: string) => void; onBack: () => void }) {
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slotsOcupados, setSlotsOcupados] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const horariosTarde = ["13:00", "14:30", "16:00", "17:30"];

  const horariosDisponiveis = useMemo(() => {
    return horariosTarde;
  }, []);

  // Buscar slots ocupados quando mudar a data
  useEffect(() => {
    if (dataSelecionada) {
      setLoadingSlots(true);
      fetch(`/api/slots-ocupados?data=${dataSelecionada}`)
        .then(res => res.json())
        .then(data => {
          setSlotsOcupados(data);
          setLoadingSlots(false);
        })
        .catch(() => {
          setLoadingSlots(false);
        });
    }
  }, [dataSelecionada]);

  // Lógica do Calendário
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Quantidade de dias no mês
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Espaços vazios para alinhar o início da semana (Domingo = 0)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!dataSelecionada) return false;
    const sel = new Date(dataSelecionada + 'T00:00:00');
    return date.getDate() === sel.getDate() && 
           date.getMonth() === sel.getMonth() && 
           date.getFullYear() === sel.getFullYear();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const isWorkingDay = (date: Date) => {
    // Trabalha todos os dias
    return true; 
  };

  return (
    <div className="flex flex-col h-full animate-fade-in group/calendar">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="text-marrom hover:text-dourado transition-colors">←</button>
        <h2 className="font-cormorant text-3xl font-bold text-marrom uppercase tracking-tight">Escolha o Horário</h2>
      </div>
      <p className="text-marrom-claro text-sm mb-6 ml-8">Selecione o melhor momento para você.</p>

      {/* Calendário Grid */}
      <div className="bg-white border border-creme-escuro rounded-[2rem] p-4 mb-6 shadow-sm">
        {/* Header do Mês */}
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="font-cormorant text-xl font-bold text-marrom capitalize">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-1">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-creme rounded-full transition-colors text-marrom-claro"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-creme rounded-full transition-colors text-marrom-claro"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map(d => (
            <span key={d} className="text-center text-[10px] uppercase font-bold text-dourado opacity-60 mb-2">{d}</span>
          ))}
          {calendarData.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} className="aspect-square" />;
            
            const past = isPast(d);
            const workingDay = isWorkingDay(d);
            const disabled = past || !workingDay;
            const selected = isSelected(d);
            const today = isToday(d);
            const dataStr = d.toISOString().split('T')[0];

            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => setDataSelecionada(dataStr)}
                className={`
                  aspect-square rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center
                  ${disabled ? "opacity-20 cursor-not-allowed text-marrom-claro" : "hover:bg-creme text-marrom"}
                  ${selected ? "!bg-dourado !text-white shadow-dourado-lg !scale-110 z-10" : ""}
                `}
              >
                {d.getDate()}
                {today && !selected && <div className="absolute bottom-1.5 w-1 h-1 bg-dourado rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4 px-2">
          <p className="text-marrom font-semibold text-xs md:text-sm">Horários para {dataSelecionada ? new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) : "o dia selecionado"}:</p>
          {loadingSlots && <Loader2 className="w-4 h-4 text-dourado animate-spin" />}
        </div>
        <div className="grid grid-cols-3 gap-2 px-1">
          {horariosDisponiveis.map((h) => {
            const isOcupado = slotsOcupados.includes(h);
            return (
              <button
                key={h}
                disabled={!dataSelecionada || isOcupado || loadingSlots}
                onClick={() => {
                  if (dataSelecionada) onSelect(dataSelecionada, h);
                }}
                className={`py-3 rounded-xl border text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  !dataSelecionada || loadingSlots ? "opacity-30 cursor-not-allowed bg-creme grayscale" :
                  isOcupado ? "bg-creme/50 border-creme-escuro text-marrom-claro/40 cursor-not-allowed line-through" :
                  "bg-white border-creme-escuro text-marrom-claro hover:border-dourado/50 hover:bg-creme/30 active:scale-95"
                }`}
              >
                <span>{h}</span>
                {isOcupado && <span className="text-[8px] uppercase tracking-tighter opacity-100 font-bold text-marrom-claro">Ocupado</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
