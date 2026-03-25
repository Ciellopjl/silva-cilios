import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Save, X, Image as ImageIcon, Camera } from "lucide-react";

interface Trabalho {
  id: string;
  titulo: string;
  fotoUrl: string;
}

export default function AdminGaleria() {
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [novo, setNovo] = useState(false);
  const [formData, setFormData] = useState({ titulo: "", fotoUrl: "" });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErro("");
    const dataForm = new FormData();
    dataForm.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: dataForm,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Falha no upload");
      }

      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, fotoUrl: data.url });
      }
    } catch (error: any) {
      console.error("Erro no upload:", error);
      setErro(error.message || "Erro ao subir imagem.");
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/galeria");
      if (!res.ok) throw new Error("Erro ao carregar galeria");
      const data = await res.json();
      setTrabalhos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar galeria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!formData.fotoUrl) return alert("Selecione uma imagem antes de publicar.");
    
    setUploading(true);
    try {
      const res = await fetch("/api/admin/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setNovo(false);
        setFormData({ titulo: "", fotoUrl: "" });
        fetchData();
      } else {
        throw new Error("Erro ao salvar na galeria");
      }
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Remover esta foto da galeria?")) {
      await fetch(`/api/admin/galeria/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  return (
    <AdminLayout titulo="Galeria de Clientes">
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6 mb-4 md:mb-10">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-marrom font-cormorant leading-tight">Portfólio de Luxo</h2>
            <p className="text-marrom-claro text-[10px] md:text-sm mt-1 opacity-80">Exiba seus melhores trabalhos para inspirar e atrair novas clientes.</p>
          </div>
          <button
            onClick={() => {
              setNovo(true);
              setErro("");
            }}
            className="btn-dourado w-full sm:w-auto flex items-center justify-center gap-2 !py-4 sm:!py-3 !px-6 !rounded-2xl shadow-dourado transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Foto</span>
          </button>
        </div>

        {novo && (
          <div className="mb-6 md:mb-10 p-5 md:p-10 bg-white rounded-3xl md:rounded-[3rem] border border-creme-escuro animate-slide-up max-w-2xl mx-auto shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-gradient-to-r from-dourado via-creme-escuro to-dourado opacity-30" />
            
            <h3 className="text-xl md:text-2xl font-bold text-marrom mb-6 md:mb-8 flex items-center gap-3 font-cormorant">
              <div className="p-2 md:p-3 bg-creme rounded-xl md:rounded-2xl">
                 <Camera className="w-5 h-5 md:w-6 md:h-6 text-dourado" />
              </div>
              Subir Novo Trabalho
            </h3>
            
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro ml-2">Legenda da Obra</label>
                <input
                  type="text"
                  placeholder="Ex: Extensão Fio a Fio Lux"
                  className="input-elegante !bg-creme/20 !py-4 md:!py-5 text-sm"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-marrom-claro ml-2">A Imagem (Alta Qualidade)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-creme/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-dashed border-creme-escuro hover:border-dourado/50 transition-all group">
                  <div className="w-full sm:w-40 h-48 sm:h-40 rounded-2xl md:rounded-[2rem] border-2 border-white overflow-hidden flex-shrink-0 shadow-lg relative group-hover:scale-105 transition-transform duration-500">
                    {formData.fotoUrl ? (
                      <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white flex flex-col items-center justify-center text-creme-escuro gap-2">
                        <ImageIcon className="w-8 h-8 md:w-10 md:h-10 opacity-20" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">Sem Preview</span>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-marrom/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <input
                      type="file"
                      id="upload-gallery"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="upload-gallery" 
                      className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all bg-marrom text-white hover:bg-dourado shadow-lg active:scale-95 w-full sm:w-auto"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      {formData.fotoUrl ? "Trocar Imagem" : "Selecionar do Celular"}
                    </label>
                    <p className="text-[8px] md:text-[10px] text-marrom-claro mt-3 md:mt-4 leading-relaxed opacity-60">Recomendamos fotos bem iluminadas.<br className="hidden sm:block"/>JPG, PNG ou WEBP até 10MB.</p>
                  </div>
                </div>
                {erro && (
                   <div className="bg-red-50 text-red-500 p-3 md:p-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold border border-red-100 flex items-center gap-2 md:gap-3 animate-shake">
                      <span>⚠️ {erro}</span>
                   </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-10">
              <button 
                onClick={handleSalvar} 
                disabled={uploading || !formData.fotoUrl}
                className="btn-dourado !py-4 md:!py-5 !rounded-xl md:!rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-40 order-1 sm:order-2"
              >
                Publicar Agora
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square rounded-[2rem] sm:rounded-[3rem] bg-white border border-creme-escuro animate-pulse" />
            ))
          ) : (
            <>
              {trabalhos.map((t) => (
                <div key={t.id} className="group relative aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-sm border border-creme-escuro bg-white hover:shadow-2xl transition-all duration-500">
                  <img src={t.fotoUrl} alt={t.titulo} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[1.5s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-marrom/90 via-marrom/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{t.titulo || "Trabalho Silva Cílios"}</p>
                    <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30" />
                      <button
                        onClick={() => handleExcluir(t.id)}
                        className="bg-white/90 hover:bg-red-500 hover:text-white text-red-500 p-3 rounded-2xl backdrop-blur-md transition-all shadow-xl active:scale-90"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {trabalhos.length === 0 && !novo && (
                <div className="col-span-full py-32 text-center border-4 border-dashed border-creme-escuro/30 rounded-[4rem] group hover:border-dourado/30 transition-colors">
                   <div className="w-24 h-24 bg-creme-escuro/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-10 h-10 text-creme-escuro opacity-40" />
                   </div>
                   <p className="text-marrom-claro font-cormorant text-2xl font-bold">Inicie sua galeria de arte</p>
                   <p className="text-marrom-claro/60 text-xs font-black uppercase tracking-widest mt-2">Nenhuma obra prima catalogada ainda</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
