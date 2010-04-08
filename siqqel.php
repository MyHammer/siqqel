<?php
/**
 * Created by IntelliJ IDEA.
 * User: max.winde
 * Date: 04.03.2010
 * Time: 11:43:03
 * To change this template use File | Settings | File Templates.
 */

require_once('siqqelLib.php');

echo siqqelLib::htmlHeaders();

ob_start();

function siqqelShutdown() {
	$htmlCode = ob_get_contents();
	ob_end_clean();

	echo siqqelLib::encryptHtml($htmlCode);

}

register_shutdown_function('siqqelShutdown');
