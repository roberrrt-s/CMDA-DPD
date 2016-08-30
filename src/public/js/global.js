var upload = document.getElementById("form-upload");
var checkReader = new FileReader();

if(checkReader && upload) {

	console.log('yay')
// If there's a file-upload available, apply an event that inserts a preview image
	upload.onchange = function () {
	    var reader = new FileReader();

	    reader.onload = function(e) {
	    	var symbol = document.getElementById("add-symbol");
	    	if(symbol) {
	    		symbol.parentNode.removeChild(symbol);
	    	}
	        document.getElementById("preview-image").src = e.target.result;
	    };

	    reader.readAsDataURL(this.files[0]);
	}; 
}

var checkpage = document.getElementById('main-form')

if(checkpage) {

	function reset() {
		var hide = document.querySelectorAll('fieldset:not(.always)')

		console.log('i run')
		for(var i = 0; i < hide.length; i++) {
			hide[i].classList.add('hide-item')
		}		
	}

	function assignClicks() {
		// image
		document.getElementById('form-radio-1').addEventListener('click', function() {
			reset()
			var list = document.querySelectorAll('.has-image');
			for(var i = 0; i < list.length; i++) {
				list[i].classList.remove('hide-item');
			}
		})
		// video
		document.getElementById('form-radio-2').addEventListener('click', function() {
			reset()
			var list = document.querySelectorAll('.has-video');
			for(var i = 0; i < list.length; i++) {
				list[i].classList.remove('hide-item');
			}
		})
		// tweet
		document.getElementById('form-radio-3').addEventListener('click', function() {
			reset()
			var list = document.querySelectorAll('.has-tweet');
			for(var i = 0; i < list.length; i++) {
				list[i].classList.remove('hide-item');
			}
		})

		// new
		document.getElementById('form-radio-4').addEventListener('click', function() {
			var list = document.querySelectorAll('.has-new-image');
			var other = document.querySelectorAll('.has-existing-image');

			for(var i = 0; i < other.length; i++) {
				other[i].classList.add('hide-item');
			}
			for(var i = 0; i < list.length; i++) {
				list[i].classList.remove('hide-item');
			}
		})

		// existing
		document.getElementById('form-radio-5').addEventListener('click', function() {
			var list = document.querySelectorAll('.has-existing-image');
			var other = document.querySelectorAll('.has-new-image');

			for(var i = 0; i < other.length; i++) {
				other[i].classList.add('hide-item');
			}
			for(var i = 0; i < list.length; i++) {
				list[i].classList.remove('hide-item');
			}
		})

	}

	reset();
	assignClicks();

}
