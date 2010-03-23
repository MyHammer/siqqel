sqlHammerEncodingBackend = 'js';

({
	config: '!!configHere!!',

	loadJs: function(src) {
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('script');
		s.setAttribute('src', src);
		head.appendChild(s);
	},

	loadCss: function(src) {
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('link');
		s.setAttribute('rel', 'stylesheet');
		s.setAttribute('href', src);
		head.appendChild(s);
	},

	init: function() {
		window.sqlHammerBaseUrl = this.config.baseUrl;
		for(var i = 0; i < this.config.javaScriptFiles.length; i++) {
			this.loadJs(this.config.baseUrl + this.config.javaScriptFiles[i]);
		}

		for(var i = 0; i < this.config.cssFiles.length; i++) {
			this.loadCss(this.config.baseUrl + this.config.cssFiles[i]);
		}

	}
}).init();