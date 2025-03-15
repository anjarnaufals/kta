import { useState } from "react";
import axios from "axios";

export default function DetailKta()  {
    const [nik, setNik] = useState("");
    const [formulir, setFormulir] = useState<any>(null);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setError("");
            const response = await axios.get(`/formulir-kta/${nik}`);
            setFormulir(response.data);
        } catch (err) {
            setFormulir(null);
            setError("Data tidak ditemukan");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 text-center">Cari KTA Berdasarkan NIK</h2>
                <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Masukkan NIK"
                    className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchData}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition duration-200"
                >
                    Cari
                </button>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {formulir && (
                    <div className="bg-gray-50 p-4 mt-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-gray-700">KTA</h3>
                        <p className="text-gray-600"><strong>Nama:</strong> {formulir.nama}</p>
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
            </div>
        </div>
    );
};

