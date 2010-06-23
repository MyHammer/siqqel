<?php

header('Content-Type: application/javascript');

require_once('siqqelLib.php');

$config = siqqelLib::jsConfig($_SERVER);
$data = file_get_contents('siqqel.js');

echo preg_replace("/'!!configHere!!'/", json_encode($config), $data);
