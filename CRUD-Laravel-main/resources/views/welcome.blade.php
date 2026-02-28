<h2>Liste des villes</h2>

<a href="{{ route('villes.create') }}" class="btn btn-add">Ajouter une ville</a>

<br><br>

<table>
    <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Actions</th>
    </tr>

    @forelse($villes as $ville)
    <tr>
        <td>{{ $ville->id }}</td>
        <td>{{ $ville->nom }}</td>
        <td>
            <a href="{{ route('villes.edit', $ville->id) }}" class="btn edit">Modifier</a>

            <form action="{{ route('villes.destroy', $ville->id) }}" method="POST" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn delete" onclick="return confirm('Voulez-vous vraiment supprimer cette ville ?')">Supprimer</button>
            </form>
        </td>
    </tr>
    @empty
    <tr>
        <td colspan="3" style="text-align:center;">Aucune ville trouvée.</td>
    </tr>
    @endforelse
</table>

<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f2f5;
    margin: 40px;
    color: #2c3e50;
}

h2 {
    margin-bottom: 20px;
    color: #34495e;
}

table {
    width: 60%;
    border-collapse: collapse;
    margin-top: 15px;
}

th, td {
    padding: 12px;
    border: 1px solid #ccc;
    text-align: left;
}

th {
    background-color: #eee;
}

a.btn {
    display: inline-block;
    padding: 8px 15px;
    border-radius: 5px;
    text-decoration: none;
    color: white;
    font-weight: bold;
    margin-right: 5px;
    transition: 0.3s;
}

a.btn.edit {
    background-color: #3498db;
}
a.btn.edit:hover {
    background-color: #2980b9;
}

button.btn.delete {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    background-color: #e74c3c;
    color: white;
    cursor: pointer;
    font-weight: bold;
}
button.btn.delete:hover {
    background-color: #c0392b;
}

a.btn.btn-add {
    background-color: #1abc9c;
    margin-bottom: 10px;
}
a.btn.btn-add:hover {
    background-color: #16a085;
}
</style>