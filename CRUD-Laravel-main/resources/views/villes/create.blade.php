<!DOCTYPE html>
<html>
<head>
    <title>Ajouter une ville</title>
    
</head>
<body>

<div class="card">
    <h2>Ajouter une ville</h2>

    <form action="{{ route('villes.store') }}" method="POST">
        @csrf
        <input type="text" name="nom" placeholder="Nom de la ville">
        <button type="submit">Ajouter</button>
    </form>

    <a href="{{ route('villes.index') }}" class="back">Retour</a>
</div>

</body>
<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .card {
            background: white;
            padding: 30px;
            width: 350px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            outline: none;
        }

        input:focus {
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
</html>