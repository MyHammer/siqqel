<?php
/**
 * Created by IntelliJ IDEA.
 * User: max.winde
 * Date: 04.03.2010
 * Time: 16:46:12
 * To change this template use File | Settings | File Templates.
 */

require_once('core/v3/engine.php');

class sqlHammerLib {
	const encrpytionKey = 'edrdgtjhhjnzhbtzjimhnzgg';

	static function buildSqlQuery($encryptedQuery) {
		$oQuery = json_decode($encryptedQuery);

		$sqlQuery = cEncryption::decrypt(base64_decode($oQuery->SQL));

		foreach($oQuery->hashParams as $name => $value) {
			$sqlQuery = preg_replace('/#' . $name . '/', mysql_escape_string($value), $sqlQuery);
		}

		return $sqlQuery;
	}

	static function htmlHeaders() {
		return '		<script type="text/javascript" src="js/jquery-1.4.2-min.js"></script>
		<script type="text/javascript" src="js/json.js"></script>
		<script type="text/javascript" src="js/dbslayer.js"></script>
		<script type="text/javascript" src="js/hashParams.js"></script>
		<script type="text/javascript" src="js/sqlHammer.js"></script>
		<link rel="stylesheet" href="css/style.css">
';
		/*
		<script type="text/javascript" src="flot/jquery.flot.js"></script>
		<script type="text/javascript" src="js/graph.js"></script>
		*/
	}

	static function encryptSqlQuery($sqlQuery) {
		$encryptedQuery = base64_encode(cEncryption::encrypt($sqlQuery));

		$hashParams = array();
		if(preg_match_all('/#([a-zA-Z0-9_]+)/', $sqlQuery, $matches, PREG_SET_ORDER)) {
			foreach($matches as $match) {
				$hashParams[] = $match[1];
			}
		}

		return preg_replace('/"/', '\'', json_encode(array('sqlQuery' => $encryptedQuery, 'requiredHashParams' => $hashParams)));
	}

	static function encryptHtmlAttribute($a) {
		return $a[1] . self::encryptSqlQuery($a[2]) . $a[3];
	}

	static function encryptJavaScriptCall($a) {
		return $a[1] . self::encryptSqlQuery($a[2]) . $a[3];
	}

	static function encryptHtml($htmlCode) {
		$htmlCode = preg_replace_callback('/(<table[^>]+sql=")([^"]+)(")/', "sqlHammerLib::encryptHtmlAttribute", $htmlCode);
		$htmlCode = preg_replace_callback('/(sqlHammer\\.encryptQuery\()\'([^\']+)\'(\))/', 'sqlHammerLib::encryptJavaScriptCall', $htmlCode);

		return $htmlCode;

	}
}