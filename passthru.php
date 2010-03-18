<?php
/**
 * Created by IntelliJ IDEA.
 * User: max.winde
 * Date: 02.03.2010
 * Time: 11:17:26
 * To change this template use File | Settings | File Templates.
 */

require_once('sqlHammerLib.php');


$sQueryString = $_SERVER['QUERY_STRING'];

$sqlQuery = sqlHammerLib::buildSqlQuery(urldecode($sQueryString));

/*
$sDbSlayerUrl = 'http://localhost:9090/db?';
$rFilePointer = fopen($sDbSlayerUrl . urlencode(json_encode(array('SQL' => $sqlQuery))), 'r');

#header('Content-Type: application/javascript');

fpassthru($rFilePointer);
die();*/

function getFieldTypeName($iFieldType) {
	if($iFieldType == MYSQLI_TYPE_DECIMAL) return 'MYSQLI_TYPE_DECIMAL';
	if($iFieldType == MYSQLI_TYPE_NEWDECIMAL) return 'MYSQLI_TYPE_NEWDECIMAL';
	if($iFieldType == MYSQLI_TYPE_BIT) return 'MYSQLI_TYPE_BIT';
	if($iFieldType == MYSQLI_TYPE_TINY) return 'MYSQLI_TYPE_TINY';
	if($iFieldType == MYSQLI_TYPE_SHORT) return 'MYSQLI_TYPE_SHORT';
	if($iFieldType == MYSQLI_TYPE_LONG) return 'MYSQLI_TYPE_LONG';
	if($iFieldType == MYSQLI_TYPE_FLOAT) return 'MYSQLI_TYPE_FLOAT';
	if($iFieldType == MYSQLI_TYPE_DOUBLE) return 'MYSQLI_TYPE_DOUBLE';
	if($iFieldType == MYSQLI_TYPE_NULL) return 'MYSQLI_TYPE_NULL';
	if($iFieldType == MYSQLI_TYPE_TIMESTAMP) return 'MYSQLI_TYPE_TIMESTAMP';
	if($iFieldType == MYSQLI_TYPE_LONGLONG) return 'MYSQLI_TYPE_LONGLONG';
	if($iFieldType == MYSQLI_TYPE_INT24) return 'MYSQLI_TYPE_INT24';
	if($iFieldType == MYSQLI_TYPE_DATE) return 'MYSQLI_TYPE_DATE';
	if($iFieldType == MYSQLI_TYPE_TIME) return 'MYSQLI_TYPE_TIME';
	if($iFieldType == MYSQLI_TYPE_DATETIME) return 'MYSQLI_TYPE_DATETIME';
	if($iFieldType == MYSQLI_TYPE_YEAR) return 'MYSQLI_TYPE_YEAR';
	if($iFieldType == MYSQLI_TYPE_NEWDATE) return 'MYSQLI_TYPE_NEWDATE';
	if($iFieldType == MYSQLI_TYPE_INTERVAL) return 'MYSQLI_TYPE_INTERVAL';
	if($iFieldType == MYSQLI_TYPE_ENUM) return 'MYSQLI_TYPE_ENUM';
	if($iFieldType == MYSQLI_TYPE_SET) return 'MYSQLI_TYPE_SET';
	if($iFieldType == MYSQLI_TYPE_TINY_BLOB) return 'MYSQLI_TYPE_TINY_BLOB';
	if($iFieldType == MYSQLI_TYPE_MEDIUM_BLOB) return 'MYSQLI_TYPE_MEDIUM_BLOB';
	if($iFieldType == MYSQLI_TYPE_LONG_BLOB) return 'MYSQLI_TYPE_LONG_BLOB';
	if($iFieldType == MYSQLI_TYPE_BLOB) return 'MYSQLI_TYPE_BLOB';
	if($iFieldType == MYSQLI_TYPE_VAR_STRING) return 'MYSQLI_TYPE_VAR_STRING';
	if($iFieldType == MYSQLI_TYPE_STRING) return 'MYSQLI_TYPE_STRING';
	if($iFieldType == MYSQLI_TYPE_CHAR) return 'MYSQLI_TYPE_CHAR';
	if($iFieldType == MYSQLI_TYPE_GEOMETRY) return 'MYSQLI_TYPE_GEOMETRY';
}

function jsonError($iErrNo, $sError, $sServer = '') {
	return json_encode(array('MYSQL_ERROR' => $sError, 'MYSQL_ERRNO' => $iErrNo, 'SERVER' => $sServer));
}

require_once('config.inc.php');

$db = new mysqli(MYSQL_SERVER, MYSQL_USER, MYSQL_PASSWD, MYSQL_DATABASE);

if($iErrNo = mysqli_connect_errno()) {
	die(jsonError($iErrNo, mysqli_connect_error()));
}

if($oMysqlResult = $db->query($sqlQuery)) {
	if($iErrNo = mysqli_errno($db)) {
		die(jsonError($iErrNo, mysqli_error($db)));
	}

	$oResult = (object)null;
	$oResult->HEADER = array();
	$oResult->TYPES = array();
	foreach($oMysqlResult->fetch_fields() as $field) {
		//var_Dump($field);
		$oResult->HEADER[] = $field->name;
		$oResult->TYPES[] = getFieldTypeName($field->type);
	}

	$oResult->ROWS = array();

	while($aRow = $oMysqlResult->fetch_row()) {
		$oResult->ROWS[] = $aRow;
	}

	echo json_encode(array('RESULT' => $oResult));
} else {
	if($iErrNo = mysqli_errno($db)) {
		die(jsonError($iErrNo, mysqli_error($db)));
	}	
}
