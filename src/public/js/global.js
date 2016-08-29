var upload = document.getElementById("form-upload");
var checkReader = new FileReader();

if(checkReader && upload) {

	console.log('yay')
// If there's a file-upload available, apply an event that inserts a preview image
	upload.onchange = function () {
	    var reader = new FileReader();

	    reader.onload = function(e) {
	    	var symbol = document.getElementById("add-symbol");
	    	symbol.parentNode.removeChild(symbol);
	        document.getElementById("preview-image").src = e.target.result;
	    };

	    reader.readAsDataURL(this.files[0]);
	}; 
}
