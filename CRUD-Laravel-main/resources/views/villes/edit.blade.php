<!DOCTYPE html>
<html>
<head>
    <title>Modifier ville</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            display: flex;
            justify-content: center;
            padding-top:50px;
        }
        .card {
            background: white;
            padding: 30px;
            width: 400px;
            border-radius:10px;
            box-shadow:0 5px 15px rgba(0,0,0,0.1);
        }
        h2 {
            text-align:center;
            margin-bottom:20px;
            color:#333;
        }
        label {
            display:block;
            margin-bottom:5px;
            color:#555;
            font-weight:bold;
        }
        input {
            width:100%;
            padding:10px;
            margin-bottom:15px;
            border:1px solid #ddd;
            border-radius:5px;
        }
        input:focus {
            border-color:#2196F3;
        }
        button {
            width:100%;
            padding:10px;
            border:none;
            border-radius:5px;
            background-color:#4CAF50;
            color:white;
            font-weight:bold;
            cursor:pointer;
        }
        button:hover {
            background-color:#45a049;
        }
        .back {
            display:block;
            text-align:center;
            margin-top:15px;
            text-decoration:none;
            color:#555;
        }
        .back:hover {
            color:#000;
        }
    </style>
</head>
<body>

<div class="card">
    <h2>Modifier ville</h2>

    <form action="{{ route('villes.update', $ville->id) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Nom de la ville :</label>
        <input type="text" name="nom" value="{{ $ville->nom }}" required>

        <button type="submit">Modifier</button>
    </form>

    <a href="{{ route('villes.index') }}" class="back">Retour</a>
</div>

</body>
</html>