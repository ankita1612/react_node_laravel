1. Install Sanctum

Run:

composer require laravel/sanctum

Publish config:

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

Run migration:

php artisan migrate

2.Update config/cors.php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'], // React URL

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

3. Update .env
   SESSION_DRIVER=file
   SESSION_DOMAIN=localhost

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

4. Update config/sanctum.php

Check this:

'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS')),

5. Add Middleware

In Laravel 11 open:

bootstrap/app.php

Add:

->withMiddleware(function ($middleware) {
$middleware->statefulApi();
})

6. Use Routes in routes/api.php
   use App\Http\Controllers\AuthController;
   use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/registration', [AuthController::class, 'registration']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [AuthController::class, 'profile']);

    Route::post('/logout', [AuthController::class, 'logout']);

});

7.  Update Your Login Method
    public function login(Request $request)
{
$credentials = $request->validate([
    'email' => 'required|email',
    'password' => 'required'
    ]);

                            if (!Auth::attempt($credentials)) {
                                return response()->json([
                                    'success' => false,
                                    'message' => 'Invalid credentials'
                                ], 401);
                            }

                            $request->session()->regenerate();

                            return response()->json([
                                'success' => true,
                                'message' => 'Login successful',
                                'data' => Auth::user()
                            ]);

}

8. React Axios Setup

Create axios instance:

import axios from "axios";

const apiClient = axios.create({
baseURL: "http://127.0.0.1:8000",
withCredentials: true,
});

export default apiClient;

9. Before Login Call CSRF Cookie

Very important.

await apiClient.get("/sanctum/csrf-cookie");

await apiClient.post("/api/login", {
email,
password,
});

10. Profile API Call
    const response = await apiClient.get("/api/profile"); 11. Logout
    await apiClient.post("/api/logout");
