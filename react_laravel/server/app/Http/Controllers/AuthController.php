<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $credentials = $request->only('email', 'password');

        // Attempt login with session
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Regenerate session to prevent session fixation
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => Auth::user()
            ]
        ], 200);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user()
            ]
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function registration(Request $request)
    {
        try {
            // Validation
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'password' => 'required|min:6',
                'DOB' => 'nullable|date',
                'profile_image' => 'nullable|string'
            ]);

            // Create user
            $user = User::create([
                'name' => trim($request->name),
                'email' => strtolower(trim($request->email)),
                'password' => Hash::make($request->password),

                'DOB' => $request->DOB
                    ? date('Y-m-d', strtotime($request->DOB))
                    : null,

                'profile_image' => $request->profile_image,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'You are registered successfully. Please Login',
                'data' => [
                    'user' => $user
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
