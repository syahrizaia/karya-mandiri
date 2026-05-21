import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FiEdit2, FiLoader } from "react-icons/fi";

interface EditProjectDialogProps {
    job: IJobs;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const EditProjectDialog = ({ job, open, onOpenChange, onSuccess }: EditProjectDialogProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [, setJobs] = useState<IJobs[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [, setSelectedJob] = useState<{
        job: IJobs;
        action: "edit" | "delete";
    } | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const {data, error} = await supabase.from('jobs').select('*').order('posted_at', { ascending: false });
                if(error) {
                  console.error('Error fetching jobs:', error);
                } else {
                    setJobs(data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
    const getActiveUser = async () => {
      try {
        setLoading(true);
        // Cara mutakhir Supabase v2 untuk mengambil info user aktif
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const name = user.user_metadata?.full_name || user.email || "Pengguna";
          setUserName(name);
        }
      } catch (err) {
        console.error("Gagal memuat info user:", err);
      } finally {
        setLoading(false);
      }
    };

    getActiveUser();
  }, []);

    const EditProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData.entries());

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            return;
        }

        const projectData = {
        id: crypto.randomUUID(),
        title: rawData.title,
        employer: user.user_metadata?.full_name || "Pengguna KaryaMandiri", // Hidden data
        description: rawData.description,
        requirements: rawData.requirements, // Disimpan sebagai string murni
        deadline: rawData.deadline || null,
        category: rawData.category,
        type: rawData.type,
        location: rawData.location,
        reward: Number(rawData.reward),
        taken: 0, // Hidden data awal
        total: Number(rawData.total),
        posted_at: rawData.posted_at ? new Date(rawData.posted_at as string).toISOString() : new Date().toISOString(), // Hidden data
        status: rawData.status, // Hidden data default
        };

        try {
            const { error } = await supabase.from("jobs").update(projectData).eq("id", job.id);

            if (error) {
                throw error;
            }
            else {
                setJobs((prev) => prev.map((job) => job.id === job.id ? { ...job, ...projectData } as IJobs : job));
                toast.success("Proyek berhasil diedit!");
                setSelectedJob(null);
                onSuccess();
                router.refresh();
            }
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Gagal mengedit proyek. Periksa koneksi atau database.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            // open={selectedJob !== null && selectedJob.action === "edit"}
            // onOpenChange={(open) => {
            //     if (!open) {
            //         setSelectedJob(null);
            //     }
            // }}
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200"
                    onClick={() => setSelectedJob({ job, action: "edit" })}
                >
                    <FiEdit2 />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white border-none shadow-2xl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black text-slate-900">Edit Proyek</DialogTitle>
                    <p className="text-slate-500 text-sm italic">Employer: {loading ? <FiLoader className="animate-spin inline text-blue-600" /> : userName}</p>
                    <DialogDescription className="mt-4 text-slate-600">
                        Apakah Anda yakin ingin mengedit proyek <strong>{job.title}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={EditProject} className="space-y-6">
                    {/* Baris 1: Judul */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400">Judul Proyek</label>
                        <input
                            type='text'
                            name="title"
                            required
                            placeholder="Contoh: Pengumpulan Data Foto UMKM"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            defaultValue={job.title}
                        />
                    </div>

                    {/* Baris 2: Deskripsi */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400">Deskripsi Tugas</label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
                            defaultValue={job.description}
                        ></textarea>
                    </div>

                    {/* Baris 3: Requirements */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400">Persyaratan (Gunakan baris baru untuk poin-poin)</label>
                        <textarea
                            name="requirements"
                            placeholder="1. Memiliki HP Android&#10;2. Domisili Bekasi"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
                            defaultValue={job.requirements}
                        ></textarea>
                    </div>

                    {/* Baris 4: Lokasi & Kategori (Grid 2 Kolom) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Kategori</label>
                            <select
                                name="category"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white"
                                defaultValue={job.category}
                            >
                                <option value="Produksi">Produksi</option>
                                <option value="Logistik">Logistik</option>
                                <option value="Jasa">Jasa</option>
                                <option value="Konstruksi">Konstruksi</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Lokasi</label>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="Contoh: Remote / Jakarta"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                                defaultValue={job.location}
                            />
                        </div>
                    </div>

                    {/* Baris 5: Type & Reward */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Tipe Proyek</label>
                            <select
                                name="type"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white"
                                defaultValue={job.type}
                            >
                                <option value="Crowdsourcing">Crowdsourcing</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Upah (Rp)</label>
                            <input
                                name="reward"
                                type="number"
                                required
                                placeholder="Contoh: 50000"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                                defaultValue={job.reward}
                            />
                        </div>
                    </div>

                    {/* Baris 6: Total Kuota & Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Total Kuota Pekerja</label>
                            <input 
                                name="total" 
                                type="number" 
                                required 
                                placeholder="Jumlah orang" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none"
                                defaultValue={job.total}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Status Pekerjaan</label>
                            <select
                                name="status"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white font-medium"
                                defaultValue={job.status || "active"}
                            >
                                <option value="active" className="text-blue-600">ACTIVE (Berjalan)</option>
                                <option value="pending" className="text-orange-600">PENDING (Ditunda)</option>
                                <option value="completed" className="text-green-600">COMPLETED (Selesai)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400">Batas Akhir (Deadline)</label>
                            <input 
                                name="deadline" 
                                type="datetime-local"
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-slate-700" 
                                defaultValue={job.deadline}
                            />
                        </div>
                        <input 
                            name="posted_at" 
                            type="datetime-local"
                            // defaultValue={new Date().toISOString().slice(0, 16)} // Set default ke waktu sekarang
                            hidden
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex items-center gap-2 disabled:bg-green-300"
                        >
                            {loading ? <FiLoader className="animate-spin" /> : "Edit Proyek"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProjectDialog;