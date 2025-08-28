<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemImages;
use App\Models\Item;
use App\Models\ItemImage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::with('images')->oldest('brand_name')->paginate(15);

        return Inertia::render('Admin/Items', [
            'items' => $items
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ItemCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => ['required', 'string'],
            'generic_name' => ['sometimes'],
            'milligrams' => ['sometimes'],
            'supply' => ['sometimes'],
            'catalog_price' => ['required'],
            'product_type' => ['required'],
            'images' => ['required', 'array'],
            'images.*' => ['image']
        ]);



        $item = Item::create([
            'brand_name' => $validated['brand_name'],
            'generic_name' => $request->get('generic_name'),
            'milligrams' =>$request->get('milligrams'),
            'supply' =>$request->get('supply'),
            'catalog_price' => $validated['catalog_price'],
            'product_type' => $validated['product_type'],
            'inventory' => 0
        ]);

        foreach ($request->file('images') as $image) {
            $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $folderName = "item". $item->id . '-'. time();
            $path = $image->storeAs($folderName, $fileName, 'public');
            $urls[] = Storage::url($path);

            ItemImage::create([
                'item_id' => $item->id,
                'link' => $path
            ]);
        }


        $items = Item::with('images')->oldest('brand_name')->paginate(15);

        return Inertia::render('Admin/Items', [
            'items' => $items
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $item = Item::where('id', $id)->with(['images'])->first();

        if($item) {
            return Inertia::render('Admin/ItemView', [
            'item' => $item
        ]);
        }


        return abort(404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        //
    }


    public function apiListWithOutImage()
    {
        $items = Item::select(['brand_name', 'generic_name', 'milligrams', 'supply', 'catalog_price', 'product_type'])->oldest('brand_name')->get();

        return response()->json([
            'message' => 'Fetch successfully!',
            'items' => $items
        ], Response::HTTP_OK);
    }

     public function getFile($id)
    {
        $image = ItemImages::where('id', $id)->first();
        if(!$image) abort(404);


        $path = storage_path('app/public/' . $image->link);

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }
}
