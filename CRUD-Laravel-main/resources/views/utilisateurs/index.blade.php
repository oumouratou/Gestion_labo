<h2>Liste des utilisateurs</h2>

<a href="{{ route('utilisateurs.create') }}" class="btn add">Ajouter un utilisateur</a>

<table>
    <thead>
        <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Ville</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
    @forelse($utilisateurs as $utilisateur)
        <tr>
            <td>{{ $utilisateur->nom }}</td>
            <td>{{ $utilisateur->prenom }}</td>
            <td>{{ $utilisateur->email }}</td>
            <td>{{ $utilisateur->role }}</td>
            <td>
                @if($utilisateur->ville)
                    {{ $utilisateur->ville->nom }}
                @else
                    <span class="ville-supprime">Ville supprimée</span>
                @endif
            </td>
            <td>
                <a href="{{ route('utilisateurs.edit', $utilisateur->id) }}" class="btn edit">Modifier</a>
                <form action="{{ route('utilisateurs.destroy', $utilisateur->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn delete" onclick="return confirm('Voulez-vous vraiment supprimer cet utilisateur ?')">Supprimer</button>
                </form>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="6" style="text-align:center;">Aucun utilisateur trouvé.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 40px;
        background-color: #f4f6f9;
    }

    h2 {
        color: #333;
    }

    table {
        border-collapse: collapse;
        width: 60%;
        margin-top: 20px;
        background: #fff;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    th, td {
        padding: 12px 15px;
        border: 1px solid #ddd;
        text-align: left;
    }

    th {
        background-color: #2196F3;
        color: white;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    a.btn {
        text-decoration: none;
        padding: 8px 15px;
        border-radius: 5px;
        color: white;
        margin-right: 5px;
        display: inline-block;
        text-align: center;
        font-weight: bold;
    }

    a.add {
        background-color: #4CAF50;
        margin-bottom: 15px;
    }

    a.add:hover {
        background-color: #45a049;
    }

    a.edit {
        background-color: #FFC107;
    }

    a.edit:hover {
        background-color: #ffb300;
    }

    button.btn.delete {
        background-color: #f44336;
        border: none;
        padding: 8px 15px;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    }

    button.btn.delete:hover {
        background-color: #d32f2f;
    }

    .ville-supprime {
        color: red;
        font-weight: bold;
    }
</style>