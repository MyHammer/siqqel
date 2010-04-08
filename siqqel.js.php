<?php
/**
* Created by IntelliJ IDEA.
* User: max
* Date: 21.03.2010
* Time: 16:08:58
*/

header('Content-Type: application/javascript');

require_once('siqqelLib.php');

$config = siqqelLib::jsConfig();

$data = file_get_contents('siqqel.js');

echo preg_replace("/'!!configHere!!'/", json_encode($config), $data);

?>
