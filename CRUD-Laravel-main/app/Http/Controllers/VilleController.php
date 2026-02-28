<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ville;

class VilleController extends Controller
{
   
    public function index()
    {
        $villes = Ville::all();
        return view('villes.index', compact('villes'));
    }

    
    public function create()
    {
        return view('villes.create');
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        Ville::create($request->only('nom'));

        return redirect()->route('villes.index')->with('success', 'Ville ajoutée avec succès !');
    }

   
    public function edit(Ville $ville)
    {
        return view('villes.edit', compact('ville'));
    }

   
    public function update(Request $request, Ville $ville)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $ville->update($request->only('nom'));

        return redirect()->route('villes.index')->with('success', 'Ville modifiée avec succès !');
    }

    
    public function destroy(Ville $ville)
    {
        $ville->delete();
        return redirect()->route('villes.index')->with('success', 'Ville supprimée avec succès !');
    }
}