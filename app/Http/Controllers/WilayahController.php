<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Models\Kelurahan;

class WilayahController extends Controller
{
    public function getProvinsi()
    {
        return response()->json(Provinsi::all());
    }

    public function getKabupaten($provinsi_id)
    {
        $kabupaten = Kabupaten::where('provinsi_id', $provinsi_id)->get();
        return response()->json($kabupaten);
    }

    public function getKecamatan($kabupaten_id)
    {
        $kecamatan = Kecamatan::where('kabupaten_id', $kabupaten_id)->get();
        return response()->json($kecamatan);
    }

    public function getKelurahan($kecamatan_id)
    {
        $kelurahan = Kelurahan::where('kecamatan_id', $kecamatan_id)->get();
        return response()->json($kelurahan);
    }
}
