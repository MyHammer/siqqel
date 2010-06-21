<?php

class siqqelLib {

	public static $javaScriptFiles = array(
		'js/jquery-1.4.2-min.js',
		'js/json.js',
		'js/dbslayer.js',
		'js/hashParams.js',
		'js/variableInputPanel.js',
		'js/siqqelLib.js'
	);
	
	public static $cssFiles = array(
		'css/style.css'
	);

	public static function encryptSqlQuery($sqlQuery) {
		$encryptedQuery = $sqlQuery;
		$hashParams = array();
		if (preg_match_all('/#([a-zA-Z0-9_]+)/', $sqlQuery, $matches, PREG_SET_ORDER)) {
			foreach($matches as $match) {
				$hashParams[] = $match[1];
			}
		}

		return json_encode(array('sqlQuery' => $encryptedQuery, 'requiredHashParams' => $hashParams));
	}

	public static function buildSqlQuery($encryptedQuery) {
		$oQuery = json_decode($encryptedQuery);

		$sqlQuery = $oQuery->sqlQuery;

		foreach ($oQuery->requiredHashParams as $name => $value) {
			$sqlQuery = preg_replace('/#' . $name . '/', mysql_escape_string($value), $sqlQuery);
		}

		return $sqlQuery;
	}

	public static function jsConfig($serverParameters) {
		$config = (object)null;

		$config->cssFiles = self::$cssFiles;
		$config->javaScriptFiles = self::$javaScriptFiles;
		$baseUrlSchema = (isset($serverParameters['HTTP_SSL_ENGINE']) && $serverParameters['HTTP_SSL_ENGINE'] == 'on') ? 'https' : 'http';
		$config->baseUrl = $baseUrlSchema . '://' . $serverParameters['HTTP_HOST'] . dirname($serverParameters['REQUEST_URI']) .'/';

		return $config;
	}

	public static function htmlHeaders() {
		$html = '';

		foreach (self::$javaScriptFiles as $javaScriptFile) {
			$html .= '<script type="text/javascript" src="' . $javaScriptFile . '"></script>';
		}

        foreach (self::$cssFiles as $cssFile) {
			$html .= '<link rel="stylesheet" href="' . $cssFile . '">';
        }

		$html .= '<script>siqqelEncodingBackend = \'php\';</script>';

		return $html;
	}

	public static function encryptHtmlAttribute($a) {
		return $a[1] . htmlspecialchars(self::encryptSqlQuery($a[2])) . $a[3];
	}

	public static function encryptJavaScriptCall($a) {
		return $a[1] . self::encryptSqlQuery($a[2]) . $a[3];
	}

	public static function encryptHtml($htmlCode) {
		$htmlCode = preg_replace_callback('/(<table[^>]+sql=")([^"]+)(")/', "siqqelLib::encryptHtmlAttribute", $htmlCode);
		$htmlCode = preg_replace_callback('/(siqqel\\.encryptQuery\()\'([^\']+)\'(\))/', 'siqqelLib::encryptJavaScriptCall', $htmlCode);

		return $htmlCode;
	}

}
