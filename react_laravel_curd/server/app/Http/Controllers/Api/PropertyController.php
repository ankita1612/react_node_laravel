<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $allowedSorts = [  'id',    'property_name',    'property_type',    'created_at'];
        $search = $request->search;
        $sortBy = in_array($request->sort_by, $allowedSorts)? $request->sort_by : 'id';
        $sortOrder = in_array($request->sort_order, ['asc', 'desc'])? $request->sort_order: 'desc';
        $perPage = min($request->per_page ?? 10, 100);

        $properties = Property::with([
                'owner:id,name',
                'amenities:id,name',
                'photos'
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('property_name', 'like', "%{$search}%")
                    ->orWhere('property_type', 'like', "%{$search}%")
                    ->orWhere('property_address', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $properties
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'property_name' => 'required|max:255',
            'property_detail' => 'required',
            'property_type' => 'required|in:Residential,Commercial',
            'property_size' => 'nullable|required_if:property_type,Residential',
            'owner_id' => 'required|exists:owners,id',
            'property_address' => 'required',
            'amenities' => 'required|array',
            'amenities.*' => 'exists:amenities,id',
            'brochure' => 'nullable|mimes:pdf|max:2048',
            'photos' => 'required|array',
            'photos.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $brochurePath = null;
            if ($request->hasFile('brochure')) {
                $brochurePath = $request->file('brochure')->store('brochures', 'public');
            }

            $property = Property::create([
                'property_name' => $request->property_name,
                'property_detail' => $request->property_detail,
                'property_type' => $request->property_type,
                'property_size' => $request->property_size,
                'owner_id' => $request->owner_id,
                'property_address' => $request->property_address,
                'brochure' => $brochurePath,
            ]);

            // amenities
            $property->amenities()->sync($request->amenities);

            // photos

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $photoPath = $photo->store(
                        'property-photos',
                        'public'
                    );

                    PropertyPhoto::create([
                        'property_id' => $property->id,
                        'photo' => $photoPath,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                 'success' => true,
                'message' => 'Property created successfully',
                'data' => $property
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                 'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Property $property)
    {
        $property->load([
            'owner:id,name',
            'amenities:id,name',
            'photos:id,property_id,photo'
        ]);

        return response()->json([
            'success' => true,
            'data' => $property
        ], 200);
    }

    public function update(Request $request, Property $property)
    {
        $request->validate([
            'property_name' => 'required|max:255',
            'property_detail' => 'required',
            'property_type' => 'required|in:Residential,Commercial',
            'property_size' =>'nullable|required_if:property_type,Residential',
            'owner_id' =>'required|exists:owners,id',
            'property_address' => 'required',
            'amenities' => 'required|array',
            'amenities.*' => 'exists:amenities,id',
            'brochure' =>'nullable|mimes:pdf|max:2048',
            'photos.*' =>'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $brochurePath = $property->brochure;
            if ($request->hasFile('brochure')) {
                if ($property->brochure) {
                    Storage::disk('public')->delete($property->brochure);
                }

                $brochurePath = $request->file('brochure')->store('brochures', 'public');
            }

            $property->update([
                'property_name' => $request->property_name,
                'property_detail' => $request->property_detail,
                'property_type' => $request->property_type,
                'property_size' => $request->property_size,
                'owner_id' => $request->owner_id,
                'property_address' => $request->property_address,
                'brochure' => $brochurePath,
            ]);

            // amenities
            $property->amenities()->sync($request->amenities);

            // photos
            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $photoPath = $photo->store('property-photos','public' );

                    PropertyPhoto::create([
                        'property_id' => $property->id,
                        'photo' => $photoPath,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Property updated successfully'
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

    public function destroy(Property $property)
    {
        DB::beginTransaction();

        try {

            foreach ($property->photos as $photo) {

                Storage::disk('public')->delete($photo->photo);

                $photo->delete();
            }

            if ($property->brochure) {

                Storage::disk('public')
                    ->delete($property->brochure);
            }

            $property->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Property deleted successfully'
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