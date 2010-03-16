<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Contract relevant data</title>
	<?php require_once('sqlHammer.php'); ?>
</head>
<body>
<table sql="SELECT 'Hello!' AS greet, 'Edit SQL-Attribute of the Table to change Query' AS manual1, CONCAT('use #', 'placeholder as a placeholder') AS manual2"></table>
</body>
</html>