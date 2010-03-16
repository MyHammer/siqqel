dbSlayer = {
	baseUrl: 'passthru.php?',
	
	query: function(sqlQuery, hashParams, successCallback, errorCallback) {
		var sendHashParams = {};

		var missingHashParameters = false;

		$.each(sqlQuery.requiredHashParams, function() {
			console.log(typeof(hashParams[this]) + 'x');
			if(typeof(hashParams[this]) == 'undefined') {
				errorCallback('The hashParam #' + this + ' could not be found in the URL please provide it. (eg.' + document.location.href.replace(/#.*/, '') + '#firstParam:firstValue,secondParam:secondValue)', 0, '');
				missingHashParameters = true;
			}

			sendHashParams[this] = hashParams[this];
		});

		if(missingHashParameters) return;

		var params = {
			SQL: sqlQuery.sqlQuery,
			hashParams: hashParams
		};

		//$.getJSON(this.baseUrl + $.toJSON(params), {}, callback);
		$.get(this.baseUrl + $.toJSON(params), {}, function(data, textStatus) {
			var result = undefined;
			eval('result = ' + data);
			if(result.ERROR) {
				errorCallback(result.ERROR,  0, '');
			} else if(result.MYSQL_ERRNO) {
				errorCallback(result.MYSQL_ERROR, result.MYSQL_ERRNO, result.SERVER);
			} else {
				successCallback(result.RESULT.ROWS, result.RESULT.HEADER, result.RESULT.TYPES, result.SERVER);
			}
		});
	}
};