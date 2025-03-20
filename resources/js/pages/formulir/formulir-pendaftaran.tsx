import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

interface Wilayah {
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

    const [provinsi, setProvinsi] = useState<Wilayah[]>([]);
    const [kabupaten, setKabupaten] = useState<Wilayah[]>([]);
    const [kecamatan, setKecamatan] = useState<Wilayah[]>([]);
    const [kelurahan, setKelurahan] = useState<Wilayah[]>([]);
  
    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [selectedKabupaten, setSelectedKabupaten] = useState('');
    const [selectedKecamatan, setSelectedKecamatan] = useState('');
    const [selectedKelurahan, setSelectedKelurahan] = useState('');


    // const handleChange = (e: { target: { name: any; value: any; }; }) => {
    //     setData(e.target.name, e.target.value);
    // };

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

    // Ambil data provinsi saat pertama kali halaman dimuat
    useEffect(() => {
        axios.get(`/provinsi`)
        .then((response) => {
            setProvinsi(response.data);
        })
        .catch(() => {
        })
        .finally(() => {
        });
    }, []);

    // Ambil kabupaten berdasarkan provinsi yang dipilih
    useEffect(() => {
        if (selectedProvinsi) {
            axios.get(`/kabupaten/${selectedProvinsi}`)
            .then((response) => {
                setKabupaten(response.data);
            })
            .catch(() => {
            })
            .finally(() => {
            });
        }
    }, [selectedProvinsi]);

    // Ambil kecamatan berdasarkan kabupaten yang dipilih
    useEffect(() => {
        if (selectedKabupaten) {
            axios.get(`/kecamatan/${selectedKabupaten}`)
            .then((response) => {
                setKecamatan(response.data);
            })
            .catch(() => {
            })
            .finally(() => {
            });
        }
    }, [selectedKabupaten]);

    // Ambil kelurahan berdasarkan kecamatan yang dipilih
    useEffect(() => {
        if (selectedKecamatan) {
            axios.get(`/kelurahan/${selectedKecamatan}`)
            .then((response) => {
                setKelurahan(response.data);
            })
            .catch(() => {
            })
            .finally(() => {
            });
        }
    }, [selectedKecamatan]);


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
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Formulir Pendaftaran</h2>
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

