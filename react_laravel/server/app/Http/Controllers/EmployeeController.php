<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
  public function index(Request $request)
    {
        $search = $request->search;
        $sortBy = $request->sort_by ?? 'id';
        $sortOrder = $request->sort_order ?? 'desc';
        $perPage = $request->per_page ?? 10;

        $employees = Employee::query()

            ->when($search, function ($query) use ($search) {
                $query->where('first_name', 'LIKE', "%{$search}%")
                    ->orWhere('last_name', 'LIKE', "%{$search}%")
                    ->orWhere('hobbies', 'LIKE', "%{$search}%")
                    ->orWhere('status', 'LIKE', "%{$search}%");
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

            'DOJ' => 'nullable|date',

            'description' => 'required|string',

            'profile_image' => 'required|image|mimes:jpg,jpeg,png|max:2048',

            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            'hobbies' => 'required|in:Cricket,Football,Basket ball',

            'status' => 'required|in:active,inactive',
        ]);

        // Upload profile image
        $profileImage = $request->file('profile_image')
            ->store('employees/profile', 'public');

        $logo = null;

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo')
                ->store('employees/logo', 'public');
        }

        $employee = Employee::create([
            ...$validated,
            'profile_image' => $profileImage,
            'logo' => $logo,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully',
            'data' => $employee
        ]);
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

            $validated['profile_image'] = $request
                ->file('profile_image')
                ->store('employees/profile', 'public');
        }

        if ($request->hasFile('logo')) {

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

        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }
}