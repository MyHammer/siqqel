<?php
/**
 * Created by IntelliJ IDEA.
 * User: max.winde
 * Date: 04.03.2010
 * Time: 11:43:03
 * To change this template use File | Settings | File Templates.
 */

require_once('sqlHammerLib.php');

echo sqlHammerLib::htmlHeaders();

ob_start();

function sqlHammerShutdown() {
	$htmlCode = ob_get_contents();
	ob_end_clean();

	echo sqlHammerLib::encryptHtml($htmlCode);

}

register_shutdown_function('sqlHammerShutdown');