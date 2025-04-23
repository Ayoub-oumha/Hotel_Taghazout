<?php 
return [
    'paths' => ['api/*'], // ou ajoute les chemins nécessaires
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // React dev server
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 0,
    'supports_credentials' => false,
];
