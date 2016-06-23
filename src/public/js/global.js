var upload = document.getElementById("file-upload");

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
