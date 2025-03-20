import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

interface Wilayah {
    id: string;
    nama: string;
  }

interface Jabatan {
    id: string;
    nama: string;
  }

export default function Formulir() {
    const { data, setData } = useForm({
        nama: "",
        email: "",
        nik:"",
        alamat:"",
        foto_ktp: null as File | null,
        foto_setengah_badan: null as File | null,
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const fileInputRefKtp = useRef<HTMLInputElement | null>(null);
    const fileInputRefFotoSetengahBadan = useRef<HTMLInputElement | null>(null);


    const validateForm = () => {
        const insideFormError: Record<string, string> = {};
    
        if (!data.nama.trim()) insideFormError.nama = "Nama tidak boleh kosong";
        if (!data.email.trim()) insideFormError.email = "Email tidak boleh kosong";
        if (!data.nik.trim()) insideFormError.nik = "NIK tidak boleh kosong";
        if (!data.alamat.trim()) insideFormError.alamat = "Alamat tidak boleh kosong";
        if (!data.foto_ktp) insideFormError.foto_ktp = "Foto KTP wajib diunggah";
        if (!data.foto_setengah_badan) insideFormError.foto_setengah_badan = "Foto Setengah Badan wajib diunggah";

        setFormErrors(insideFormError);

        return Object.keys(insideFormError).length === 0; // Return true jika tidak ada error
    };

    const [previewKTP, setPreviewKTP] = useState<string | null>(null);
    const [previewSETENGAHBADAN, setpreviewSETENGAHBADAN] = useState<string | null>(null);

    const [kecByKotaSukabumi, setKecByKotaSukabumi] = useState<Wilayah[]>([]);
    const [kelByKecKotaSukabumi, setKelByKecKotaSukabumi] = useState<Wilayah[]>([]);
    const [selectedKecByKotaSukabumi, setSelectedKecByKotaSukabumi] = useState('');
    const [selectedKelByKecKotaSukabumi, setSelectedKelByKecKotaSukabumi] = useState('');
    const [namaKecTerpiih, setNamaKec] = useState('');
    const [namaKelTerpiih, setNamaKel] = useState('');

    const [jabatanList, setListJabatan] = useState<Jabatan[]>([]);
    const [jabatanSelected, setJabatanSelected] = useState('');
    const [jabatanNamaSelected, setJabatanNamaSelected] = useState('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const fieldName = e.target.name as keyof typeof data; // 👈 Konversi name ke tipe yang benar
        setData(fieldName, e.target.value);
    }

    const handleFileChangeKTP = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {

             // Validasi ukuran file (maksimal 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB

           

            if (e.target.files[0].size > maxSize) {
                setFormErrors((prev) => ({ ...prev, foto_ktp: "Ukuran file maksimal 2MB" }));
                setData({ ...data, foto_ktp: null });
                setPreviewKTP(null);
                if (fileInputRefKtp.current) {
                    fileInputRefKtp.current.value = ""; // Reset input file
                }
                return;
            }

            // Reset error jika valid
            setFormErrors((prev) => ({ ...prev, foto_ktp: "" }));

            setData({ ...data, foto_ktp: e.target.files[0] });
            setPreviewKTP(URL.createObjectURL(e.target.files[0])); 
        }
    };

    const handleFileChangeFOTOSETENGAHBADAN = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {

             // Validasi ukuran file (maksimal 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB

           

            if (e.target.files[0].size > maxSize) {
                setFormErrors((prev) => ({ ...prev, foto_setengah_badan: "Ukuran file maksimal 2MB" }));
                setData({ ...data, foto_ktp: null });
                setpreviewSETENGAHBADAN(null);
                if (fileInputRefFotoSetengahBadan.current) {
                    fileInputRefFotoSetengahBadan.current.value = ""; // Reset input file
                }
                return;
            }

            // Reset error jika valid
            setFormErrors((prev) => ({ ...prev, foto_setengah_badan: "" }));

            setData({ ...data, foto_setengah_badan: e.target.files[0] });
            setpreviewSETENGAHBADAN(URL.createObjectURL(e.target.files[0])); 
        }
    };

    // Ambil kecamatan berdasarkan kota sukabumi
    useEffect(() => {
        axios.get(`/jabatan`)
        .then((response) => {
            setListJabatan(response.data);
        })
        .catch(() => {
        })
        .finally(() => {
        });
    }, []);

    // Ambil kecamatan berdasarkan kota sukabumi
    useEffect(() => {
        axios.get(`/kecamatan/180`)
        .then((response) => {
            setKecByKotaSukabumi(response.data);
        })
        .catch(() => {
        })
        .finally(() => {
        });
    }, []);

    // Ambil kelurahan berdasarkan kecamatan yang dipilih dalam kota sukabumi
    useEffect(() => {
        if (selectedKecByKotaSukabumi) {
            axios.get(`/kelurahan/${selectedKecByKotaSukabumi}`)
            .then((response) => {
                setKelByKecKotaSukabumi(response.data);
            })
            .catch(() => {
            })
            .finally(() => {
            });
        }
    }, [selectedKecByKotaSukabumi]);


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setMessage(""); 


        if (!validateForm()) {
            return;
        }
        

        const formDataToSend = new FormData();
        formDataToSend.append("nama", data.nama);
        formDataToSend.append("email", data.email);
        formDataToSend.append("nik", data.nik);
        formDataToSend.append("alamat", data.alamat);

        if (data.foto_ktp) {
            formDataToSend.append("foto_ktp", data.foto_ktp);
        }

        if (data.foto_setengah_badan) {
            formDataToSend.append("foto_setengah_badan", data.foto_setengah_badan);
        }


        try {
            await axios.post("/formulir", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Pendaftaran berhasil!");
            setData({ 
                nama: "", 
                email: "", 
                nik: "", 
                alamat: "" , 
                foto_ktp:null,
                foto_setengah_badan:null,
            });

            setPreviewKTP(null);
            setpreviewSETENGAHBADAN(null);

            if (fileInputRefFotoSetengahBadan.current) {
                fileInputRefFotoSetengahBadan.current.value = ""; 
            }

            if (fileInputRefKtp.current) {
                fileInputRefKtp.current.value = ""; 
            }

        } catch (error: any) {
            if (error.response) {
                setMessage(JSON.stringify(error.response.data));
            } else {
                setMessage(String(error));
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-16">

            <h1 className="text-2xl font-semibold text-gray-700 mb-4 text-center">GRIB JAYA DPC KOTA SUKABUMI</h1>
            <h4 className="text-2xl font-semibold text-gray-600 mb-4 text-center">Formulir Pendaftaran</h4>
            {message && <p className="text-center text-red-500">{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                <div>
                    <label className="block text-gray-600 font-medium mb-1">Nama<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="nama"
                        placeholder="Nama Lengkap"
                        value={data.nama}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.nama && <p className="text-red-500 text-sm">{formErrors.nama}</p>}
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1">Email<span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Alamat Email"
                        value={data.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1">NIK<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="nik"
                        placeholder="Nomor Induk Kependudukan"
                        value={data.nik}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.nik && <p className="text-red-500 text-sm">{formErrors.nik}</p>}
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1">Alamat<span className="text-red-500">*</span></label>
                    <textarea
                        name="alamat"
                        placeholder="Alamat Lengkap"
                        value={data.alamat}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    {formErrors.alamat && <p className="text-red-500 text-sm">{formErrors.alamat}</p>}
                </div>

               

                {/* Kecamatan berdasarkan kota sukabumi */}
                <div className="mb-4">
                    <label className="block text-gray-600 font-medium mb-1">PAC (Kecamatan)</label>
                    <select
                    value={selectedKecByKotaSukabumi}
                    onChange={(e) => {
                        setSelectedKecByKotaSukabumi(e.target.value);
                        const selected = kecByKotaSukabumi.find((p) => String(p.id) === e.target.value);
                        setNamaKec(selected?.nama ?? '');
                    } } 
                   
                    className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    >
                    <option value="">-- Pilih PAC --</option>
                    {kecByKotaSukabumi.map((kec) => (
                        <option key={kec.id} value={kec.id}>
                        {kec.nama}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Kelurahan/Desa berdasarkan salah satu kecamatan di kota sukabumi*/}
                <div className="mb-4">
                    <label className="block text-gray-600 font-medium mb-1">RANTING (Kelurahan)</label>
                    <select
                    value={selectedKelByKecKotaSukabumi}
                    onChange={(e) => {
                        setSelectedKelByKecKotaSukabumi(e.target.value);
                        const selected = kelByKecKotaSukabumi.find((p) => String(p.id) === e.target.value);
                        setNamaKel(selected?.nama ?? '');
                    }}
                    disabled={!selectedKecByKotaSukabumi}
                    className={`w-full px-3 py-2 border rounded-lg ${
                        selectedKecByKotaSukabumi ? "focus:ring focus:ring-blue-300" : "bg-gray-100 cursor-not-allowed"
                    }`}
                    >
                    <option value="">-- Pilih RANTING --</option>
                    {kelByKecKotaSukabumi.map((kel) => (
                        <option key={kel.id} value={kel.id}>
                        {kel.nama}
                        </option>
                    ))}
                    </select>
                </div>

                {namaKecTerpiih && namaKelTerpiih && <p className="text-center text-black-500 font-bold">DPC KOTA SUKABUMI, PAC {namaKecTerpiih}, RANTING {namaKelTerpiih}</p>}

                 {/* Jabatan */}
                 <div className="mb-4">
                    <label className="block text-gray-600 font-medium mb-1">Pilih Jabatan</label>
                    <select
                    value={jabatanSelected}
                    onChange={(e) => {
                        setJabatanSelected(e.target.value);
                        const selected = jabatanList.find((p) => String(p.id) === e.target.value);
                        setJabatanNamaSelected(selected?.nama ?? '');
                    } } 
                   
                    className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    >
                    <option value="">-- Pilih Jabatan --</option>
                    {jabatanList.map((jabatan) => (
                        <option key={jabatan.id} value={jabatan.id}>
                        {jabatan.nama}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1">Upload Foto KTP (Max 2MB)<span className="text-red-500">*</span></label>
                    <input
                        type="file"
                        name="foto_ktp"
                        accept="image/*"
                        onChange={handleFileChangeKTP}
                        ref={fileInputRefKtp}
                        className="w-full border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-green-500 file:px-4 file:py-2 file:text-white file:mr-4"
                    />
                    {formErrors.foto_ktp && <p className="text-red-500 text-sm">{formErrors.foto_ktp}</p>}
                </div>

                {previewKTP && (
                    <div className="mt-4 mb-4">
                        <p className="text-sm text-gray-600">Preview KTP</p>
                        <img src={previewKTP} alt="Preview KTP" className="mt-2 h-80 rounded-lg border w-full object-cover md:object-contain" />
                    </div>
                )}

                <div>
                    <label className="block text-gray-600 font-medium mb-1 mt-4">Upload Foto Setengah Badan (Max 2MB)<span className="text-red-500">*</span></label>
                    <input
                        type="file"
                        name="foto_setengah_badan"
                        accept="image/*"
                        onChange={handleFileChangeFOTOSETENGAHBADAN}
                        ref={fileInputRefFotoSetengahBadan}
                        className="w-full border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-green-500 file:px-4 file:py-2 file:text-white file:mr-4"
                    />
                    {formErrors.foto_setengah_badan && <p className="text-red-500 text-sm">{formErrors.foto_setengah_badan}</p>}
                </div>

                {previewSETENGAHBADAN && (
                    <div className="mt-4 mb-4">
                        <p className="text-sm text-gray-600">Preview Foto Setengah Badan</p>
                        <img src={previewSETENGAHBADAN} alt="Preview KTP" className="mt-2 h-80 rounded-lg border w-full md:object-contain" />
                    </div>
                )}

                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-6 mb-2">
                    Daftar
                </button>
            </form>
        </div>
    );
}
function setError(newErrors: any) {
    throw new Error("Function not implemented.");
}

