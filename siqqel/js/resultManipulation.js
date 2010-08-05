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
