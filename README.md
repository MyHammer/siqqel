# What is siqqel?

siqqel is a simple and lightweight framework which allows you to execute MySQL queries directly from
your browser (by transforming them into JSON calls to a backend script), displaying the results of
your queries within the structure of the calling HTML document.

siqqel was created by Max Winde (http://github.com/343max).


# How does it work ?

To issue a query and have its results displayed in a table of your HTML document, you simply put an
SQL statement into the "sql" attribute of a table and it will be executed when you open the HTML
document in your browser:

	<table sql="SELECT name FROM user"></table>

Your browser will wrap the SQL statement into an JSON call, this call will be issued to a backend
script on your server, which in turn issues the statement against your database server, and returns
the result set back to your browser. Your browser will display the result set in the according
table. If you hover your mouse over the table, a "reload" icon will be displayed, allowing you to
re-issue the SQL statement without the need to reload the whole page.

This is how the result looks:

![Example screenshot](../raw/preparing0.3/gfx/example_screenshot.png)

# Why would I want to use siqqel?

Glad you asked. The purpose of using siqqel probably isn't obvious. If you want to query your
MySQL database, there are tons of tools available: Some that are more "low level" and allow you to
issue a single query and to display the result set of this query, like the mysql command line tool
or phpMyAdmin. And there are a lot of high level reporting tools or full flegded data warehouse
solutions.

siqqel fills the gap between these two extremes. Sometimes you need to create a small report based
on a hand full of tables, which is awkward to do in phpMyAdmin because you need to have several tabs
open in parallel, and if you want to see your "report" on the following day again, you better saved
all those SQL queries in a textfile. On the other hand, this report really is more of an ad hoc
nature, probably you just want to see a first trend for a couple of days, after launching an new
feature in your product. The overhead to create a report in your enterprise data warehouse simply
isn't justified.

This is where siqqel fits just perfectly. Once you installed the backend script on a webserver which
has access to your database, it's very simple to create an ad hoc report.
All you need to do is to create an HTML file (which can reside on your local harddrive and doesn't
need to be saved on a webserver) and put your queries into `<table>` elements. This will display the
result sets of these queries right in your HTML document when you open it in a browser.

This way, it's very simple to create a dashboard-like overview over the results of several queries
on one page.

So, why did we create this strange setup with local HTML files, JSON and so on?

Well, this is where the real strength of siqqel lies: Up until now, if you wanted to enable the
non-developers in your team to create ad hoc reports from your database, you either gave them access
to a phpMyAdmin installation or tools like Toad (which aren't suited for more complex reports, see
above), or you teached them some basic PHP knowledge, and gave them FTP access to a local webserver
where they could upload their hacked-together scripts and open them in their browser.

You have never been really happy with this solution, have you?

With siqqel, you need to install a PHP script on a web server exactly once. If this setup has been
done, all that your teammates need to query your database and display the results is an HTML file.
On their local drive. Everythings happens within the browser! Here's how:

	Your browser, having
	loaded a local ("file:///...")
	html document which references              The siqqel PHP library
	the siqqel js file on your server           on your web server,
	and containing an HTML table element        receiving your query and
	with an "sql" attribute featuring a         creating a MySQL call
	SQL statement                               from it

	|=======================|                   |-----------------------|                  |----------|
	|-----------------------| - JSON Request -> |                       | -- SQL Query --> |          |
	|                       |                   |                       |                  |          |
	| <table sql="          |                   | $result =             |                  | MySQL DB |
	| SELECT name FROM user |                   | mysqli_query(         |                  |          |
	| "/>                   |                   | SELECT name FROM user)|                  |          |
	|-----------------------|                   |-----------------------|                  |----------|
	                                                                                            |
	                                                                                            |
	|=======================|                   |-----------------------|                       |
	|-----------------------|                   |                       |                       |
	| name                  |                   |                       |                       |
	| ---------             |                   |                       |                       |
	| Han Solo              |                   | json_encode($result); |                       |
	| Chewbacca             | <- JSON Result -- |                       | <-- SQL Result -------/               
	|-----------------------|                   |-----------------------|                 
	
	Your browser, after decoding                The siqqel PHP library,
	the JSON response and rendering              transforming the MySQL
	the result data into the table              result into a JSON response


# Getting started

* Create your siqqel/config.inc.php from siqqel/config.inc.sample.php

* Put the whole siqqel subfolder onto a PHP enabled webserver
  (e.g. `http://myserver.com/siqqel/`)

* Copy example.html wherever you like (e.g. you desktop)

* Replace the example url to siqqel.js.php with the url where you put the siqqel folder
  (e.g. `src="http://myserver.com/siqqel/siqqel.js.php"`)

* Put your own queries into example.html

* Open your local version of example.html with your favourite browser


# Advanced usages

## Parameters

You may also pass parameters form the URL to your sql-Query, by creating a "hashParam".

You do this like this: `SELECT #myParam;`
then put this param into the URL like this: http://localhost/myQuery.php#myParam:1

Your param will be escaped but not quoted in any way, so this example is prone to SQL injections.

To prevent raw SQL queries from floating over HTTP you may plug in your own SQL-encryption. Until
then you should not run this tool on an unsecured webserver and not give access to someone you
wouldn't give your mySQL password.

## Events

when loaded, each table, row and cell send a "loaded" event, so you can easly manipulate everything
for your purpose:

	$('td.userId').live('loaded', function(userId) {
		// do something useful.
	});

Possible events are:
* `loaded` for a cell
* `rowLoaded` for a row
* `tableLoaded` for the whole table.

Every cell gets two css classes: the name of the column and the type (eg: `userId TYPE_LONG`) so you
can format it using css and manipulate it via jQuery.

Every row gets a class "row" and a class "row" + rowNumber so `$('#myQuery tr.row1')` will match the
first row of your resultset.

## Simple bargraphs

You can put an simple bargraph into the background of a table by adding a `graph` attribute to
your table.
The `graph` attribute should contain the name of the column you want to use for the graph:

	<table sql="SELECT contributerName, COUNT(*) AS number FROM commits GROUP BY contributorName"
	     graph="number">
	</table>
