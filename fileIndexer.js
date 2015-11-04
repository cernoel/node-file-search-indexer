var nowYear = new Date().getFullYear();
var filewalker = require('filewalker');
var fs = require('fs');
var nedb = require('nedb');
var isNumeric = require('isnumeric');
var pathCheck = require('path');
var walkPath = 'E:\\Dokumente';
var dbPath = 'C:\\nodejs\\filestore.nedb';
var fileFilter = '.pdf';
var directorysToWalk = [];

// create new DB File
fs.stat(dbPath, function(err, stat) {
    if(err == null) {
		fs.unlink(dbPath);
		// fs.closeSync(fs.openSync(dbPath, 'w'));
    } else if(err.code == 'ENOENT') {
        console.log('file doesnt exist');
		// fs.closeSync(fs.openSync(dbPath, 'w'));
    } else {
        console.log('Some other error: ', err.code);
    }
});

//Open DB
var db = new nedb({ filename: dbPath, autoload: true });

// get all Files in WalkPath
var files = fs.readdirSync(walkPath);

// Prepare Directory List
files.forEach(function(item) {
	var isDir = false;
	isDir = fs.statSync(walkPath + '\\' + item).isDirectory();
	if(isDir) {
		// if its nowYear OR nowYear-1
		// if(item.substring(0,4) == nowYear || item.substring(0,4) == (nowYear - 1) ) {
		if(item.substring(0,4) == nowYear) {
			//console.log(item);
			directorysToWalk.push(walkPath + '\\' + item);
		}
	}
});

//walk directorys.. only pdfs
directorysToWalk.forEach(function(item) {
	filewalker(item)
	  .on('file', function(p, s, f) {
			if(findFileExtension(f, fileFilter)) {
				var docType = getDocType(f);
				if (docType == '') {} else {
					var docId = getDocId(f);
					var doc = { path: f, type: docType, id: docId };
					db.insert(doc, function (err, newDoc) { })
				}
			}
	   })
	.walk();
});

function findFileExtension(path, extension) {
	var found = false;
	var extensionLength = extension.length;
	var pathLower = path.toLowerCase();
	var pathLength = path.length;
	
	if (pathLength > extensionLength) {
		var readFrom = pathLength - extensionLength;
		if (pathLower.substring(readFrom) == extension) {
			found = true;
		}
	}
	
	return found;
}

function getDocId(path) {
	var docId = '';
	var docName = pathCheck.basename(path);
	var docName2Arr = docName.split('-');
	
	docId = docName2Arr[2];
	
	return docId;
}

function getDocType(path) {
	var docType = '';
	
	docType = pathCheck.basename(path);
	docType = docType.substring(0,2);
	
	switch(docType) {
		case 'ab':
			docType = 'Auftragsbestaetigung';
			break;
		case 'be':
			docType = 'Bestellung';
			break;
		case 'fa':
			docType = 'Faktura';
			break;
		case 'ko':
			docType = 'Kommissionsschein';
			break;
		case 'lf':
			docType = 'Lieferschein';
			break;
		case 'of':
			docType = 'Offert';
			break;
		case 'di':
			docType = 'Disposchein';
			break;
		default:
			docType = '';
	}
	
	return docType;
};

// if DebugSwitch is on, wait for console input.
if (process.argv[2] == 'debug') {
	console.log('Debug activated');
	var stdin = process.openStdin();
	stdin.addListener("data", function(d) {
		var fullCommand='';
		var commandArray=[ ];
		fullCommand = d.toString().substring(0, d.length-2).toLowerCase();
		commandArray = fullCommand.split(" ");
		switch(commandArray[0]) {
			case 'help':
				console.log('no help available ... now');
				break;
			case 'show':
				db.find({}, function (err, docs) {
					console.log(docs);
				});
				break;
			case 'find':
				if (isNumeric(commandArray[1])) {
					findWhat = commandArray[1];
					var rePattern = new RegExp(findWhat);
					console.log(rePattern);
					
					db.find({path: rePattern}, function (err, docs) {
						console.log(docs);
					});
				} else {
					console.log('not numeric');
				}
				break;
			case 'quit':
				console.log('bye!');
				process.exit(0);
				break;
			default:
				console.log('command not found');
		} //end switch
		process.stdout.write('>');
	}); // end stdin.addlistener
} //if debug mode on
