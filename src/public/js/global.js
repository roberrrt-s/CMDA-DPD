var upload = document.getElementById("file-upload");

// If there's a file-upload available, apply an event that inserts a preview image
if(upload) {
	upload.onchange = function () {
	    var reader = new FileReader();

	    reader.onload = function(e) {
	    	document.getElementById("preview-text").remove();
	        document.getElementById("preview-image").src = e.target.result;
	    };

	    reader.readAsDataURL(this.files[0]);
	}; 
}
