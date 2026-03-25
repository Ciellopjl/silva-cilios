import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit2, Trash2, Save, X, Sparkle, Image as ImageIcon, Camera } from "lucide-react";

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMin: number;
  fotoUrl?: string;
  ativo: boolean;
}

export default function AdminServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [novoServico, setNovoServico] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [fotosGaleria, setFotosGaleria] = useState<any[]>([]);
  const [loadingGaleria, setLoadingGaleria] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    duracaoMin: 60,
    fotoUrl: "",
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const dataForm = new FormData();
    dataForm.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: dataForm,
        credentials: "same-origin"
      });
      
      if (!res.ok) {
        let errorMessage = "Erro no servidor.";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = await res.text();
        }
        console.error("Erro no servidor de upload:", errorMessage);
        alert(`Erro no upload: ${errorMessage}`);
        return;
      }

      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, fotoUrl: data.url }));
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha ao enviar a imagem. Verifique sua conexão.");
    } finally {
      setUploading(false);
    }
  };

  const handleAbrirGaleria = async () => {
    setMostrarGaleria(true);
    setLoadingGaleria(true);
    try {
      const res = await fetch("/api/admin/galeria");
      const data = await res.json();
      setFotosGaleria(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar galeria:", error);
    } finally {
      setLoadingGaleria(false);
    }
  };

  const handleSelecionarFoto = (url: string) => {
    setFormData((prev) => ({ ...prev, fotoUrl: url }));
    setMostrarGaleria(false);
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const res = await fetch("/api/admin/servicos");
      if (!res.ok) throw new Error("Erro ao carregar serviços");
      const data = await res.json();
      setServicos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (id?: string) => {
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/admin/servicos/${id}` : "/api/admin/servicos";

      // Limpeza de dados básicos
      const dataToSend = {
        ...formData,
        preco: Number(formData.preco),
        duracaoMin: Number(formData.duracaoMin),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        setEditando(null);
        setNovoServico(false);
        setFormData({ nome: "", descricao: "", preco: 0, duracaoMin: 60, fotoUrl: "" });
        await fetchServicos();
        alert("Serviço salvo com sucesso! ✨");
      } else {
        const errorData = await res.json();
        alert(`Erro ao salvar: ${errorData.mensagem || errorData.message || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro de conexão ao salvar serviço.");
    }
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const res = await fetch(`/api/admin/servicos/${id}`, { method: "DELETE" });
      if (res.ok) fetchServicos();
    }
  };

  return (
    <AdminLayout titulo="Gestão de Serviços">
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6 mb-4 md:mb-10">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-marrom font-cormorant leading-tight">Catálogo de Serviços</h2>
            <p className="text-marrom-claro text-[10px] md:text-sm mt-1 opacity-80">Personalize as ofertas, preços e tempos de duração do seu atendimento.</p>
          </div>
          <button
            onClick={() => {
              setNovoServico(true);
              setFormData({ nome: "", descricao: "", preco: 0, duracaoMin: 60, fotoUrl: "" });
            }}
            className="btn-dourado w-full sm:w-auto flex items-center justify-center gap-2 !py-4 sm:!py-3 !px-6 !rounded-2xl shadow-dourado transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">Novo Serviço</span>
          </button>
        </div>

        {novoServico && (
          <div className="mb-6 md:mb-8 p-5 md:p-6 bg-creme/30 rounded-3xl border border-creme-escuro animate-fade-in shadow-inner">
            <h3 className="text-base md:text-lg font-bold text-marrom mb-4 flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-dourado" /> Adicionar Novo Serviço
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="md:col-span-1">
                <label className="label-elegante block mb-2">Imagem de Capa</label>
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-creme-escuro bg-white flex items-center justify-center group shadow-sm">
                  {formData.fotoUrl ? (
                    <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-creme-escuro mx-auto mb-2 opacity-30" />
                      <span className="text-[8px] md:text-[10px] text-marrom-claro uppercase font-bold tracking-wider">Upload ou Galeria</span>
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-marrom/40 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label className="bg-white text-marrom px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold cursor-pointer hover:bg-dourado hover:text-white transition-colors">
                      Fazer Upload
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                    <button 
                      type="button"
                      onClick={handleAbrirGaleria}
                      className="bg-dourado text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold hover:bg-dourado-escuro transition-colors"
                    >
                      Pegar da Galeria
                    </button>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-marrom/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="mt-2 md:mt-3 flex gap-2">
                  <button onClick={handleAbrirGaleria} className="flex-1 text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-dourado border border-dourado/30 py-2 rounded-xl hover:bg-dourado/5 transition-all">
                    Abrir Minha Galeria
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="md:col-span-2">
                  <label className="label-elegante block pb-1">Nome do Serviço</label>
                  <input
                    type="text"
                    placeholder="Ex: Extensão de Cílios Volume Russo"
                    className="input-elegante bg-white text-sm"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-elegante block pb-1">Preço (R$)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input-elegante bg-white text-sm"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label-elegante block pb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    placeholder="60"
                    className="input-elegante bg-white text-sm"
                    value={formData.duracaoMin}
                    onChange={(e) => setFormData({ ...formData, duracaoMin: Number(e.target.value) })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label-elegante block pb-1">Descrição</label>
                  <textarea
                    placeholder="Descreva o serviço para suas clientes..."
                    className="input-elegante bg-white h-20 md:h-24 text-sm"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6 md:mt-8 justify-end">
              <button 
                onClick={() => handleSalvar()} 
                disabled={uploading || !formData.nome}
                className={`btn-dourado flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 order-1 sm:order-2 ${uploading || !formData.nome ? 'opacity-50 grayscale' : ''}`}
              >
                <Save className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Salvar Serviço</span>
              </button>
              <button onClick={() => setNovoServico(false)} className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-full border border-marrom-claro text-marrom-claro hover:bg-white transition-all font-bold text-[10px] uppercase tracking-widest order-2 sm:order-1">
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-creme-escuro" />
            ))
          ) : servicos.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-creme-escuro rounded-[3rem]">
               <Sparkle className="w-12 h-12 text-creme-escuro mx-auto mb-4 opacity-20" />
               <p className="text-marrom-claro">Nenhum serviço cadastrado.</p>
            </div>
          ) : (
            servicos.map((s) => (
              <div key={s.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-creme-escuro hover:shadow-xl transition-all flex flex-col group">
              {editando === s.id ? (
                <div className="p-8 space-y-5 bg-creme/20">
                  <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-creme-escuro bg-white group/edit">
                    <img src={formData.fotoUrl || s.fotoUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-marrom/40 flex flex-col items-center justify-center opacity-0 group-hover/edit:opacity-100 transition-opacity gap-2">
                      <label className="bg-white text-marrom px-4 py-2 rounded-full text-[10px] font-bold cursor-pointer hover:bg-dourado hover:text-white transition-colors">
                        Mudar Imagem
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="input-elegante !bg-white !py-4"
                      placeholder="Nome do Serviço"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-marrom-claro text-xs font-bold">R$</span>
                        <input
                          type="number"
                          className="input-elegante !bg-white !pl-10 !py-4"
                          value={formData.preco}
                          onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-marrom-claro text-[10px] font-bold uppercase">min</span>
                        <input
                          type="number"
                          className="input-elegante !bg-white !py-4"
                          value={formData.duracaoMin}
                          onChange={(e) => setFormData({ ...formData, duracaoMin: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => handleSalvar(s.id)} 
                      disabled={uploading || !formData.nome}
                      className="flex-1 btn-dourado !py-4 !rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={() => setEditando(null)} 
                      className="px-6 py-4 rounded-2xl border border-marrom-claro/30 text-marrom-claro font-bold text-[10px] uppercase tracking-widest hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={s.fotoUrl || "https://images.unsplash.com/photo-1512496015851-a90fb38ba496?q=80&w=800&auto=format&fit=crop"} 
                      alt={s.nome} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button
                          onClick={() => {
                            setEditando(s.id);
                            setFormData({ nome: s.nome, descricao: s.descricao || "", preco: s.preco, duracaoMin: s.duracaoMin, fotoUrl: s.fotoUrl || "" });
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-marrom hover:bg-dourado hover:text-white transition-all shadow-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleExcluir(s.id)} 
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    {!s.fotoUrl && (
                      <div className="absolute inset-0 bg-marrom/20 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-[10px] text-white font-black tracking-[0.3em] uppercase bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">Estética Premium</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-marrom text-2xl font-cormorant leading-tight mb-1 group-hover:text-dourado transition-colors">{s.nome}</h3>
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-dourado" />
                           <p className="text-marrom-claro text-[9px] font-black uppercase tracking-[0.2em]">{s.duracaoMin} MINUTOS DE SESSÃO</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-marrom-claro text-sm line-clamp-3 mb-8 italic opacity-80 leading-relaxed font-serif">
                       "{s.descricao || "Um toque de luxo e sofisticação para realçar sua beleza natural."}"
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-creme-escuro/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-marrom-claro font-black uppercase tracking-widest mb-1">Valor Unitário</span>
                        <p className="text-marrom font-bold text-2xl font-cormorant">
                          <span className="text-sm font-sans mr-1">R$</span>{typeof s.preco === 'number' ? s.preco.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                           setEditando(s.id);
                           setFormData({ nome: s.nome, descricao: s.descricao || "", preco: s.preco, duracaoMin: s.duracaoMin, fotoUrl: s.fotoUrl || "" });
                        }}
                        className="p-4 bg-creme-escuro/30 rounded-2xl text-marrom hover:bg-dourado hover:text-white transition-all"
                      >
                         <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      </div>

      {/* Modal Seletor de Galeria */}
      {mostrarGaleria && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-marrom/60 backdrop-blur-md" onClick={() => setMostrarGaleria(false)} />
          <div className="relative w-full max-w-4xl bg-creme rounded-[3rem] shadow-2xl overflow-hidden border border-creme-escuro animate-slide-up">
            <div className="p-8 border-b border-creme-escuro flex justify-between items-center bg-white/50">
              <div>
                <h3 className="text-2xl font-bold text-marrom font-cormorant">Escolher do Portfólio</h3>
                <p className="text-sm text-marrom-claro">Selecione um dos seus trabalhos realizados para ser a capa do serviço.</p>
              </div>
              <button 
                onClick={() => setMostrarGaleria(false)}
                className="p-2 hover:bg-creme rounded-full transition-colors text-marrom-claro"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {loadingGaleria ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-dourado/20 border-t-dourado rounded-full animate-spin" />
                  <span className="text-sm text-marrom-claro font-bold uppercase tracking-widest">Carregando Galeria...</span>
                </div>
              ) : fotosGaleria.length === 0 ? (
                <div className="text-center py-20">
                  <ImageIcon className="w-12 h-12 text-creme-escuro mx-auto mb-4 opacity-20" />
                  <p className="text-marrom-claro">Você ainda não tem fotos na galeria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fotosGaleria.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSelecionarFoto(f.fotoUrl)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        formData.fotoUrl === f.fotoUrl ? 'border-dourado ring-4 ring-dourado/20' : 'border-creme-escuro hover:border-dourado'
                      }`}
                    >
                      <img src={f.fotoUrl} alt={f.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-marrom/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-dourado text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg">Selecionar</span>
                      </div>
                      {formData.fotoUrl === f.fotoUrl && (
                        <div className="absolute inset-0 bg-dourado/20 border-dourado flex items-center justify-center">
                          <div className="bg-dourado text-white p-1 rounded-full">
                            <Plus className="w-4 h-4 rotate-45" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-8 bg-creme-escuro/20 flex justify-end">
              <button onClick={() => setMostrarGaleria(false)} className="px-8 py-3 rounded-2xl bg-marrom text-creme font-bold text-sm tracking-widest uppercase hover:bg-marrom-claro transition-all shadow-lg">
                Fechar Galeria
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
