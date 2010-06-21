<?php

require_once realpath(dirname(__FILE__).'/../siqqel/siqqelLib.php');

class siqqelLibTest extends PHPUnit_Framework_TestCase {

	public function test_jsConfigCssFiles() {
		$aServerParameters['HTTP_SSL_ENGINE'] = 'on';
		$aServerParameters['HTTP_HOST'] = 'www.example.com';
		$aServerParameters['REQUEST_URI'] = '/myDirectory/index.html';
		$a = siqqelLib::jsConfig($aServerParameters);
		
		$this->assertSame('css/style.css', $a->cssFiles[0]);
	}

	public function test_encryptSqlQuery() {
		$sEncryptedQuery = siqqelLib::encryptSqlQuery('SELECT name FROM user');
		
		$this->assertSame('{"sqlQuery":"SELECT name FROM user","requiredHashParams":[]}', $sEncryptedQuery);
	}

	public function test_buildSqlQuery() {	
		$sEncryptedQuery = '{"sqlQuery":"SELECT name FROM user","requiredHashParams":[]}';
		$sSql = siqqelLib::buildSqlQuery($sEncryptedQuery);
		
		$this->assertSame('SELECT name FROM user', $sSql);
	}

}