import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function Formulir() {
    const { data, setData, errors } = useForm({
        nama: "",
        email: "",
        nik:"",
        alamat:"",
        foto_ktp: null as File | null,
    });

   

    const [message, setMessage] = useState("");

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setData(e.target.name, e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, foto_ktp: e.target.files[0] });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Reset pesan sukses

        const formDataToSend = new FormData();
        formDataToSend.append("nama", data.nama);
        formDataToSend.append("email", data.email);
        formDataToSend.append("nik", data.nik);
        formDataToSend.append("alamat", data.alamat);
        if (data.foto_ktp) {
            formDataToSend.append("foto_ktp", data.foto_ktp);
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
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Formulir Pendaftaran</h2>
            {message && <p className="text-center text-red-500">{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                <div>
                    <label className="block text-gray-600">Nama</label>
                    <input
                        type="text"
                        name="nama"
                        placeholder="Nama Lengkap"
                        value={data.nama}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nama && <p className="text-red-500 text-sm">{errors.nama[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-600">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Alamat Email"
                        value={data.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-600">NIK</label>
                    <input
                        type="text"
                        name="nik"
                        placeholder="Nomor Induk Kependudukan"
                        value={data.nik}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nik && <p className="text-red-500 text-sm">{errors.nik[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-600">Alamat</label>
                    <textarea
                        name="alamat"
                        placeholder="Alamat Lengkap"
                        value={data.alamat}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat[0]}</p>}
                </div>

                <div>
                    <label className="block text-gray-600">Upload Foto KTP (Max 2MB)</label>
                    <input
                        type="file"
                        name="foto_ktp"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.foto_ktp && <p className="text-red-500 text-sm">{errors.foto_ktp[0]}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Daftar
                </button>
            </form>
        </div>
    );
}
