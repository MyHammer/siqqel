<?php

// rename to "config.inc.php" and fill in the necessary values:

$servers = array(

	'local' => array(
		'server' => "127.0.0.1",
		'user' => "root",
		'passwd' => "",
		'database' => "test"
	)

	/*
	,'secondServer' => array(
	'server' => 'example.com',
	'user' => 'someuser',
	'passwd' => '',
	'database' => 'somedatabase'
	)
	*/

);

$defaultServer = 'local';