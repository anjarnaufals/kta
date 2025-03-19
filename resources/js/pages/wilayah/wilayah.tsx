import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "@inertiajs/react";


interface Wilayah {
    id: string;
    nama: string;
  }


export default function Formulir() {
    const [provinsi, setProvinsi] = useState<Wilayah[]>([]);
    const [kabupaten, setKabupaten] = useState<Wilayah[]>([]);
    const [kecamatan, setKecamatan] = useState<Wilayah[]>([]);
    const [kelurahan, setKelurahan] = useState<Wilayah[]>([]);

    //
    const [kecByKotaSukabumi, setKecByKotaSukabumi] = useState<Wilayah[]>([]);
    const [kelByKecKotaSukabumi, setKelByKecKotaSukabumi] = useState<Wilayah[]>([]);
    const [selectedKecByKotaSukabumi, setSelectedKecByKotaSukabumi] = useState('');
    const [selectedKelByKecKotaSukabumi, setSelectedKelByKecKotaSukabumi] = useState('');
    const [namaKecTerpiih, setNamaKec] = useState('');
    const [namaKelTerpiih, setNamaKel] = useState('');
    //

    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [selectedKabupaten, setSelectedKabupaten] = useState('');
    const [selectedKecamatan, setSelectedKecamatan] = useState('');
    const [selectedKelurahan, setSelectedKelurahan] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("sukses");
        return;
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


    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-16">

            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">DPC KOTA SUKABUMI</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                
                

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
                    
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-6 mb-2">
                    Submit
                </button>
            </form>
        </div>
    );
}