<?php

use Illuminate\Support\Facades\Route;

// El frontend (public/index.html, script.js, api.js) se sirve como archivos
// estáticos directamente por el servidor web (ver docker/nginx/default.conf,
// que prioriza index.html). Esta ruta solo existe como respaldo si Laravel
// llega a atender la raíz "/" (por ejemplo corriendo con `php artisan serve`
// sin nginx delante).
Route::get('/', function () {
    return file_exists(public_path('index.html'))
        ? response()->file(public_path('index.html'))
        : view('welcome');
});
