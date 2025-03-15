import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

export default function DetailKtaByNik() {
    const { props } = usePage();
    const nik = props.nik;

    const [formulir, setFormulir] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nik) {
            setError("NIK tidak ditemukan.");
            setLoading(false);
            return;
        }

        axios.get(`/formulir-kta/${nik}`)
            .then((response) => {
                setFormulir(response.data);
                setError(null);
            })
            .catch(() => {
                setError("Data tidak ditemukan atau terjadi kesalahan.");
                setFormulir(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [nik]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Detail KTA</h2>

                {loading && <p className="text-gray-500">Memuat data...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {formulir && (
                    <div className="bg-gray-50 p-4 mt-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-gray-700">{formulir.nama}</h3>
                        <p className="text-gray-600"><strong>Email:</strong> {formulir.email}</p>
                        <p className="text-gray-600"><strong>Alamat:</strong> {formulir.alamat}</p>

                        {formulir.foto_ktp && (
                            <div className="mt-4">
                                <img
                                    src={`/storage/${formulir.foto_ktp}`}
                                    alt="Foto KTP"
                                    className="w-full max-w-xs rounded-lg shadow"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6">
                    <button 
                        onClick={() => window.history.back()} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
