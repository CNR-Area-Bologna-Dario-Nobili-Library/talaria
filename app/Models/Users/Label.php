<?php

namespace App\Models\Users;

use App\Models\BaseModel;
use App\Models\References\Reference;

class Label extends BaseModel
{
    protected $fillable=[
        'name',
    ];

    public function references()
    {
        return $this->belongsToMany(Reference::class);
    }
}
