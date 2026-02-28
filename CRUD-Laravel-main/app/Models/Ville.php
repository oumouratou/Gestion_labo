<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; //ORM

class Ville extends Model
{
    use HasFactory;
    protected $table = 'villes';
    protected $fillable = ['nom'];

    public function users()
{
    return $this->hasMany(Utilisateur::class);
}
}
