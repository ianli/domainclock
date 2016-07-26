//	Domain Clock
//	http://ianli.com/domainclock/
//	
//	Copyright (c) Ian Li http://ianli.com
//	Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

(function (window, $, undefined) {
	
	// The textual equivalent of the numbers.
	var ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
		TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty"],
		MINUTES = [
			"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", 
			"ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
		],
		HOURS = [
			"twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
			"twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"
		];
	
	// Generate the textual equivalent of the minutes from 20 to 59.
	for (var tens = 2; tens < 6; tens++) {
		for (var ones = 0; ones < 10; ones++) {
			if (ones == 0) {
				MINUTES.push(TENS[tens]);
			} else {
				MINUTES.push(TENS[tens] + " " + ONES[ones]);
			}
		}
	}
	
	function flip(value) {
		if (typeof value === 'undefined') {
			value = 2;
		}
		
		return Math.floor(Math.random() * value);
	}
	
	function within12(h) {
		var hh = h % 12;
	 	return (hh == 0) ? 12 : hh;
	}

	function doubleDigits(i) {
		return (i < 10) ? '0' + i : i;
	}
	
	// The DomainClock class is responsible for changing the displayed time.
	window.DomainClock = function () {
		this.currentTime = null;
		this.colonOn = false;
	};
	DomainClock.prototype = {
		start: function() {
			var app = this;
			setInterval(
				function() {
					app.update();
				},
				500
			);
		},

		update: function() {
			var today = new Date(),
				h = today.getHours(),
				m = today.getMinutes();
			
			var newTime = (h * 60) + m;
			if (newTime != this.currentTime) {
				// Update the clock if the time is new.
				this.updateDomains(h, m);
			}
			
			this.blink();
			
			this.currentTime = newTime;
		},
		
		// Blinks the dot in the domain name like the colon in a digital clock.
		blink: function () {
			$('#colon').css('color', this.colonOn ? '#222' : 'inherit');
			this.colonOn = !this.colonOn;
		},

		updateDomains: function(h, m) {
			// Numerical versions of h and m
			var hNumerical = doubleDigits(within12(h)),
				mNumerical = doubleDigits(m),
				
				// Textual versions of h and m
				hTextual = HOURS[h],
				mTextual = MINUTES[m];
				
			// Add the hour.
			var url = flip() ? hNumerical : hTextual;
			
			if (m == 0) {
				// Minutes is 0, so there are 3 options:
				// * 3 o'clock
				// * 3 pm
				// * 3
				switch (flip(3)) {
					case 0:
						// Add oclock.
						url += ' o clock';
						break;
					case 1:
						// Add the meridian.
						url += ' ' + ((h < 12) ? 'am' : 'pm');
						break;
					default:
						// Do nothing.
						break;
				}
			} else {
				// Minutes is not 0, so add the minutes.
				url += ' ' + (flip() ? mNumerical : mTextual);
				
				if (flip()) {
					// Add the meridian.
					url += ' ' + ((h < 12) ? 'am' : 'pm');
				}
			}
			
			// Randomly choose to remove spaces or replace with dashes.
			if (flip()) {
				url = url.replace(/\s+/g, '');
			} else {
				url = url.replace(/\s+/g, '-');
			}
			
			// Add the extension.
			url += '.com';
			
			// Prepare the displayed URL.
			var html = (url + "").replace('.', '<span id="colon">.</span>');
			
			$('#clock')
				.attr('href', 'http://' + url)
				.html(html);
		}
	};
	
})(window, jQuery);