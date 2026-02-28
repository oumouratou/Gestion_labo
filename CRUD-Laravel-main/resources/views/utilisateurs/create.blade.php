<!DOCTYPE html>
<html>
<head>
    <title>Ajouter un utilisateur</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            display: flex;
            justify-content: center;
            padding-top: 50px;
        }

        .card {
            background: white;
            padding: 30px;
            width: 400px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: bold;
        }

        input, select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            outline: none;
        }

        input:focus, select:focus {
            border-color: #4CAF50;
        }

        button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        button:hover {
            background-color: #45a049;
        }

        .back {
            display: block;
            text-align: center;
            margin-top: 15px;
            text-decoration: none;
            color: #555;
        }

        .back:hover {
            color: #000;
        }
    </style>
</head>
<body>

<div class="card">
    <h2>Ajouter un utilisateur</h2>

    <form action="{{ route('utilisateurs.store') }}" method="POST">
        @csrf

        <label>Nom :</label>
        <input type="text" name="nom">

        <label>Prénom :</label>
        <input type="text" name="prenom">

        <label>Email :</label>
        <input type="email" name="email">

        <label>Rôle :</label>
        <select name="role">
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
        </select>

        <label>Ville :</label>
        <select name="ville_id" required>
            <option value="">Choisir une ville</option>
            @foreach($villes as $ville)
                <option value="{{ $ville->id }}">{{ $ville->nom }}</option>
            @endforeach
        </select>

        <button type="submit">Enregistrer</button>
    </form>

    <a href="{{ route('utilisateurs.index') }}" class="back">Retour</a>
</div>

</body>
</html>