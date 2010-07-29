siqqel = {
	encryptQuery: function(sqlQuery) {
		var sqlObject = {
			'sqlQuery': sqlQuery
		};

		var requiredHashParams = [];

		sqlQuery.replace(/#([a-zA-Z0-9_]+)/g, function(m, param) {
			requiredHashParams.push(param);
			return m;
		});

		sqlObject.requiredHashParams = requiredHashParams;

		return sqlObject;
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
		if(siqqelEncodingBackend == 'php') {
			var sqlQuery = eval('(' + $this.attr('sql') +')');
		} else {
			var sqlQuery = siqqel.encryptQuery($this.attr('sql'));
		}

		$.each(sqlQuery.requiredHashParams, function() {
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

function toDateTime(timestamp) {
	if(timestamp == 'NULL') return timestamp;
	var date = new Date();
	date.setTime(parseInt(timestamp) * 1000);
	return date.toString().replace(/GMT.*/, '');
}

function toDate(timestamp) {
	if(timestamp == 'NULL') return timestamp;
	var date = new Date();
	date.setTime(parseInt(timestamp) * 1000);
	return date.toString().replace(/[0-9]+:.*/, '');
}

function summarizeText($this) {
	if($this.html().length < 200) return;
}

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

$('td.timestamp, td.timestampExact').live('loaded', function(event, timestamp) {
	$(this).text(toDateTime(timestamp));
});

$('td.timestampDay').live('loaded', function(event, timestamp) {
	$(this).text(toDate(timestamp));
});

$('td.TYPE_BLOB').live('loaded', function(event, text) {
	summarizeText($(this));
});
