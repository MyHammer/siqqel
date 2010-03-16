logViewer = {
	timeout: null,
	lastId: -1,
	userId: 0,
	limit: 50,
	load: function() {
		if(userId == 0) return -1;
		//if()

		

		dbSlayer.query( + )
	},
	setUser: function(userId) {
		
	}
};


$().ready(function() {
	$('#settingsForm').submit(function() {
		var userId = parseInt($('#userId').val().replace(/[^0-9]+/, ''));
		$('#userId').val(userId);
		document.location.hash = userId;

		return false;
	});

	if(document.location.hash) {
		$('#userId').val(document.location.hash);
		$('#settingsForm').submit();
	} else {
		$('#userId').focus();
	}
});