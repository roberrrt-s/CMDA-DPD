if(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1){
	var font = new FontFaceObserver('Open Sans');

	font.load().then(function () {
		document.body.className = "font-ready";
	});
}
else {
	document.body.className = "font-support";
}