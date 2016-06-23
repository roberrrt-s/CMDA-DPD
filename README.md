# CMDA-DPD
CMD Amsterdam - Digital Poster Dashboard

### Table of contents

 - Introduction
 - datamodel
 - src
 - static 
 - About

### Introduction

Mathijs Blekemolen asked of us to create a system that could serve content on (future) television screens that would be deployed around the Theo Thijssenhuis. The current system of paper posters is too slow and infrequently updated. Mathijs is currently researching alternatives, and has asked for our help with this issue.

##### Must haves:

 - Content should be served at a television screen.
 - I want to be able to alter and change the content whenever I want.
 - I do not wish to be behind a computer to change the content, but use my phone instead as well.

I've come up with a dashboard system, a 'Content Management System' which creates an output for the API on which the content is served. The content gets formatted into slideshows, which then gets echoed on the output, creating a simple slide show with some JS/CSS

For the dashboard, users from the HvA can login and alter data (screens/slideshows/content).

And to fullfill the last requirement, I have approached the dashboard mobile-first, so the entire site is pleasently usable on a phone.

##### To-do

 - Create a socket connection to refresh the website whenever there's an update from the backend
 - Remember choices in slideshow when editting
 - Implement promises to ensure proper handling of queries
 - Improve the animation of the slideshow

### datamodel
 
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

### About

Created for CMD Amsterdam (Mathijs Blekemolen) by Robert Spier as final assignment for the minor "Everything Web - Web Development"

##### Courses implemented

 - Web App From Scratch
 	- Set up a routing system based on the Javascript syntax (Express)
 	- Implemented handlebars as a templating engine to display dynamic content
 	- Created my own API to serve data from
 	- Set up several modules using the IIFE principle to spread code
 	- Created several get/post routes

 - CSS to the Rescue
 	- Set up a mobile-first application
 	- Used flexbox for building the entire website
 	- Used Pseudo-classes to clarify inside the web application
 	- Applied repeatable styling which can be re-used anywhere on the site
 	- Specified all selectors to be as specific as possible

 - Browser Technologies
 	- Used as much server side traffic as possible, to avoid XHR / Unsupported javascript
 	- Applied a Progressive Enhanced approach, using newer technologies only as addition, never as core functionality
 	- Set up forms in a robust way to make sure it works all the time.
 	- Used semantic HTML which can be read by screen readers
 	- All core functionalities can be used without a mouse

 - Performance Matters
 	- Minimized the amount of traffic by avoiding XHR
 	- Avoided library's in the users backend, coded using the bare minimum (primarly in Node)
 	- Used prepros to optimize all CSS/JS (taskmanager)
 	- Minimized the amount of fonts loaded