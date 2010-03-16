sqlHammer = {
	executeQuery: function($this, sqlQuery, hashParams) {

		$this.addClass('loading');

		dbSlayer.query(sqlQuery, hashParams, function(rows, header, types) {
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

				tr.trigger('loaded', row);
			});

			$this.trigger('loaded').removeClass('loading');

			var reloadLink = $('<a>').addClass('reload').text('Reload').click(function() {
				sqlHammer.executeQuery($this, sqlQuery, hashParams);
			});
			$this.find('tr:first-child th:first-child').append(reloadLink);

		}, function(error, errorNum, server) {
			sqlHammer.displayError($this, 'MySQL Error: ' + error + ' (' + errorNum + ')');
		});
	},

	displayError: function($this, errorText) {
		$this.empty().addClass('error').append($('<tr>').append($('<td>').text(errorText)));
	},

	encryptQuery: function(sqlQuery) {
		return sqlQuery;
	}
}

$().ready(function() {
	$('table[sql]').each(function() {
		var $this = $(this);
		$this.html('<tr><td>loading</td></tr>');
		sqlHammer.executeQuery($this, eval('(' + $this.attr('sql') +')'), hashParams);
	});

	$('a[href$=#]').each(function() {
		var $this = $(this);

		$this.attr('href', $this.attr('href').replace(/#/, document.location.hash));

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

$('td.timestamp, td.timestampExact').live('loaded', function(event, timestamp) {
	$(this).text(toDateTime(timestamp));
});

$('td.timestampDay').live('loaded', function(event, timestamp) {
	$(this).text(toDate(timestamp));
});

$('td.TYPE_BLOB').live('loaded', function(event, text) {
	summarizeText($(this));
});