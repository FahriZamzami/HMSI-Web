"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus, FaTimes, FaUsers, FaImage, FaEdit, FaTrash } from "react-icons/fa";

interface Divisi {
  divisiId: number;
  divisiName: string;
  tentangDivisi: string;
  gambarDivisi: string | null;
  created: string;
}

export default function DetailPeriodePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [periodeName, setPeriodeName] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedDivisi, setSelectedDivisi] = useState<Divisi | null>(null);
  const [formDivisi, setFormDivisi] = useState("");
  const [formTentangDivisi, setFormTentangDivisi] = useState("");
  const [formGambar, setFormGambar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDivisi = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("action", "get_by_periode");
      formData.append("periodeId", id);

      const response = await fetch("/api/divisi", {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error);
      setDivisiList(resData.data);
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal mengambil data divisi");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeriodeInfo = async () => {
    try {
      const response = await fetch("/api/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_by_id", payload: { periodeId: id } }),
      });
      const resData = await response.json();
      if (response.ok && resData.data) {
        setPeriodeName(resData.data.periode);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDivisi();
    fetchPeriodeInfo();
  }, [id]);

  const deleteDivisi = async (divisiId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus divisi ini? Semua pengurus dan program kerja di dalamnya juga akan terhapus secara permanen.")) return;
    
    try {
      const response = await fetch("/api/divisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { divisiId } })
      });
      if (response.ok) {
        fetchDivisi();
      } else {
        const resData = await response.json();
        alert(resData.error || "Gagal menghapus divisi");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat menghapus divisi");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        setErrorMsg("Hanya gambar (JPG/PNG/WEBP) yang diperbolehkan.");
        e.target.value = "";
        return;
      }
      setFormGambar(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedDivisi(null);
    setFormDivisi("");
    setFormTentangDivisi("");
    setFormGambar(null);
    setPreviewUrl(null);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (divisi: Divisi, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedDivisi(divisi);
    setFormDivisi(divisi.divisiName);
    setFormTentangDivisi(divisi.tentangDivisi);
    setFormGambar(null);
    setPreviewUrl(divisi.gambarDivisi ? `/uploads/${divisi.gambarDivisi}` : null);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("action", modalMode === "edit" ? "update" : "create");
      formData.append("periodeId", id);
      if (modalMode === "edit" && selectedDivisi) {
        formData.append("divisiId", selectedDivisi.divisiId.toString());
      }
      formData.append("divisiName", formDivisi);
      formData.append("tentangDivisi", formTentangDivisi);
      
      if (formGambar) {
        formData.append("file", formGambar);
      }

      const response = await fetch("/api/divisi", {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();
      
      if (!response.ok) throw new Error(resData.error);

      setFormDivisi("");
      setFormTentangDivisi("");
      setFormGambar(null);
      setPreviewUrl(null);
      setIsModalOpen(false);
      
      fetchDivisi();
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal menambahkan divisi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Navigasi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black p-6 rounded-3xl border border-neutral-800 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin/periode")}
            className="w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <FaArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <FaUsers className="text-orange-500" />
              Kelola Divisi
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Daftar Divisi untuk Periode <strong className="text-orange-500">{periodeName || `#${id}`}</strong>
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/30"
        >
          <FaPlus size={14} />
          <span>Tambah Divisi</span>
        </button>
      </div>

      {errorMsg && !isModalOpen && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Grid View Divisi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-neutral-500 bg-black border border-neutral-800 rounded-3xl">
            Memuat data divisi...
          </div>
        ) : divisiList.length === 0 ? (
          <div className="col-span-full p-8 text-center text-neutral-500 bg-black border border-neutral-800 rounded-3xl">
            Belum ada divisi di periode ini. Silakan tambah baru.
          </div>
        ) : (
          divisiList.map((d) => (
            <div 
              key={d.divisiId} 
              onClick={() => router.push(`/admin/periode/${id}/divisi/${d.divisiId}`)}
              className="bg-black border border-neutral-800 rounded-2xl overflow-hidden shadow-lg group hover:border-orange-500/50 transition-all cursor-pointer"
            >
              <div className="h-40 bg-neutral-900 border-b border-neutral-800 relative flex items-center justify-center overflow-hidden">
                {d.gambarDivisi ? (
                  <img 
                    src={`/uploads/${d.gambarDivisi}`} 
                    alt={d.divisiName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-600">
                    <FaImage size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">Belum ada gambar</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {d.divisiName}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => openEditModal(d, e)}
                      className="p-2 bg-neutral-900/80 hover:bg-orange-500 text-white rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                      title="Edit Divisi"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={(e) => deleteDivisi(d.divisiId, e)}
                      className="p-2 bg-neutral-900/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors shadow-lg"
                      title="Hapus Divisi"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-center text-sm">
                <span className="text-neutral-500 font-medium tracking-wide">
                  Periode {periodeName || `#${id}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Divisi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-10 md:pt-16 pb-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl mb-auto flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 shrink-0">
              <h3 className="text-xl font-bold text-white">
                {modalMode === "create" ? "Tambah Divisi Baru" : "Edit Divisi"}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setErrorMsg("");
                }}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
              <div className="p-6 space-y-5 overflow-y-auto">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Nama Divisi <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formDivisi}
                    onChange={(e) => setFormDivisi(e.target.value)}
                    placeholder="Contoh: Divisi Keilmuan"
                    className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Tentang Divisi <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formTentangDivisi}
                    onChange={(e) => setFormTentangDivisi(e.target.value)}
                    placeholder="Jelaskan peran dan fungsi divisi ini..."
                    className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Gambar Banner Divisi (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-neutral-500">
                    Hanya gambar (JPG/PNG). Akan otomatis dioptimasi ke WebP.
                  </p>
                  {previewUrl && (
                    <div className="mt-3 relative w-full h-48 rounded-xl overflow-hidden border border-neutral-700 bg-black flex items-center justify-center p-2">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-neutral-800 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrorMsg("");
                  }}
                  className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/30 disabled:opacity-70"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
