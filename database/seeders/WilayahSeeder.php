<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Models\Kelurahan;

class WilayahSeeder extends Seeder
{
    public function run()
    {
        // Import Provinsi
        $provinsiJson = Storage::disk('public')->get('json/provinsi.json');
        $provinsiData = json_decode($provinsiJson, true);

        foreach ($provinsiData as $kode => $nama) {
            $provinsi = Provinsi::create([
                'kode' => $kode,
                'nama' => $nama
            ]);

            // Import Kabupaten berdasarkan kode provinsi
            $kabupatenPath = "json/kab-{$kode}.json";
            if (Storage::disk('public')->exists($kabupatenPath)) {
                $kabupatenJson = Storage::disk('public')->get($kabupatenPath);
                $kabupatenData = json_decode($kabupatenJson, true);

                foreach ($kabupatenData as $kode_kab => $nama_kab) {
                    $kabupaten = Kabupaten::create([
                        'kode' => "{$kode}-{$kode_kab}",
                        'nama' => $nama_kab,
                        'provinsi_id' => $provinsi->id
                    ]);

                    // Import Kecamatan berdasarkan kode provinsi & kabupaten
                    $kecamatanPath = "json/kec-{$kode}-{$kode_kab}.json";
                    if (Storage::disk('public')->exists($kecamatanPath)) {
                        $kecamatanJson = Storage::disk('public')->get($kecamatanPath);
                        $kecamatanData = json_decode($kecamatanJson, true);

                        foreach ($kecamatanData as $kode_kec => $nama_kec) {
                            $kecamatan = Kecamatan::create([
                                'kode' => "{$kode}-{$kode_kab}-{$kode_kec}",
                                'nama' => $nama_kec,
                                'kabupaten_id' => $kabupaten->id
                            ]);

                            // Import Kelurahan berdasarkan kode provinsi, kabupaten, & kecamatan
                            $kelurahanPath = "json/keldesa-{$kode}-{$kode_kab}-{$kode_kec}.json";
                            if (Storage::disk('public')->exists($kelurahanPath)) {
                                $kelurahanJson = Storage::disk('public')->get($kelurahanPath);
                                $kelurahanData = json_decode($kelurahanJson, true);

                                foreach ($kelurahanData as $kode_kel => $nama_kel) {
                                    Kelurahan::create([
                                        'kode' => "{$kode}-{$kode_kab}-{$kode_kec}-{$kode_kel}",
                                        'nama' => $nama_kel,
                                        'kecamatan_id' => $kecamatan->id
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
