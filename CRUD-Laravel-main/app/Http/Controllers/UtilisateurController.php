<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Utilisateur;
use App\Models\Ville;

class UtilisateurController extends Controller
{
    public function index()
    {
       
        $utilisateurs = Utilisateur::with('ville')->get();
        return view('utilisateurs.index', compact('utilisateurs'));
    }

    public function create()
    {
        $villes = Ville::all();
        return view('utilisateurs.create', compact('villes'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email|unique:utilisateurs,email',
            'role' => 'required',
            'ville_id' => 'required|exists:villes,id'
        ]);

        Utilisateur::create($data);

        return redirect()->route('utilisateurs.index');
    }

    public function edit(Utilisateur $utilisateur)
    {
        $villes = Ville::all();
        return view('utilisateurs.edit', compact('utilisateur', 'villes'));
    }

    public function update(Request $request, Utilisateur $utilisateur)
    {
        $data = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email|unique:utilisateurs,email,' . $utilisateur->id,
            'role' => 'required',
            'ville_id' => 'required|exists:villes,id'
        ]);

        $utilisateur->update($data);

        return redirect()->route('utilisateurs.index');
    }

    public function destroy(Utilisateur $utilisateur)
    {
        $utilisateur->delete();
        return redirect()->route('utilisateurs.index');
    }
}