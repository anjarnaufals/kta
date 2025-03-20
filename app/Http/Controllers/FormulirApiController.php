<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formulir;
use App\Exports\FormulirExport;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class FormulirApiController extends Controller
{
    //
    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:formulirs,email',
            'nik' => 'required|digits:16|unique:formulirs,nik',
            'alamat' => 'nullable|string',
            'foto_ktp' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('foto_ktp')) {
            $nik = $validated['nik']; // Ambil NIK dari inputan
            $filename = "ktp_{$nik}_img." . $request->file('foto_ktp')->getClientOriginalExtension();

            $validated['foto_ktp'] = $request->file('foto_ktp')->storeAs('uploads', $filename, 'public');
        }

        $qrCodePath = 'qrcodes/qrcode_' . $request->nik . '_img.png';
        $qrCodeContent = route('detail-kta-by-nik', ['nik' => $request->nik]);

        Storage::disk('public')->put($qrCodePath, QrCode::format('png')->size(200)->generate($qrCodeContent));
        $validated['qr_code']=$qrCodePath;

        
        $formulir = Formulir::create($validated);

        return response()->json(['message' => 'Pendaftaran berhasil!', 'data' => $formulir]);
    }

    public function index()
    {
        return response()->json(Formulir::all());
    }

    public function show($id)
    {
        $formulir = Formulir::find($id);
        if (!$formulir) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($formulir);
    }

    public function update(Request $request, $id)
    {
        $formulir = Formulir::find($id);
        if (!$formulir) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:formulirs,email,' . $id,
            'nik' => 'sometimes|required|digits:16|unique:formulirs,nik,' . $id,
            'alamat' => 'nullable|string',
            'foto_ktp' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Jika ada file foto baru, hapus yang lama
        if ($request->hasFile('foto_ktp')) {
            if ($formulir->foto_ktp) {
                Storage::disk('public')->delete($formulir->foto_ktp);
            }
            $validated['foto_ktp'] = $request->file('foto_ktp')->store('uploads', 'public');
        }

        $formulir->update($validated);

        return response()->json(['message' => 'Data berhasil diperbarui!', 'data' => $formulir]);
    }

    public function destroy($id)
    {
        $formulir = Formulir::find($id);
        if (!$formulir) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        if ($formulir->foto_ktp) {
            Storage::disk('public')->delete($formulir->foto_ktp);
        }

        $qr_code_path = 'qrcodes/'.$formulir->nik.'.png';

        Storage::disk('public')->delete($qr_code_path);
        

        $formulir->delete();

        return response()->json(['message' => 'Data berhasil dihapus!']);
    }

    public function export()
    {
        return Excel::download(new FormulirExport, 'formulir.xlsx');
    }

    public function detailByNik($nik)
    {
        $formulir = Formulir::where('nik', $nik)->first();

        if (!$formulir) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($formulir);
    }
}
