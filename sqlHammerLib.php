<?php
/**
 * Created by IntelliJ IDEA.
 * User: max.winde
 * Date: 04.03.2010
 * Time: 16:46:12
 * To change this template use File | Settings | File Templates.
 */


class sqlHammerLib {
    static $javaScriptFiles = array(
        'js/jquery-1.4.2-min.js',
        'js/json.js',
        'js/dbslayer.js',
        'js/hashParams.js',
        'js/variableInputPanel.js',
        'js/sqlHammerLib.js'
    );
    static $cssFiles = array(
        'css/style.css'
    );

	static function buildSqlQuery($encryptedQuery) {
		$oQuery = json_decode($encryptedQuery);

		$sqlQuery = $oQuery->SQL;

		foreach($oQuery->hashParams as $name => $value) {
			$sqlQuery = preg_replace('/#' . $name . '/', mysql_escape_string($value), $sqlQuery);
		}

		return $sqlQuery;
	}

    static function jsConfig() {
        $config = (object)null;

        $config->cssFiles = self::$cssFiles;
        $config->javaScriptFiles = self::$javaScriptFiles;
		$baseUrlSchema = (isset($_SERVER['HTTP_SSL_ENGINE']) && $_SERVER['HTTP_SSL_ENGINE'] == 'on') ? 'https' : 'http';
        $config->baseUrl = $baseUrlSchema . '://' . $_SERVER['HTTP_HOST'] . ':' . $_SERVER['SERVER_PORT'] . dirname($_SERVER['REQUEST_URI']) .'/';

        return $config;
    }

	static function htmlHeaders() {
        $html = '';

        foreach(self::$javaScriptFiles as $javaScriptFile) {
            $html .= '<script type="text/javascript" src="' . $javaScriptFile . '"></script>';
        }

        foreach(self::$cssFiles as $cssFile) {
           $html .= '<link rel="stylesheet" href="' . $cssFile . '">';
        }

		$html .= '<script>
sqlHammerEncodingBackend = \'php\';
		</script>
';

        return $html;
	}

	static function encryptSqlQuery($sqlQuery) {
		$encryptedQuery = $sqlQuery;
		$hashParams = array();
		if(preg_match_all('/#([a-zA-Z0-9_]+)/', $sqlQuery, $matches, PREG_SET_ORDER)) {
			foreach($matches as $match) {
				$hashParams[] = $match[1];
			}
		}

		return json_encode(array('sqlQuery' => $encryptedQuery, 'requiredHashParams' => $hashParams));
	}

	static function encryptHtmlAttribute($a) {
		return $a[1] . htmlspecialchars(self::encryptSqlQuery($a[2])) . $a[3];
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