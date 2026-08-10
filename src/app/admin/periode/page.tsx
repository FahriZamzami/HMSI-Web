"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTimes, FaCalendarAlt, FaEdit, FaTrash, FaChevronRight } from "react-icons/fa";

interface Periode {
  periodeId: number;
  periode: string;
  status: "Active" | "Non_Active";
  gambarPeriode: string | null;
  created: string;
}

export default function PeriodePage() {
  const router = useRouter();
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);

  // Form State
  const [formPeriode, setFormPeriode] = useState("");
  const [formGambar, setFormGambar] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState<"Active" | "Non_Active">("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Replacement States
  const [replacementType, setReplacementType] = useState<"existing" | "new">("existing");
  const [replacementPeriodeId, setReplacementPeriodeId] = useState("");
  const [newPeriodeName, setNewPeriodeName] = useState("");
  const [newPeriodeFile, setNewPeriodeFile] = useState<File | null>(null);
  const [newPeriodePreviewUrl, setNewPeriodePreviewUrl] = useState<string | null>(null);

  const fetchPeriodes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_all" }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error);
      setPeriodes(resData.data);
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal mengambil data periode");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodes();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedPeriode(null);
    setFormPeriode("");
    setFormGambar(null);
    setPreviewUrl(null);
    setFormStatus("Non_Active"); // Default create is non-active
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (periode: Periode, e: React.MouseEvent) => {
    e.stopPropagation(); // Cegah baris ter-klik
    setModalMode("edit");
    setSelectedPeriode(periode);
    setFormPeriode(periode.periode);
    setFormStatus(periode.status);
    setFormGambar(null);
    setPreviewUrl(periode.gambarPeriode ? `/uploads/${periode.gambarPeriode}` : null);
    
    // Reset replacement
    setReplacementType("existing");
    setReplacementPeriodeId("");
    setNewPeriodeName("");
    setNewPeriodeFile(null);
    setNewPeriodePreviewUrl(null);
    
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openDeleteModal = (periode: Periode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPeriode(periode);
    setErrorMsg("");
    setIsDeleteModalOpen(true);
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

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        setErrorMsg("Hanya gambar (JPG/PNG/WEBP) yang diperbolehkan.");
        e.target.value = "";
        return;
      }
      setNewPeriodeFile(file);
      setNewPeriodePreviewUrl(URL.createObjectURL(file));
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      let action = modalMode === "edit" ? "update" : "create";
      
      formData.append("periode", formPeriode);
      if (formGambar) formData.append("file", formGambar);

      if (modalMode === "edit" && selectedPeriode) {
        formData.append("periodeId", selectedPeriode.periodeId.toString());
        formData.append("status", formStatus);

        // Logic penggantian jika Active -> Non_Active
        if (selectedPeriode.status === "Active" && formStatus === "Non_Active") {
          if (replacementType === "existing") {
            if (!replacementPeriodeId) throw new Error("Silakan pilih periode pengganti yang akan diaktifkan.");
            formData.append("replacementPeriodeId", replacementPeriodeId);
          } else {
            if (!newPeriodeName) throw new Error("Silakan masukkan nama periode baru.");
            action = "update_and_create_replacement";
            formData.append("newPeriodeName", newPeriodeName);
            if (newPeriodeFile) formData.append("newPeriodeFile", newPeriodeFile);
          }
        }
      }

      formData.append("action", action);

      const response = await fetch("/api/periode", {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();
      
      if (!response.ok) throw new Error(resData.error);

      setIsModalOpen(false);
      fetchPeriodes();
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal menyimpan periode");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPeriode) return;
    setIsSubmitting(true);
    setErrorMsg("");

    // Pencegahan menghapus periode aktif (bisa juga di-handle backend)
    if (selectedPeriode.status === "Active") {
      setErrorMsg("Periode aktif tidak bisa dihapus. Silakan nonaktifkan terlebih dahulu.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { periodeId: selectedPeriode.periodeId } }),
      });
      const resData = await response.json();
      
      if (!response.ok) throw new Error(resData.error);

      setIsDeleteModalOpen(false);
      fetchPeriodes();
    } catch (error: any) {
      setErrorMsg(error.message || "Gagal menghapus periode");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDeactivatingActive = modalMode === "edit" && selectedPeriode?.status === "Active" && formStatus === "Non_Active";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black p-6 rounded-3xl border border-neutral-800 shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <FaCalendarAlt className="text-orange-500" />
            Kelola Periode
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Daftar seluruh periode kepengurusan HMSI
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/30"
        >
          <FaPlus size={14} />
          <span>Tambah Periode</span>
        </button>
      </div>

      {errorMsg && !isModalOpen && !isDeleteModalOpen && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Modern List View */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500 bg-black border border-neutral-800 rounded-3xl">
            Memuat data...
          </div>
        ) : periodes.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 bg-black border border-neutral-800 rounded-3xl">
            Belum ada data periode. Silakan tambah baru.
          </div>
        ) : (
          periodes.map((p) => (
            <div 
              key={p.periodeId}
              onClick={() => router.push(`/admin/periode/${p.periodeId}`)}
              className="group bg-black border border-neutral-800 hover:border-orange-500/50 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-orange-500/50 transition-colors relative">
                  {p.gambarPeriode ? (
                    <img 
                      src={`/uploads/${p.gambarPeriode}`} 
                      alt={p.periode} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                    />
                  ) : (
                    <img 
                      src="/logo-hmsi.png" 
                      alt="Logo HMSI" 
                      className="w-8 h-8 object-contain opacity-50 grayscale" 
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                    {p.periode}
                  </h3>
                  {p.status === "Active" ? (
                    <span className="w-max px-2.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold tracking-wide">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="w-max px-2.5 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 rounded-lg text-xs font-semibold tracking-wide">
                      NON ACTIVE
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={(e) => openEditModal(p, e)}
                  className="p-2.5 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Edit Periode"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={(e) => openDeleteModal(p, e)}
                  className={`p-2.5 rounded-lg transition-colors ${p.status === 'Active' ? 'text-neutral-600 cursor-not-allowed opacity-50' : 'text-red-500/70 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20'}`}
                  title={p.status === 'Active' ? "Periode aktif tidak bisa dihapus" : "Hapus Periode"}
                  disabled={p.status === "Active"}
                >
                  <FaTrash size={16} />
                </button>
                <div className="hidden md:flex ml-2 w-10 h-10 items-center justify-center text-neutral-600 group-hover:text-orange-500 transition-colors">
                  <FaChevronRight size={20} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah/Edit Periode */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl my-auto flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800 shrink-0">
              <h3 className="text-xl font-bold text-white">
                {modalMode === "create" ? "Tambah Periode Baru" : "Edit Periode"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="periodeForm" onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Nama Periode <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPeriode}
                    onChange={(e) => setFormPeriode(e.target.value)}
                    placeholder="Contoh: 2026/2027"
                    className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Gambar Banner (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-500 cursor-pointer"
                    />
                  </div>
                  {previewUrl && (
                    <div className="mt-3 relative w-full h-48 md:h-48 rounded-xl overflow-hidden border border-neutral-700 bg-black flex items-center justify-center p-2">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {modalMode === "edit" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-300">
                      Status Periode <span className="text-orange-500">*</span>
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-all appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Non_Active">Non Active</option>
                    </select>
                  </div>
                )}

                {/* Replacement Options if deactivating */}
                {isDeactivatingActive && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-orange-400 font-semibold mb-1">Pilih Pengganti</h4>
                      <p className="text-xs text-neutral-400 mb-3">
                        Harus ada tepat 1 periode aktif. Silakan pilih pengganti dari periode yang dinonaktifkan ini:
                      </p>
                      
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 p-3 bg-black border border-neutral-800 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors">
                          <input 
                            type="radio" 
                            name="replacementType" 
                            checked={replacementType === "existing"}
                            onChange={() => setReplacementType("existing")}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm font-medium text-neutral-200">Aktifkan dari daftar periode</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-black border border-neutral-800 rounded-xl cursor-pointer hover:border-orange-500/50 transition-colors">
                          <input 
                            type="radio" 
                            name="replacementType" 
                            checked={replacementType === "new"}
                            onChange={() => setReplacementType("new")}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm font-medium text-neutral-200">Buat periode baru</span>
                        </label>
                      </div>
                    </div>

                    {replacementType === "existing" ? (
                      <div className="space-y-2 pt-2 border-t border-orange-500/20">
                        <label className="block text-xs font-medium text-neutral-400">
                          Pilih Periode Pengganti
                        </label>
                        <select
                          value={replacementPeriodeId}
                          onChange={(e) => setReplacementPeriodeId(e.target.value)}
                          className="w-full px-3 py-2.5 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-all"
                        >
                          <option value="">-- Pilih Periode --</option>
                          {periodes
                            .filter(p => p.periodeId !== selectedPeriode.periodeId)
                            .map(p => (
                              <option key={p.periodeId} value={p.periodeId}>{p.periode}</option>
                            ))}
                        </select>
                        {periodes.length <= 1 && (
                          <p className="text-xs text-red-400 mt-1">Tidak ada periode lain yang tersedia.</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2 border-t border-orange-500/20">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-neutral-400">
                            Nama Periode Baru <span className="text-orange-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newPeriodeName}
                            onChange={(e) => setNewPeriodeName(e.target.value)}
                            placeholder="Contoh: 2027/2028"
                            className="w-full px-3 py-2.5 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-neutral-400">
                            Gambar Banner Baru (Opsional)
                          </label>
                          <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleNewFileChange}
                            className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                          />
                          {newPeriodePreviewUrl && (
                            <div className="mt-2 h-20 w-32 rounded-lg overflow-hidden border border-neutral-700 bg-black flex items-center justify-center p-1">
                              <img src={newPeriodePreviewUrl} alt="Preview Baru" className="object-contain w-full h-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-neutral-800 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                form="periodeForm"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/30 disabled:opacity-70"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Periode */}
      {isDeleteModalOpen && selectedPeriode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hapus Periode?</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Apakah Anda yakin ingin menghapus periode <strong className="text-white">{selectedPeriode.periode}</strong>? Semua data divisi, proker, dan pengurus di dalamnya akan ikut terhapus permanen.
              </p>
              
              {errorMsg && (
                <div className="p-3 mb-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 disabled:opacity-70"
                >
                  {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
