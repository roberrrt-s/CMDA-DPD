var upload = document.getElementById("file-upload");
var preview = document.getElementById("preview")
var checkReader = new FileReader();

if(preview) {
	preview.style.display = "block"
}

if(checkReader && upload) {
// If there's a file-upload available, apply an event that inserts a preview image
	upload.onchange = function () {
	    var reader = new FileReader();

	    reader.onload = function(e) {
	    	document.getElementById("preview-text").remove();
	        document.getElementById("preview-image").src = e.target.result;
	    };

	    reader.readAsDataURL(this.files[0]);
	}; 
}
