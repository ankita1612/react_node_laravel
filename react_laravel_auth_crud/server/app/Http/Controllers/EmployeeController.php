<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $allowedSorts = ['id','first_name','salary','age','dob','created_at'];
        $sortBy = in_array($request->sort_by, $allowedSorts)  ? $request->sort_by : 'id';
        $sortOrder = $request->sort_order === 'asc'   ? 'asc'   : 'desc';        
        $perPage = min($request->per_page ?? 10, 100);
        $employees = Employee::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'LIKE', "%{$search}%")
                        ->orWhere('last_name', 'LIKE', "%{$search}%")
                        ->orWhere('hobbies', 'LIKE', "%{$search}%")
                        ->orWhere('status', 'LIKE', "%{$search}%");
                });
            })

            ->orderBy($sortBy, $sortOrder)

            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $employees
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([

            'first_name' => 'required|string|max:255',

            'last_name' => 'nullable|string|max:255',

            'salary' => 'required|numeric',

            'age' => 'nullable|numeric',

            'dob' => 'required|date',

            'doj' => 'nullable|date',

            'description' => 'required|string',

            'profile_image' => 'required|image|mimes:jpg,jpeg,png|max:2048',

            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'hobbies' => 'required|in:Cricket,Football,Basket ball',

            'status' => 'required|in:active,inactive',
        ]);

        DB::beginTransaction();

        try {

            // Upload profile image
            $profileImage = $request
                ->file('profile_image')
                ->store('employees/profile', 'public');

            // Upload logo if exists
            $logo = null;

            if ($request->hasFile('logo')) {

                $logo = $request
                    ->file('logo')
                    ->store('employees/logo', 'public');
            }

            // Create employee
            $employee = Employee::create([
                ...$validated,
                'profile_image' => $profileImage,
                'logo' => $logo,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => $employee
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            // Delete uploaded files if DB fails
            if (isset($profileImage)) {
                Storage::disk('public')->delete($profileImage);
            }

            if (isset($logo) && $logo) {
                Storage::disk('public')->delete($logo);
            }

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   public function show(Employee $employee)
    {
        return response()->json([
            'success' => true,
            'data' => $employee
        ], 200);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'salary' => 'required|numeric',
            'age' => 'nullable|numeric',
            'dob' => 'required|date',
            'doj' => 'nullable|date',
            'description' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'hobbies' => 'required|in:Cricket,Football,Basket ball',
            'status' => 'required|in:active,inactive',
        ]);

        DB::beginTransaction();
        $newProfileImage = null;
        $newLogo = null;
        try {
         
            // Upload new profile image
            if ($request->hasFile('profile_image')) {
                $newProfileImage = $request
                    ->file('profile_image')
                    ->store('employees/profile', 'public');

                $validated['profile_image'] = $newProfileImage;
            }

            // Upload new logo
            if ($request->hasFile('logo')) {
                $newLogo = $request
                    ->file('logo')
                    ->store('employees/logo', 'public');
                $validated['logo'] = $newLogo;
            }

            // Update employee
            $employee->update($validated);
            // Delete old profile image after successful update
            if ($newProfileImage && $employee->getOriginal('profile_image')) {
                Storage::disk('public')
                    ->delete($employee->getOriginal('profile_image'));
            }

            // Delete old logo after successful update
            if ($newLogo && $employee->getOriginal('logo')) {
                Storage::disk('public')
                    ->delete($employee->getOriginal('logo'));
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Employee updated successfully',
                'data' => $employee
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            // Delete newly uploaded files if DB fails
            if ($newProfileImage) {

                Storage::disk('public')
                    ->delete($newProfileImage);
            }
            if ($newLogo) {

                Storage::disk('public')
                    ->delete($newLogo);
            }

            \Log::error($e);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function destroy(Employee $employee)
    {
        DB::beginTransaction();
        try {
            // Delete profile image
            if ($employee->profile_image) {
                Storage::disk('public')
                    ->delete($employee->profile_image);
            }
            // Delete logo
            if ($employee->logo) {
                Storage::disk('public')
                    ->delete($employee->logo);
            }

            // Delete employee
            $employee->delete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error($e);
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }
}
