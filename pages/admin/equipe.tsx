import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit2, Trash2, Save, X, User, BadgeCheck, Camera } from "lucide-react";

interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  fotoUrl: string;
  ativo: boolean;
}

export default function AdminEquipe() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [novo, setNovo] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    especialidade: "",
    fotoUrl: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, fotoUrl: data.url });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/profissionais");
      if (!res.ok) throw new Error("Erro ao buscar profissionais");
      const data = await res.json();
      setProfissionais(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (id?: string) => {
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/admin/profissionais/${id}` : "/api/admin/profissionais";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setEditando(null);
      setNovo(false);
      setFormData({ nome: "", especialidade: "", fotoUrl: "" });
      fetchData();
    }
  };

  return (
    <AdminLayout titulo="Gestão da Equipe">
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6 mb-4 md:mb-10">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-marrom font-cormorant leading-tight">Time de Especialistas</h2>
            <p className="text-marrom-claro text-[10px] md:text-sm mt-1 opacity-80">Gerencie seu time de talentos e destaque suas especialidades.</p>
          </div>
          <button
            onClick={() => {
              setNovo(true);
              setFormData({ nome: "", especialidade: "", fotoUrl: "" });
            }}
            className="btn-dourado w-full sm:w-auto flex items-center justify-center gap-2 !py-4 sm:!py-3 !px-6 !rounded-2xl shadow-dourado transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">Novo Profissional</span>
          </button>
        </div>

        {novo && (
          <div className="mb-6 md:mb-10 p-5 md:p-10 bg-white rounded-3xl md:rounded-[3rem] border border-creme-escuro animate-slide-up max-w-2xl mx-auto shadow-xl">
             <h3 className="text-xl md:text-2xl font-bold text-marrom mb-6 md:mb-8 flex items-center gap-3 font-cormorant">
              <div className="p-2 md:p-3 bg-creme rounded-xl md:rounded-2xl">
                 <User className="w-5 h-5 md:w-6 md:h-6 text-dourado" />
              </div>
              Cadastrar Profissional
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5 md:space-y-2">
                   <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro ml-2">Nome Completo</label>
                   <input
                    type="text"
                    placeholder="Ex: Amanda Silva"
                    className="input-elegante !bg-creme/20 !py-3 md:!py-4 text-sm"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                   <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro ml-2">Especialidade</label>
                   <input
                    type="text"
                    placeholder="Ex: Lash Designer Master"
                    className="input-elegante !bg-creme/20 !py-3 md:!py-4 text-sm"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2 md:space-y-3">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro ml-2">Foto de Perfil</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-creme/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-dashed border-creme-escuro">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white overflow-hidden flex-shrink-0 shadow-lg relative bg-white flex items-center justify-center">
                    {formData.fotoUrl ? (
                      <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 md:w-8 md:h-8 text-creme-escuro opacity-20" />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-marrom/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full text-center sm:text-left">
                    <input
                      type="file"
                      id="upload-team"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="upload-team" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all bg-marrom text-white hover:bg-dourado active:scale-95 shadow-lg w-full sm:w-auto justify-center"
                    >
                      <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" /> Escolher Foto
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-10">
              <button 
                onClick={() => handleSalvar()} 
                disabled={uploading || !formData.nome}
                className="btn-dourado !py-4 md:!py-5 !rounded-xl md:!rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-40 order-1 sm:order-2"
              >
                Salvar Cadastro
              </button>
              <button 
                onClick={() => setNovo(false)} 
                className="px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl border border-creme-escuro text-marrom-claro font-black text-[10px] uppercase tracking-widest hover:bg-creme/30 transition-all opacity-80 order-2 sm:order-1"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] h-96 animate-pulse border border-creme-escuro" />
            ))
          ) : profissionais.length === 0 ? (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-creme-escuro rounded-[3rem]">
                <User className="w-12 h-12 text-creme-escuro mx-auto mb-4 opacity-20" />
                <p className="text-marrom-claro">Nenhum profissional cadastrado.</p>
             </div>
          ) : (
            profissionais.map((p) => (
              <div key={p.id} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-sm border border-creme-escuro text-center relative group overflow-hidden hover:shadow-2xl transition-all duration-500">
               <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-creme to-transparent opacity-60 group-hover:from-dourado/10 transition-colors" />
               
               <div className="relative mb-6 md:mb-8 pt-2 md:pt-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-white shadow-xl overflow-hidden relative z-10 transition-transform duration-500 group-hover:scale-110">
                     <img src={p.fotoUrl || "/logo.png"} alt={p.nome} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-0 right-[20%] md:right-1/4 z-20 bg-white p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-lg border border-creme-escuro group-hover:rotate-[360deg] transition-transform duration-1000">
                     <BadgeCheck className="w-4 h-4 md:w-6 md:h-6 text-dourado" />
                  </div>
               </div>

               {editando === p.id ? (
                 <div className="space-y-3 md:space-y-4 relative z-10">
                    <input
                      type="text"
                      className="input-elegante !bg-creme/30 !py-2 md:!py-3 text-center text-sm md:text-base"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                    <input
                      type="text"
                      className="input-elegante !bg-creme/30 !py-2 md:!py-3 text-center text-[10px] md:text-xs"
                      value={formData.especialidade}
                      onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    />
                    <div className="flex justify-center gap-2 md:gap-3 pt-3 md:pt-4">
                      <button onClick={() => handleSalvar(p.id)} className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm">
                        <Save className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button onClick={() => setEditando(null)} className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                 </div>
               ) : (
                 <div className="relative z-10">
                    <h3 className="font-bold text-marrom text-xl md:text-2xl font-cormorant mb-1 group-hover:text-dourado transition-colors">{p.nome}</h3>
                    <p className="text-marrom-claro text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-10 group-hover:tracking-[0.3em] transition-all duration-500">{p.especialidade}</p>
                    
                    <div className="flex items-center justify-center gap-3 md:gap-4">
                      <button
                        onClick={() => {
                          setEditando(p.id);
                          setFormData({ nome: p.nome, especialidade: p.especialidade, fotoUrl: p.fotoUrl });
                        }}
                        className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-creme-escuro/30 text-marrom font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-marrom hover:text-white transition-all active:scale-95"
                      >
                        Perfil Detalhado
                      </button>
                      <button 
                        className="p-3 md:p-4 bg-creme-escuro/10 rounded-xl md:rounded-2xl text-marrom hover:text-red-500 transition-colors"
                        title="Inativar"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5 opacity-40" />
                      </button>
                    </div>
                 </div>
               )}
            </div>
          ))
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
