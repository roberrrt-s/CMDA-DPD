// Regular modules
var express = require('express'),
    session = require('express-session'),
    myConnection = require('express-myConnection')
    crypto = require('crypto'),
    FileStore = require('session-file-store')(session),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	path = require('path'),
	hbs = require('hbs'),
	mysql = require('mysql'),
	app = express(),
	Twitter = require('twitter'),

	// Starting the server
	server = app.listen(3001, function () {
		console.log('Dashboard is listening on port 3001!');
	}),

    http = require('http').Server(app),
	io = require('socket.io').listen(server),

	reloader = require('./lib/reloader.js');

// Defining routes
var index = require('./routes/index')

	// api
	api = require('./routes/api/index'),
	output = require('./routes/api/output/index'),

	// dashboard
	dashboard = require('./routes/dashboard/index'),
	screen = require('./routes/dashboard/screen/index'),
	slideshow = require('./routes/dashboard/slideshow/index'),
	slide = require('./routes/dashboard/slideshow/slide/index'),
	content = require('./routes/dashboard/content/index');

// Defining database options
var dbconfig = {
    host: 'localhost',
    user: 'root',
    password: 'hallo123',
    database: 'dpd',
    port: 3306
};

// Connecting with Twitter

// Connect with the database by extending the request object
app.use(myConnection(mysql, dbconfig, 'single'));

// Define the templating engine we'll be using (handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials'); //register hbs partials

// Define static path for css/js
app.use('/', express.static(__dirname + '/public'));

// Defining the body parser to parse user data from the <body>
app.use(bodyParser.urlencoded({extended: true}));

// Defining the cookie parser to parse cookies 
app.use(cookieParser()); //enable cookies

// Enable sessions
app.use(session({
    secret: 'nerd',
    store: new FileStore(), //store the session in a file
    saveUninitialized: true,
    resave: false
}));

// Using routes
app.use('/', index);

// api
app.use('/api', api);
app.use('/api/output', output);

// dashboard
app.use('/dashboard', dashboard);
app.use('/dashboard/screen', screen);
app.use('/dashboard/slideshow', slideshow);
app.use('/dashboard/slideshow/edit', slide);
app.use('/dashboard/content', content);

