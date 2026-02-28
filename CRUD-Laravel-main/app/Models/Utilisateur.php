<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; //ORM
use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    use HasFactory;
    protected $table = 'utilisateurs';
    protected $fillable = ['nom', 'prenom', 'email','role', 'ville_id'];
    public function ville()
        {
            return $this->belongsTo(Ville::class);
        }
}
