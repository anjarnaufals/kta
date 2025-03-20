<?php

namespace App\Http\Controllers;

use App\Models\Jabatan;
use Illuminate\Http\Request;

class JabatanController extends Controller
{
    // Menampilkan semua jabatan
    public function index()
    {
        $jabatans = Jabatan::all();
        
        return response()->json($jabatans);
    }

    // Menyimpan jabatan baru
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|unique:jabatans,nama|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $jabatan = Jabatan::create($request->all());

        return response()->json(['message' => 'Jabatan berhasil ditambahkan', 'data' => $jabatan], 201);
    }

    // Menampilkan detail jabatan berdasarkan ID
    public function show(Jabatan $jabatan)
    {
        return response()->json($jabatan);
    }

    // Mengupdate jabatan berdasarkan ID
    public function update(Request $request, Jabatan $jabatan)
    {
        $request->validate([
            'nama' => 'required|max:255|unique:jabatans,nama,' . $jabatan->id,
            'deskripsi' => 'nullable|string',
        ]);

        $jabatan->update($request->all());

        return response()->json(['message' => 'Jabatan berhasil diperbarui', 'data' => $jabatan]);
    }

    // Menghapus jabatan berdasarkan ID
    public function destroy(Jabatan $jabatan)
    {
        $jabatan->delete();

        return response()->json(['message' => 'Jabatan berhasil dihapus']);
    }
}