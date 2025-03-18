<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Kelurahan extends Model
{
    use HasFactory;
    protected $table = 'kelurahan';
    protected $fillable = ['kode', 'nama', 'kecamatan_id'];

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class);
    }
}
