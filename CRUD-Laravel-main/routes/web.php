<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\VilleController;

/********************
 *  🔹 Routes Web  *
 ********************/
Route::get('/', function () {
    return redirect()->route('utilisateurs.index');
});

// 🔹 CRUD utilisateurs
Route::resource('utilisateurs', UtilisateurController::class);

// 🔹 CRUD villes
Route::resource('villes', VilleController::class);