<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use Illuminate\Http\Request;

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
        ]);
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

    public function show(string $id)
    {
        $employee = Employee::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    public function update(Request $request, string $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([

            'first_name' => 'required|string|max:255',

            'last_name' => 'nullable|string|max:255',

            'salary' => 'required|numeric',

            'age' => 'nullable|numeric',

            'dob' => 'required|date',

            'DOJ' => 'nullable|date',

            'description' => 'required|string',

            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'hobbies' => 'required|in:Cricket,Football,Basket ball',

            'status' => 'required|in:active,inactive',
        ]);

        if ($request->hasFile('profile_image')) {
            // Delete old image
            if ($employee->profile_image) {
                Storage::disk('public')->delete($employee->profile_image);
            }

            // Upload new image
            $validated['profile_image'] = $request
                ->file('profile_image')
                ->store('employees/profile', 'public');
        }

       if ($request->hasFile('logo')) {
            // Delete old logo
            if ($employee->logo) {
                Storage::disk('public')->delete($employee->logo);
            }

            // Upload new logo
            $validated['logo'] = $request
                ->file('logo')
                ->store('employees/logo', 'public');
        }   

        $employee->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully',
            'data' => $employee
        ]);
    }

    public function destroy(string $id)
    {
        $employee = Employee::findOrFail($id);
        if ($employee->profile_image) {
            Storage::disk('public')->delete($employee->profile_image);
        }

        if ($employee->logo) {
            Storage::disk('public')->delete($employee->logo);
        }
        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }
}
