import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import axios from "axios";

interface Formulir {
    id: number;
    nama: string;
    email: string;
    nik: number;
    alamat: string;
    foto_ktp: string;
    qr_code: string;
    foto_setengah_badan: string;
}   

export default function DashboardFormulir() {
    const [formulirs, setFormulirs] = useState([]);

    useEffect(() => {
        axios.get("/formulir").then((response) => {
            setFormulirs(response.data);
        });
    }, []);

    const handleEdit = (nik: number) => {
        console.log(`Edit data NIK: ${nik}`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
        try {
            await axios.delete(`/formulir/${id}`);
            setFormulirs(formulirs.filter((f:Formulir) => f.id !== id));
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get("/formulir-export", {
                responseType: "blob", 
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "formulir.xlsx";;
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    };

    return (
        <div className="container mx-auto m-16">
            <h2 className="text-2xl font-semibold mb-4 text-center">Dashboard Pendaftaran</h2>

            <button onClick={handleExport} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition mb-6">
                Export Excel
            </button>

      

            <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-lg bg-white rounded-lg min-w-max">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3 text-center  whitespace-nowrap">Foto KTP</th>
                            <th className="p-3 text-center  whitespace-nowrap">Foto Setengah Badan</th>
                            <th className="p-3 text-center  whitespace-nowrap">Nama</th>
                            <th className="p-3 text-center  whitespace-nowrap">Email</th>
                            <th className="p-3 text-center  whitespace-nowrap">Nomor KTP</th>
                            <th className="p-3 text-center  whitespace-nowrap">Ranting</th>
                            <th className="p-3 text-center  whitespace-nowrap">Jabatan</th>
                            <th className="p-3 text-center  whitespace-nowrap">Alamat</th>
                            <th className="p-3 text-center  whitespace-nowrap">QR Code</th>
                            <th className="p-3 text-center  whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formulirs.map((f : Formulir, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3">
                                    {f.foto_ktp ? (
                                        <img
                                            src={`/storage/${f.foto_ktp}`}
                                            alt="Foto KTP"
                                            className="w-20 h-20 rounded-md object-cover border mx-auto"
                                            
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center bg-gray-300 rounded-md w-20 h-20 dark:bg-gray-700 mx-auto">
                                            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                
                                <td className="p-3">
                                    {f.foto_setengah_badan ? (
                                        <img
                                            src={`/storage/${f.foto_setengah_badan}`}
                                            alt="Foto Setengah Badan"
                                            className="w-20 h-20 rounded-md object-cover border mx-auto"
                                            
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center bg-gray-300 rounded-md w-20 h-20 dark:bg-gray-700 mx-auto">
                                            <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                
                                <td className="p-3">{f.nama}</td>
                                <td className="p-3">{f.email}</td>
                                <td className="p-3">{f.nik}</td>
                                <td className="p-3">kosong</td>
                                <td className="p-3">kosong</td>
                                <td className="p-3">{f.alamat}</td>
                                <td className="p-3">
                                    <img
                                        src={`/storage/${f.qr_code}`}
                                        alt="QR Code"
                                        className="w-16 h-16"
                                    />
                              
                                </td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button 
                                        onClick={() => handleEdit(f.nik)} 
                                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(f.id)} 
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                    >
                                        Hapus
                                    </button>
                                    <Link
                                    href={route("detail-kta-by-nik", { nik: f.nik })}
                                    className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
