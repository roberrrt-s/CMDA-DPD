$("#slideshow > section:gt(0)").hide();

setInterval(function() { 
  $('#slideshow > section:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
},  10000);