<?php

require_once realpath(dirname(__FILE__).'/../siqqel/siqqelLib.php');

class siqqelLibTest extends PHPUnit_Framework_TestCase {

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