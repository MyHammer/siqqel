siqqel = {

	getRequiredHashParams: function(sqlQuery) {
		var requiredHashParams = [];

		sqlQuery.replace(/#([a-zA-Z0-9_]+)/g, function(m, param) {
			requiredHashParams.push(param);
			return m;
		});

		return requiredHashParams;
	},

	eachRow: function(sqlQuery, hashParams, serverId, callback, finalCallback) {
		dbSlayer.query(sqlQuery, hashParams, serverId, function(rows, headers, types) {
			$.each(rows, function() {
				var row = {};

				for(var i = 0; i < headers.length; i++) {
					row[headers[i]] = this[i];
				}

				callback(row);
			});

			if(finalCallback) finalCallback();

		}, function(error, errorNum, server) {
			siqqel.displayError($this, 'MySQL Error: ' + error + ' (' + errorNum + ')');
		});
	},

	eachRowPoll: function(sqlQuery, serverId, interval, callback, hashParams) {
		var requiredHashParams = siqqel.getRequiredHashParams(sqlQuery);

		if(requiredHashParams.length != 1) {
			throw "sqlQuery requires exactly one #param";
		}

		var counterParam = requiredHashParams[0];

		if(!hashParams) {
			var hashParams = {};
			hashParams[counterParam] = 0;
		}

		var self = this;

		this.eachRow(sqlQuery, hashParams, serverId, function(row) {
			if(row[counterParam] > hashParams[counterParam]) {
				hashParams[counterParam] = row[counterParam];
			}

			callback(row);
		}, function() {
			//console.dir(hashParams);

			window.setTimeout(function() {
				self.eachRowPoll(sqlQuery, serverId, interval, callback, hashParams);
			}, interval);
		});
	},
	
	executeQuery: function($this, sqlQuery, hashParams, serverId) {
		var graph = $this.attr('graph');

		var graphValues = [];
		var graphMax = 0;

		$this.addClass('loading');

		dbSlayer.query(sqlQuery, hashParams, serverId, function(rows, header, types) {
			var trHead = $('<tr>');

			$.each(header, function() {
				trHead.append($('<th>').text('' + this));
			});

			$this.empty().removeClass('error').append(trHead);

			$.each(rows, function(i) {
				var tr = $('<tr>').addClass('row' + i).addClass('row');
				$this.append(tr);
				var row = {};

				$.each(this, function(j) {
					var type = types[j] + '';
					var typeSans = type.replace(/[0-9]/g, '').replace(/^MYSQLI_/, '');

					var content = this + '';
					if(this.toString() == '[object Window]') content = 'NULL';

					tr.append(
						$('<td>')
							.addClass(header[j])
							.addClass(type)
							.addClass(typeSans)
							.text('' + content)
							.trigger('loaded', content)
					);

					row[header[j]] = content;
				});

				if(graph) {
					var value = parseFloat('' + row[graph]);
					if(value < 0) value = 0;
					graphMax = Math.max(graphMax, value);
					graphValues.push(value);
				}

				tr.trigger('rowLoaded', row);
			});

			if(graphMax > 0) {
				var i = -1;
				$this.find('tr').each(function() {
					if(i == -1) {
						i++;
						return;
					}

					if(graphValues[i] != graphMax) {
						$(this).addClass('quickGraph').css('-moz-background-size', Math.round(graphValues[i] / graphMax * 100) + '% 100%');
					} else {
						$(this).addClass('quickGraphMax');
					}


					i++;
				});
			}

			$this.trigger('tableLoaded').removeClass('loading');

			var reloadLink = $('<a>').addClass('reload').text('Reload').click(function() {
				siqqel.executeQuery($this, sqlQuery, hashParams, serverId);
			});
			$this.find('tr:first-child th:first-child').append(reloadLink);

		}, function(error, errorNum, server) {
			siqqel.displayError($this, 'MySQL Error: ' + error + ' (' + errorNum + ')');
		});
	},

	displayError: function($this, errorText) {
		$this.empty().addClass('error').append($('<tr>').append($('<td>').text(errorText)));
	}
}

function initTables() {
	var requiredHashParams = {};

	$('table[sql]').each(function() {
		var $this = $(this);
		
		var sqlQuery = $this.attr('sql');

		$.each(siqqel.getRequiredHashParams(sqlQuery), function() {
			requiredHashParams[this] = true;
		});

		var serverId = $this.attr('server');

		$this.html('<tr><td>loading</td></tr>');
		siqqel.executeQuery($this, sqlQuery, hashParams, serverId);
	});

	return requiredHashParams;
}

$().ready(function() {

	// load up tables with sql statements
	var requiredHashParams = initTables();
	var inputPanel = new VariableInputPanel(requiredHashParams);

	// add current hashparam to urls with trailing #

	$('a[href$=#]').live('click', function() {
		var $this = $(this);

		document.location.href = $this.attr('href').replace(/#/, document.location.hash);

		return false;
	});
});

$().ready(function() {
	$.each(siqqelReadyCallbacks, function() {
		this();
	});
});

$.fn.columnValues = function(columnName, callback) {
	var values = [];
	var i = 0;
	this.find('tr>td.' + columnName).each(function() {
		if(!callback) {
			values.push([i++, $(this).text()]);
		} else {
			values.push([i++, callback($(this).text())]);
		}
	});

	return values;
}
