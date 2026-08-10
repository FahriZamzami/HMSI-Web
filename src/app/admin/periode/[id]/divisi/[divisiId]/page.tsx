"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus, FaTimes, FaUserTie, FaBriefcase, FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";

interface DivisiInfo {
  divisiName: string;
  periode: {
    periode: string;
  };
}

interface Pengurus {
  pengurusId: number;
  role: string;
  pengurusName: string;
  nim: string;
  nomorAnggota: string;
  gambarPengurus: string;
}

interface Proker {
  prokerId: number;
  prokerName: string;
  deskripsi: string;
  pengurusProker?: { pengurusId: number, pengurus: Pengurus }[];
}

const ROLE_OPTIONS = [
  "Ketua Himpunan",
  "Wakil Ketua Himpunan",
  "Sekretaris Umum",
  "Bendahara Umum",
  "Kepala Divisi",
  "Sekretaris Divisi",
  "Bendahara Divisi",
  "Sekretaris Bendahara Divisi",
  "Staf Divisi"
];

export default function DetailDivisiPage({ params }: { params: Promise<{ id: string, divisiId: string }> }) {
  const router = useRouter();
  const { id, divisiId } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [divisiInfo, setDivisiInfo] = useState<DivisiInfo | null>(null);
  
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([]);
  const [prokerList, setProkerList] = useState<Proker[]>([]);
  const [takenRoles, setTakenRoles] = useState<string[]>([]);

  // States Pengurus
  const [isModalPengurusOpen, setIsModalPengurusOpen] = useState(false);
  const [pengurusMode, setPengurusMode] = useState<"create" | "edit">("create");
  const [selectedPengurus, setSelectedPengurus] = useState<Pengurus | null>(null);
  const [formPengurus, setFormPengurus] = useState({
    pengurusName: "", role: "Staf Divisi", nim: "", nomorAnggota: ""
  });
  const [formGambarPengurus, setFormGambarPengurus] = useState<File | null>(null);
  const [previewPengurusUrl, setPreviewPengurusUrl] = useState<string | null>(null);
  const [isSubmittingPengurus, setIsSubmittingPengurus] = useState(false);
  const [errorPengurus, setErrorPengurus] = useState("");

  // States Proker
  const [isModalProkerOpen, setIsModalProkerOpen] = useState(false);
  const [prokerMode, setProkerMode] = useState<"create" | "edit">("create");
  const [selectedProker, setSelectedProker] = useState<Proker | null>(null);
  const [formProker, setFormProker] = useState({ prokerName: "", deskripsi: "", picIds: [] as number[] });
  const [isSubmittingProker, setIsSubmittingProker] = useState(false);
  const [errorProker, setErrorProker] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Divisi Info
      const resDivisi = await fetch("/api/divisi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_by_id", payload: { divisiId } })
      });
      const dataDivisi = await resDivisi.json();
      if (resDivisi.ok && dataDivisi.data) setDivisiInfo(dataDivisi.data);

      // Fetch Pengurus
      const resPengurus = await fetch("/api/pengurus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_by_divisi", payload: { divisiId } })
      });
      const dataPengurus = await resPengurus.json();
      if (resPengurus.ok && dataPengurus.data) setPengurusList(dataPengurus.data);

      // Fetch Proker
      const resProker = await fetch("/api/proker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_by_divisi", payload: { divisiId } })
      });
      const dataProker = await resProker.json();
      if (resProker.ok && dataProker.data) setProkerList(dataProker.data);

      // Fetch Taken Global Roles
      const resRoles = await fetch("/api/pengurus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_taken_global_roles", payload: { periodeId: id } })
      });
      const dataRoles = await resRoles.json();
      if (resRoles.ok && dataRoles.data) setTakenRoles(dataRoles.data);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [divisiId]);

  // --- Handlers Pengurus ---
  const handleFilePengurus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        setErrorPengurus("Hanya gambar (JPG/PNG/WEBP) yang diperbolehkan.");
        e.target.value = "";
        return;
      }
      setFormGambarPengurus(file);
      setPreviewPengurusUrl(URL.createObjectURL(file));
      setErrorPengurus("");
    }
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const openCreatePengurus = () => {
    setPengurusMode("create");
    setSelectedPengurus(null);
    setFormPengurus({ pengurusName: "", role: "Staf Divisi", nim: "", nomorAnggota: "" });
    setFormGambarPengurus(null);
    setPreviewPengurusUrl(null);
    setErrorPengurus("");
    setIsModalPengurusOpen(true);
  };

  const openEditPengurus = (p: Pengurus) => {
    setPengurusMode("edit");
    setSelectedPengurus(p);
    setFormPengurus({
      pengurusName: p.pengurusName,
      role: p.role,
      nim: p.nim,
      nomorAnggota: p.nomorAnggota
    });
    setFormGambarPengurus(null);
    setPreviewPengurusUrl(`/uploads/${p.gambarPengurus}`);
    setErrorPengurus("");
    setIsModalPengurusOpen(true);
  };

  const submitPengurus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPengurus(true);
    setErrorPengurus("");

    try {
      const formData = new FormData();
      formData.append("action", pengurusMode === "edit" ? "update" : "create");
      formData.append("divisiId", divisiId);
      if (pengurusMode === "edit" && selectedPengurus) {
        formData.append("pengurusId", selectedPengurus.pengurusId.toString());
      }
      
      formData.append("pengurusName", formPengurus.pengurusName);
      formData.append("role", formPengurus.role);
      formData.append("nim", formPengurus.nim);
      formData.append("nomorAnggota", formPengurus.nomorAnggota);

      if (formGambarPengurus) formData.append("file", formGambarPengurus);

      const res = await fetch("/api/pengurus", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalPengurusOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorPengurus(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmittingPengurus(false);
    }
  };

  const deletePengurus = async (pengurusId: number) => {
    if (!confirm("Hapus pengurus ini?")) return;
    try {
      const res = await fetch("/api/pengurus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { pengurusId } })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers Proker ---
  const openCreateProker = () => {
    setProkerMode("create");
    setSelectedProker(null);
    setFormProker({ prokerName: "", deskripsi: "", picIds: [] });
    setErrorProker("");
    setIsModalProkerOpen(true);
  };

  const openEditProker = (p: Proker) => {
    setProkerMode("edit");
    setSelectedProker(p);
    setFormProker({ 
      prokerName: p.prokerName, 
      deskripsi: p.deskripsi,
      picIds: p.pengurusProker?.map((pp) => pp.pengurusId) || []
    });
    setErrorProker("");
    setIsModalProkerOpen(true);
  };

  const submitProker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProker(true);
    setErrorProker("");

    try {
      const res = await fetch("/api/proker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: prokerMode === "edit" ? "update" : "create",
          payload: {
            divisiId,
            ...(prokerMode === "edit" && selectedProker ? { prokerId: selectedProker.prokerId } : {}),
            ...formProker
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsModalProkerOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorProker(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmittingProker(false);
    }
  };

  const deleteProker = async (prokerId: number) => {
    if (!confirm("Hapus proker ini?")) return;
    try {
      const res = await fetch("/api/proker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { prokerId } })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };


  if (isLoading) {
    return <div className="p-12 text-center text-neutral-400">Memuat data divisi...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black p-6 rounded-3xl border border-neutral-800 shadow-lg">
        <button 
          onClick={() => router.push(`/admin/periode/${id}`)}
          className="w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors flex-shrink-0"
        >
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {divisiInfo?.divisiName || "Divisi"}
          </h2>
          <p className="text-orange-500 font-medium text-sm mt-1">
            Periode {divisiInfo?.periode.periode}
          </p>
        </div>
      </div>

      {/* SECTION: PENGURUS DIVISI */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
              <FaUserTie size={20} />
            </div>
            Pengurus Divisi
          </h3>
          <button
            onClick={openCreatePengurus}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/20"
          >
            <FaPlus size={12} /> Tambah Pengurus
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pengurusList.length === 0 ? (
            <div className="col-span-full p-6 text-center border border-neutral-800 rounded-2xl text-neutral-500">
              Belum ada pengurus di divisi ini.
            </div>
          ) : (
            pengurusList.map(p => (
              <div key={p.pengurusId} className="group bg-black border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-4 transition-all relative overflow-hidden h-full flex flex-col">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-700 flex-shrink-0">
                    {p.gambarPengurus ? (
                      <img src={`/uploads/${p.gambarPengurus}`} alt={p.pengurusName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <FaUserCircle className="w-full h-full p-2 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors break-all" title={p.pengurusName}>{p.pengurusName}</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-neutral-800 text-orange-500 text-xs font-medium rounded border border-neutral-700">
                      {p.role}
                    </span>
                    <p className="text-xs text-neutral-500 mt-2">NIM: {p.nim}</p>
                    <p className="text-xs text-neutral-500">No. Anggota: {p.nomorAnggota}</p>
                  </div>
                </div>
                {/* Hover Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditPengurus(p)} className="p-2 bg-neutral-800 hover:bg-orange-500 text-white rounded-lg shadow-md transition-colors" title="Edit">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => deletePengurus(p.pengurusId)} className="p-2 bg-neutral-800 hover:bg-red-500 text-white rounded-lg shadow-md transition-colors" title="Hapus">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION: PROGRAM KERJA */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
              <FaBriefcase size={20} />
            </div>
            Program Kerja
          </h3>
          <button
            onClick={openCreateProker}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            <FaPlus size={12} /> Tambah Proker
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {prokerList.length === 0 ? (
            <div className="col-span-full p-6 text-center border border-neutral-800 rounded-2xl text-neutral-500">
              Belum ada program kerja di divisi ini.
            </div>
          ) : (
            prokerList.map(p => (
              <div key={p.prokerId} className="group bg-black border border-neutral-800 hover:border-blue-500/40 rounded-2xl p-5 transition-all flex flex-col h-full relative overflow-hidden">
                <div className="flex-1 min-w-0 mb-4">
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 break-words line-clamp-2" title={p.prokerName}>{p.prokerName}</h4>
                  <p className="text-sm text-neutral-400 break-words whitespace-pre-wrap line-clamp-3" title={p.deskripsi}>{p.deskripsi}</p>
                </div>
                
                {/* Menampilkan PIC */}
                <div className="mb-4">
                  <span className="text-xs text-neutral-500 font-medium block mb-1">Person in Charge:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.pengurusProker && p.pengurusProker.length > 0 ? (
                      p.pengurusProker.map((pp) => (
                        <span key={pp.pengurusId} className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-[10px] text-neutral-300">
                          {pp.pengurus.pengurusName}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-neutral-600 italic">Belum ada PIC</span>
                    )}
                  </div>
                </div>
                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditProker(p)} className="p-2 bg-neutral-800 hover:bg-blue-500 text-white rounded-lg shadow-md transition-colors" title="Edit">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => deleteProker(p.prokerId)} className="p-2 bg-neutral-800 hover:bg-red-500 text-white rounded-lg shadow-md transition-colors" title="Hapus">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL PENGURUS */}
      {isModalPengurusOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">
                {pengurusMode === "create" ? "Tambah Pengurus" : "Edit Pengurus"}
              </h3>
              <button onClick={() => setIsModalPengurusOpen(false)} className="text-neutral-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={submitPengurus} className="p-6 space-y-4">
              {errorPengurus && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">{errorPengurus}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">Nama Lengkap <span className="text-orange-500">*</span></label>
                  <input type="text" required value={formPengurus.pengurusName} onChange={e => setFormPengurus({...formPengurus, pengurusName: toTitleCase(e.target.value)})} className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">Jabatan <span className="text-orange-500">*</span></label>
                  <select required value={formPengurus.role} onChange={e => setFormPengurus({...formPengurus, role: e.target.value})} className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none">
                    {ROLE_OPTIONS.map(opt => {
                      const isGlobal = ["Ketua Himpunan", "Wakil Ketua Himpunan", "Sekretaris Umum", "Bendahara Umum"].includes(opt);
                      if (isGlobal && takenRoles.includes(opt) && formPengurus.role !== opt) {
                        return null; // Sembunyikan jika role sudah diambil orang lain di periode ini
                      }

                      // Local division roles constraints
                      const takenLocalRoles = pengurusList.map(p => p.role);
                      const hasSekBend = takenLocalRoles.includes("Sekretaris Bendahara Divisi");
                      const hasSekDiv = takenLocalRoles.includes("Sekretaris Divisi");
                      const hasBenDiv = takenLocalRoles.includes("Bendahara Divisi");
                      
                      const isSinglePerDivisi = ["Kepala Divisi", "Sekretaris Divisi", "Bendahara Divisi", "Sekretaris Bendahara Divisi"].includes(opt);
                      if (isSinglePerDivisi && takenLocalRoles.includes(opt) && formPengurus.role !== opt) {
                        return null; // Cuman boleh ada 1 per divisi
                      }

                      if (formPengurus.role !== opt) {
                        if (opt === "Sekretaris Divisi" && hasSekBend) return null;
                        if (opt === "Bendahara Divisi" && hasSekBend) return null;
                        if (opt === "Sekretaris Bendahara Divisi" && (hasSekDiv || hasBenDiv)) return null;
                      }

                      return <option key={opt} value={opt}>{opt}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">NIM <span className="text-orange-500">*</span></label>
                  <input type="text" required value={formPengurus.nim} onChange={e => setFormPengurus({...formPengurus, nim: e.target.value})} className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">Nomor Anggota <span className="text-orange-500">*</span></label>
                  <input type="text" required value={formPengurus.nomorAnggota} onChange={e => setFormPengurus({...formPengurus, nomorAnggota: e.target.value})} className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-300">Pas Foto (Opsional)</label>
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFilePengurus} className="w-full px-3 py-2 bg-black border border-neutral-700 rounded-lg text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer" />
                {previewPengurusUrl && (
                  <div className="mt-2 h-24 w-24 rounded-lg overflow-hidden border border-neutral-700 bg-black flex items-center justify-center">
                    <img src={previewPengurusUrl} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalPengurusOpen(false)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={isSubmittingPengurus} className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-70">
                  {isSubmittingPengurus ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROKER */}
      {isModalProkerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h3 className="text-xl font-bold text-white">
                {prokerMode === "create" ? "Tambah Program Kerja" : "Edit Program Kerja"}
              </h3>
              <button onClick={() => setIsModalProkerOpen(false)} className="text-neutral-400 hover:text-white">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={submitProker} className="p-6 space-y-4">
              {errorProker && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">{errorProker}</div>}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-300">Judul Program Kerja <span className="text-blue-500">*</span></label>
                <input type="text" required value={formProker.prokerName} onChange={e => setFormProker({...formProker, prokerName: e.target.value})} className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-300">Deskripsi / Detail <span className="text-blue-500">*</span></label>
                <textarea required rows={3} value={formProker.deskripsi} onChange={e => setFormProker({...formProker, deskripsi: e.target.value})} className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl text-white focus:border-blue-500 outline-none resize-none"></textarea>
              </div>

              {/* Pemilihan PIC (Person In Charge) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-300">Person in Charge (Pengurus Divisi)</label>
                <div className="bg-black border border-neutral-700 rounded-xl max-h-40 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {pengurusList.length > 0 ? (
                    pengurusList.map((p) => {
                      const isChecked = formProker.picIds.includes(p.pengurusId);
                      return (
                        <label key={p.pengurusId} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isChecked ? 'bg-blue-900/30 border border-blue-500/30' : 'hover:bg-neutral-800 border border-transparent'}`}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={(e) => {
                              const newPicIds = e.target.checked 
                                ? [...formProker.picIds, p.pengurusId]
                                : formProker.picIds.filter(id => id !== p.pengurusId);
                              setFormProker({...formProker, picIds: newPicIds});
                            }}
                            className="w-4 h-4 rounded border-neutral-600 text-blue-500 focus:ring-blue-500 bg-neutral-900 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{p.pengurusName}</span>
                            <span className="text-[10px] text-neutral-400">{p.role}</span>
                          </div>
                        </label>
                      )
                    })
                  ) : (
                    <div className="text-center p-3 text-xs text-neutral-500">Tidak ada pengurus. Tambahkan pengurus terlebih dahulu.</div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalProkerOpen(false)} className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={isSubmittingProker} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-70">
                  {isSubmittingProker ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
