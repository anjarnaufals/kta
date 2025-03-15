<?php

namespace App\Exports;

use App\Models\Formulir;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class FormulirExport extends \PhpOffice\PhpSpreadsheet\Cell\StringValueBinder  implements FromCollection, 
        WithHeadings, WithColumnFormatting,  WithDrawings, ShouldAutoSize, WithCustomValueBinder, WithEvents
{
    private $data;

    public function __construct()
    {
        $this->data = Formulir::all();
    }

    public function collection()
    {
        return $this->data->map(function ($formulir) {
            return [
                'id' => $formulir->id,
                'nama' => $formulir->nama,
                'email' => $formulir->email,
                'nik' => $formulir->nik, // Pakai tanda kutip agar tetap teks
                // 'nik' => "'" . $formulir->nik, // Pakai tanda kutip agar tetap teks
                'alamat' => $formulir->alamat,
                'foto_ktp' => '', // Kosongkan, nanti akan diisi gambar
                'qr_code' => '', // Kosongkan, nanti akan diisi qrcode
                'created_at' => $formulir->created_at->format('Y-m-d, H:i:s'),
            ];
        });
    }

    public function headings(): array
    {
        return ['ID', 'Nama', 'Email', 'NIK', 'Alamat', 'Foto KTP', 'QR CODE', 'Dibuat Pada'];
    }

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_TEXT, // Kolom "D" adalah NIK
        ];
    }

    public function drawings()
    {
        $drawings = [];
        foreach ($this->data as $index => $formulir) {
            if ($formulir->foto_ktp) {
                $drawing = new Drawing();
                $drawing->setName('Foto KTP');
                $drawing->setDescription('Foto KTP');
                $drawing->setPath(storage_path('app/public/' . $formulir->foto_ktp)); // Ambil gambar dari storage
                $drawing->setHeight(100);
                $drawing->setCoordinates('F' . ($index + 2)); // Kolom F (Foto KTP), mulai dari baris kedua
                $drawings[] = $drawing;
            }
            if ($formulir->nik) {
                $drawing = new Drawing();
                $drawing->setName('QR CODE');
                $drawing->setDescription('QR CODE');
                $drawing->setPath(storage_path('app/public/qrcodes/'.$formulir->nik.'.png')); // Ambil gambar dari storage
                $drawing->setHeight(100);
                $drawing->setCoordinates('G' . ($index + 2)); 
                $drawings[] = $drawing;
            }

        }
        return $drawings;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                foreach ($this->data as $index => $formulir) {
                    if ($formulir->foto_ktp) {
                        $row = $index + 2; // Mulai dari baris kedua (karena baris pertama adalah header)
                        $event->sheet->getDelegate()->getRowDimension($row)->setRowHeight(100);
                        $event->sheet->getColumnDimension('F')->setAutoSize(false);
                        $event->sheet->getColumnDimension('F')->setWidth(14);
                    }
                    if ($formulir->nik) {
                        $row = $index + 2; 
                        $event->sheet->getDelegate()->getRowDimension($row)->setRowHeight(100);
                        $event->sheet->getColumnDimension('G')->setAutoSize(false);
                        $event->sheet->getColumnDimension('G')->setWidth(14);
                    }
                  
                }
            },
        ];
    }
}
