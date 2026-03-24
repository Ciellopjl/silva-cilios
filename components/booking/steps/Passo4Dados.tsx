import { useState } from "react";
import { BookingData } from "../BookingStepper";

export default function Passo4Dados({ onBack, onSubmit }: { dados: BookingData; onBack: () => void; onSubmit: (nome: string, tel: string, local: string, endereco?: string) => void }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [local, setLocal] = useState("helena");
  const [endereco, setEndereco] = useState("");

  return (
    <div className="flex flex-col h-full animate-fade-in pb-4">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="text-marrom hover:text-dourado transition-colors">←</button>
        <h2 className="font-cormorant text-3xl font-bold text-marrom uppercase tracking-tight">Seus Dados</h2>
      </div>
      <p className="text-marrom-claro text-sm mb-6 ml-8">Só precisamos de algumas informações finais.</p>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(nome, whatsapp, local, endereco);
        }}
        className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-elegante !text-[10px]">Nome Completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="input-elegante !py-3"
            />
          </div>

          <div>
            <label className="label-elegante !text-[10px]">WhatsApp (com DDD)</label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 11) value = value.slice(0, 11);
                if (value.length > 2) {
                  value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                }
                if (value.length > 10) {
                  value = `${value.slice(0, 10)}-${value.slice(10)}`;
                }
                setWhatsapp(value);
              }}
              placeholder="(82) 99999-9999"
              className="input-elegante !py-3"
            />
          </div>
        </div>

        <div className="bg-creme/50 p-5 rounded-3xl border border-creme-escuro">
          <label className="label-elegante !text-[10px] mb-3 block">Onde será seu atendimento?</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLocal("helena")}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                local === "helena" 
                ? "bg-dourado border-dourado text-white shadow-dourado-sm" 
                : "bg-white border-creme-escuro text-marrom-claro hover:border-dourado/30"
              }`}
            >
              Na Helena Silva
            </button>
            <button
              type="button"
              onClick={() => setLocal("cliente")}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                local === "cliente" 
                ? "bg-dourado border-dourado text-white shadow-dourado-sm" 
                : "bg-white border-creme-escuro text-marrom-claro hover:border-dourado/30"
              }`}
            >
              Em meu Endereço
            </button>
          </div>
          
          {local === "helena" ? (
            <p className="mt-3 text-[10px] text-marrom-claro italic px-1">
              Lagoa de Pedra — Município de Pão de Açúcar, AL.
            </p>
          ) : (
            <div className="mt-4 animate-slide-up">
              <label className="label-elegante !text-[10px]">Seu Endereço / Bairro</label>
              <input
                type="text"
                required={local === "cliente"}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Pão de Açúcar, Centro..."
                className="input-elegante !py-3 !bg-white"
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="btn-dourado w-full py-4 rounded-2xl text-lg shadow-dourado-lg active:scale-95 transition-transform"
          >
            Revisar Agendamento
          </button>
        </div>
      </form>
    </div>
  );
}
