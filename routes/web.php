<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard-formulir', function () {
        return Inertia::render('dashboard/dashboard-formulir');
    })->name('dashboard-formulir');
});

Route::get('formulir-pendaftaran', function () {
    return Inertia::render('formulir/formulir-pendaftaran');
})->name('formulir-pendaftaran');

Route::get('detail-kta', function () {
    return Inertia::render('kta/detail-kta');
})->name('detail-kta');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';

