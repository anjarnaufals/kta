<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Jabatan;

class JabatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jabatans = [
            ['nama' => 'KETUA'],
            ['nama' => 'ORGANISASI KADERISASI KEANGGOTAAN (OKK)'],
            ['nama' => 'WAKIL KETUA'],
            ['nama' => 'SEKRETARIS'],
            ['nama' => 'WAKIL SEKRETARIS'],
            ['nama' => 'BENDAHARA'],
            ['nama' => 'WAKIL BENDAHARA'],
            ['nama' => 'STAFF / ANGGOTA'],
            ['nama' => 'JABATAN LAINNYA'],
        ];

        foreach ($jabatans as $jabatan) {
            Jabatan::create($jabatan);
        }
    }
}
