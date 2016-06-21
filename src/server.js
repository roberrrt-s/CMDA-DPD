// Regular modules
var express = require('express'),
    session = require('express-session'),
    fs = require('fs'),
    http = require('http').Server(app),
	bodyParser = require('body-parser'),
	path = require('path'),
	hbs = require('hbs'),
	mysql = require('mysql'),
	multer = require('multer'),
	app = express();

// Defining routes
var index = require('./routes/index')

	// api
	api = require('./routes/api/index'),
	media = require('./routes/api/media/index'),
	output = require('./routes/api/output/index'),

	// dashboard
	dashboard = require('./routes/dashboard/index'),
	screen = require('./routes/dashboard/screen/index'),
	slideshow = require('./routes/dashboard/slideshow/index'),
	content = require('./routes/dashboard/content/index'),
	settings = require('./routes/dashboard/settings/index'),



// Define the templating engine we'll be using (handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials'); //register hbs partials

// Define static path for css/js
app.use('/', express.static(__dirname + '/public'));

// Using routes
app.use('/', index);

// api
app.use('/api', api);
app.use('/api/media', media);
app.use('/api/output', output);

// dashboard
app.use('/dashboard', dashboard);
app.use('/dashboard/screen', screen);
app.use('/dashboard/slideshow', slideshow);
app.use('/dashboard/content', content);
app.use('/dashboard/settings', settings);


// Start the application on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});