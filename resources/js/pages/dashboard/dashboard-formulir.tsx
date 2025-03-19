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
            // const response = await fetch("formulir/export");
            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = "formulir.xlsx";
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
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
                <table className="w-full border-collapse shadow-lg bg-white rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3 text-left">Foto KTP</th>
                            <th className="p-3 text-left">Nama</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Nomor KTP</th>
                            <th className="p-3 text-left">Alamat</th>
                            <th className="p-3 text-left">QR Code</th>
                            <th className="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formulirs.map((f : Formulir, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3">
                                    <img 
                                        src={`/storage/${f.foto_ktp}`} 
                                        alt="Foto KTP" 
                                        className="w-16 h-16 rounded-md object-cover border" 
                                    />
                                </td>
                                <td className="p-3">{f.nama}</td>
                                <td className="p-3">{f.email}</td>
                                <td className="p-3">{f.nik}</td>
                                <td className="p-3">{f.alamat}</td>
                                <td className="p-3">
                                
                                    <img
                                        src={`/storage/qrcodes/${f.nik}.png`}
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
