1.RUN :composer create-project laravel/laravel my-app
2.RUN :chmod -R 775 storage bootstrap/cache //for linux
3.RUN :php artisan migrate
4.RUN :composer require laravel/sanctum
5.RUN : php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
6.php artisan migrate
7.config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:5173,127.0.0.1:5173')),
8.👉 .env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
9.👉 config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'supports_credentials' => true,
10.🚀 Enable middleware
👉 app/Http/Kernel.php

Make sure:

\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

is inside api middleware group.

11. to upload file : php artisan storage:link
