<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormulirApiController;
use App\Http\Controllers\WilayahController;

Route::get('/formulir', [FormulirApiController::class, 'index'])->name('formulir.index');
Route::post('/formulir', [FormulirApiController::class, 'store'])->name('formulir.store');
Route::get('/formulir/{id}', [FormulirApiController::class, 'show'])->name('formulir.show');
Route::put('/formulir/{id}', [FormulirApiController::class, 'update'])->name('formulir.update'); 
Route::delete('/formulir/{id}', [FormulirApiController::class, 'destroy'])->name('formulir.delete');
Route::get('/formulir-export', [FormulirApiController::class, 'export'])->name('formulir.export');
Route::get('/formulir-kta/{nik}', [FormulirApiController::class, 'detailByNik'])->name('formulir.kta');
//
Route::get('/provinsi', [WilayahController::class, 'getProvinsi']);
Route::get('/kabupaten/{provinsi_id}', [WilayahController::class, 'getKabupaten']);
Route::get('/kecamatan/{kabupaten_id}', [WilayahController::class, 'getKecamatan']);
Route::get('/kelurahan/{kecamatan_id}', [WilayahController::class, 'getKelurahan']);

