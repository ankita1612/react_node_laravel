<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $sortBy = $request->sort_by ?? 'id';
        $sortOrder = $request->sort_order ?? 'desc';
        $perPage = $request->per_page ?? 10;

        $properties = Property::with([
                'owner',
                'amenities',
                'photos'
            ])
            ->when($search, function ($query) use ($search) {

                $query->where('property_name', 'like', "%{$search}%")
                    ->orWhere('property_type', 'like', "%{$search}%")
                    ->orWhere('property_address', 'like', "%{$search}%");
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

        return response()->json($properties);
    }

    public function store(Request $request)
    {
        $request->validate([
            'property_name' => 'required|max:255',

            'property_detail' => 'required',

            'property_type' => 'required|in:Residential,Commercial',

            'property_size' =>
                'nullable|required_if:property_type,Residential',

            'owner_id' =>
                'required|exists:owners,id',

            'property_address' => 'required',

            'amenities' => 'required|array',

            'amenities.*' => 'exists:amenities,id',

            'brochure' =>
                'nullable|mimes:pdf|max:2048',

            'photos' => 'required|array',

            'photos.*' =>
                'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();

        try {

            $brochurePath = null;

            if ($request->hasFile('brochure')) {

                $brochurePath = $request->file('brochure')
                    ->store('brochures', 'public');
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

            $property->amenities()
                ->sync($request->amenities);

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
                'message' => 'Property created successfully',
                'data' => $property
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $property = Property::with([
            'owner',
            'amenities',
            'photos'
        ])->findOrFail($id);

        return response()->json($property);
    }

    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $request->validate([
            'property_name' => 'required|max:255',

            'property_detail' => 'required',

            'property_type' => 'required|in:Residential,Commercial',

            'property_size' =>
                'nullable|required_if:property_type,Residential',

            'owner_id' =>
                'required|exists:owners,id',

            'property_address' => 'required',

            'amenities' => 'required|array',

            'amenities.*' => 'exists:amenities,id',

            'brochure' =>
                'nullable|mimes:pdf|max:2048',

            'photos.*' =>
                'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();

        try {

            $brochurePath = $property->brochure;

            if ($request->hasFile('brochure')) {

                if ($property->brochure) {

                    Storage::disk('public')
                        ->delete($property->brochure);
                }

                $brochurePath = $request->file('brochure')
                    ->store('brochures', 'public');
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

            $property->amenities()
                ->sync($request->amenities);

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
                'message' => 'Property updated successfully'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        $property->delete();

        return response()->json([
            'message' => 'Property deleted successfully'
        ]);
    }
}