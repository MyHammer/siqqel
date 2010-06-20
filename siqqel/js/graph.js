$().ready(function() {
	$('div[graph]').each(function() {
		$this = $(this);
		var params = $this.attr('graph').match(/^([^:]+):(.+)/)
		if(!params) {
			$this.text('Please set the "graph" attribute to <table selector>:<column name>');
			return;
		}

		if($this.height() < 200) $this.css('height', '200px');		

		$(params[1]).live('tableLoaded', function() {
			var data = {
				data: $(this).columnValues(params[2], function(v) { return parseFloat(v); }),
				label: params[2],
				bars: { show: true, hoverable: true },
				grid: { hoverable: true }
			};
			$.plot($this, [data]);

			$this.bind("plothover", function (event, pos, item) {
				if(item) {
					console.log(item);
				}
			});			
		});
	});
});

/*

$('table#subscriptions').live('tableLoaded', function() {
	var data = [$('#subscriptions').columnValues('umsatz', function(v) { return parseFloat(v); })];
	//data = [[[0,0], [1,1]]];
	console.dir(data);
	$.plot($('#placeholder'), data); //, { xaxis: { max: 20}, yaxis: { max: 1000} });
});

*/		