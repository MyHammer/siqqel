dbSlayer = {
	baseUrl: (window.sqlHammerBaseUrl ? window.sqlHammerBaseUrl : '') + 'passthru.php',
	
	query: function(sqlQuery, hashParams, successCallback, errorCallback) {
		var sendHashParams = {};

		var missingHashParameters = false;

		$.each(sqlQuery.requiredHashParams, function() {
			if(typeof(hashParams[this]) == 'undefined') {
				errorCallback('Please enter a value for #' + this, 0, '');
				missingHashParameters = true;
			}

			sendHashParams[this] = hashParams[this];
		});

		if(missingHashParameters) return;

		var params = {
			SQL: sqlQuery.sqlQuery,
			hashParams: hashParams
		};

		$.getJSON(this.baseUrl + '?sql=' + escape($.toJSON(params)) + '&callback=?', {}, function(result, textStatus) {
			//var result = undefined;
			//eval('result = ' + data);
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