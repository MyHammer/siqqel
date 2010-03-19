function VariableInputPanel(requiredParams) {
	var div = $('<div>').addClass('variableInput');
	var inputs = {};
	var allHashParamsSet = true;

	function updateHash() {
		var hash = '';

		$.each(inputs, function(paramName, input) {
			hash += (hash == '' ? '' : ',') + paramName + ':' + escape(input.val());
		});

		document.location.hash = hash;
		hashParams.init(document.location.hash);
		initTables();
	}

	$.each(requiredParams, function(paramName, value) {
		//console.log(paramName);

		var fieldId = 'variableInput' + paramName;
		var input = $('<input>').attr('id', fieldId).attr('type', 'text');
		input.bind('change', function() {
			updateHash();
		});

		if(hashParams[paramName]) {
			input.val(hashParams[paramName]);
		} else {
			allHashParamsSet = false;
		}

		inputs[paramName] = input;

		var p = $('<p>')
			.append(
				$('<label>').attr('for', fieldId).text('#' + paramName),
				input
			);
		div.append(p);
	});

	if(allHashParamsSet) {
		div.addClass('minimized');
	}

	$('body').prepend(div);
}