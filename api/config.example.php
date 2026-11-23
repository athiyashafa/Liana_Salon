<?php
return [
    'db_host' => '127.0.0.1',
    'db_port' => 3306,
    'db_name' => 'liana_salon',
    'db_user' => 'root',
    'db_pass' => '',
    'rahasia' => 'node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"',
    'umur_token' => 604800, 
    'sandi_awal' => '12345',
];
