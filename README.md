# CMDA-DPD
CMD Amsterdam - Digital Poster Dashboard

### Table of contents

 - datamodel
 - src
 - static 
 - about

### Datamodel

I've used a MySQL database with 5 tables for this application:

 - user
 - content
 	- slideshow_has_content
 - slideshow
 - screen

##### user
The `user` table holds the user information with encrypted passwords, names and emails

##### content
The `content` table holds the content reference, also defines type, uploader and name/desciption.

##### slideshow_has_content
The `slideshow_has_content` table is a link table to enable a many-to-many relation between de `slideshow` and `content` table

##### slideshow
The `slideshow` table defines the basic container for slideshows

##### screen
The `screen` table holds the container for screens

### src

I've created a NodeJS/Express/MySQL based CMS/Dashboard to create an API, which can be read from a screen.
Users can register accounts (which are restricted to HvA emails only), and login to the dashboard.

The dashboard consist of a home screen with a basic explanation, settings (which you can use to end your session and logout), content, slideshows and screens.
I've set up a routing system using handlebars (.hbs) templates to generate dynamic web pages. Data is acquired through queries (protected / escaped) from the database.
Multer is being used to upload images, which is supported on mobile phones.
I've written multiple modules to enhance and modulate my code, the most usefull one being the `sqlLibrary.fn()` which serves query's in the return statement.
In addition, my `filterType.fn()` module returns functions for the `array.filter()` function.


The API consist of a single dynamic route (api/output/:id) which serves content from a slideshow on a screen, which is then echoed over a URL.

### static

Static is a folder with a static prototype of the entire product. This prototype has been used in the first 2/3 weeks to collect feedback from both Mathijs and students. It involves prototypes for the dashboard with static content, and examples of the api/output/:id for video's, images and tweets.

### about

Created for CMD Amsterdam (Mathijs Blekemolen) by Robert Spier as final assignment for the minor "Everything Web - Web Development"