// web
var http = require('http'),
    express = require('express'),
    path = require('path');

// database
var nedb = require('nedb'),
	dbPath = 'C:\\nodejs\\filestore.nedb',
	db = new nedb({ filename: dbPath, autoload: true });
 
// express
var app = express();
app.set('port', process.env.PORT || 3000); 
app.use(express.static(path.join(__dirname, 'public')));

// other
var isNumeric = require('isnumeric');

var htmlBody = '';
var htmlHeader = '<!DOCTYPE html><html><body><form action="/find" method="get"><input type="text" name="nummer"></input><input type="submit" value="suchen"></input></form><br /><table>';
var htmlEnd = '</table></body></html>'
 
app.get('/', function (req, res) {
  res.send('<html><body><form action="/find" method="get"><input type="text" name="nummer"></input><input type="submit" value="suchen"></input></form></body></html>');
});

app.get('/:a?/:b?', function (req,res) {

	htmlBody = '';

	var param = '';

	console.log('query: ' + req.query['nummer']);

	console.log('param: ' + req.params.b);
	
	if(req.params.b == undefined && req.query['nummer'] == undefined) {
		console.log('fuk query');
	} else {
		if (req.params.b == undefined) { param = req.query['nummer']; };
		if (req.query['nummer'] == undefined) { param = req.params.b; };
	}
	
	switch(req.params.a) {
		case 'find':
			if (isNumeric(param)) {
				findWhat = param;
				var rePattern = new RegExp(findWhat);
				console.log(rePattern);
				
				db.find({id: rePattern}, function (err, docs) {
					// generate htmlBody
					docs.forEach(function(item){
						htmlBody = htmlBody + '<tr><td>' + item.path + '</td>' + '<td><a href="/get/' + item._id + '">Download</a>' + '</td></tr>'
					})
							
					res.send(htmlHeader + htmlBody + htmlEnd);
				});
			} else {
				res.send('<html><body><h1>Input not numeric</h1></body></html>');
			}
		break;
		case 'get':
			db.find({_id: param}, function (err, docs) {
				console.log('SendFile: ' +  docs[0].path);
				res.sendFile(docs[0].path);
			});
			break;
		default:
			res.send('<html><body><h1>Please use FIND (do search in DB) or GET(do retrive File)</h1></body></html>');
	}
	
});
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});