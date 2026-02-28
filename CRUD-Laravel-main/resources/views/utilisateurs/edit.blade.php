<h2>Modifier utilisateur</h2>

<form action="{{ route('utilisateurs.update', $utilisateur->id) }}" method="POST" class="user-form">
    @csrf
    @method('PUT')

    <div class="form-group">
        <label>Nom :</label>
        <input type="text" name="nom" value="{{ $utilisateur->nom }}" required>
    </div>

    <div class="form-group">
        <label>Prénom :</label>
        <input type="text" name="prenom" value="{{ $utilisateur->prenom }}" required>
    </div>

    <div class="form-group">
        <label>Email :</label>
        <input type="email" name="email" value="{{ $utilisateur->email }}" required>
    </div>

    <div class="form-group">
        <label>Ville :</label>
        <select name="ville_id" required>
            <option value="">Choisir une ville</option>
            @foreach($villes as $ville)
                <option value="{{ $ville->id }}" {{ $utilisateur->ville_id == $ville->id ? 'selected' : '' }}>
                    {{ $ville->nom }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="form-group">
        <label>Rôle :</label>
        <select name="role" required>
            <option value="admin" {{ $utilisateur->role == 'admin' ? 'selected' : '' }}>Admin</option>
            <option value="agent" {{ $utilisateur->role == 'agent' ? 'selected' : '' }}>Agent</option>
        </select>
    </div>

    <button type="submit" class="btn btn-submit">Modifier</button>
</form>

<br>
<a href="{{ route('utilisateurs.index') }}" class="btn btn-back">Retour</a>

<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5;
    margin: 40px;
    color: #2c3e50;
}

h2 {
    margin-bottom: 25px;
    font-weight: bold;
    color: #34495e;
}

/* Formulaire */
.user-form {
    background-color: #fff;
    padding: 30px 25px;
    border-radius: 10px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    max-width: 500px;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 8px;
    font-weight: bold;
    color: #34495e;
}

.form-group input,
.form-group select {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1em;
    transition: border 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52,152,219,0.3);
    outline: none;
}

/* Boutons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.95em;
    color: white;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: 0.3s;
}

.btn-submit {
    min-width: 140px;
    height: 40px;
    background: linear-gradient(45deg, #1abc9c, #16a085);
}

.btn-submit:hover {
    background: linear-gradient(45deg, #16a085, #1abc9c);
}

.btn-back {
    min-width: 100px;
    height: 38px;
    background: linear-gradient(45deg, #7f8c8d, #95a5a6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition: 0.3s;
}

.btn-back:hover {
    background: linear-gradient(45deg, #95a5a6, #7f8c8d);
}
</style>