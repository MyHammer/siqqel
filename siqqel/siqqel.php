<?php

require_once('siqqelLib.php');

echo siqqelLib::htmlHeaders();

ob_start();

function siqqelShutdown() {
	$htmlCode = ob_get_contents();
	ob_end_clean();

	echo siqqelLib::encryptHtml($htmlCode);

}

register_shutdown_function('siqqelShutdown');
