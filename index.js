var https = require('https');
var express = require('express');
var async = require('async');
var officegen = require('officegen');
var app = express();
var $ = require('cheerio');
var fs = require('fs');
var path = require('path');
var curator = require('./node_modules/art-curator/dist/index.js');
var mammoth = require("mammoth");
var striptags = require('striptags');
var util = require('util');
var Busboy = require('busboy');
var busboy = require('connect-busboy');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var Jimp = require('jimp');

require('dotenv').config();

$.prototype.eq = function (placement) {
	var eq = [];
	this.each(function (index, item) {
		if (index == placement) {
			eq.push(item);
		}
	});

	return $(eq);
}

module.exports = {
	normalizeLocation: normalizeLocation
}

var ssl = {
	cert: fs.readFileSync('/etc/letsencrypt/live/trineura.cf/fullchain.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/trineura.cf/privkey.pem')
};

app.use(bodyParser.json({limit: '50mb'}));
app.use(busboy());
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/app'));
//views is directory for all template files
app.set('views', __dirname + '/app');
app.engine('html', require('ejs').renderFile);
app.get('/', function (request, response) {
	response.render('app/index.html');
});

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
https.createServer(ssl, app).listen(443);

/**
 * @memberof myApp.index
 The word document is parseed via saved html using Cheerio.
 We will also formalize the data values by removing quotation marks for titles,
 and make a list of locations. */
app.use('/uploads/images', express.static('uploads/images'));
var newFileName;

function grabInfo(element, findString, replaceString, isImage)
{
	if (typeof element == "undefined" || element == null)
	{
		var text = "No Data";
		return text;
	} else {
		if (isImage)
		{
			var value = element.replace(findString, replaceString);
		} else {
			var value = element.replace(findString, replaceString).trim();
		}
		return value;
	}
}

function checkIfNullOrEmpty(element)
{
	if (typeof element == "undefined" || element == null || element == "" || element.indexOf("data:image") == -1)
	{
		return "";
	} else {
		return element;
	}
}

function addThumbnail(artwork) {
	return new Promise(function (resolve, reject) {
		try {
			if (artwork.image.imageFile == "") {
				resolve(artwork);
			}

			var imgSrc = artwork.image.imageFile.substr(artwork.image.imageFile.indexOf("base64,") + 7);

			var jimp = Jimp.read(Buffer.from(imgSrc, 'base64'), (err, image) => {
				if (image == null) {
					resolve(artwork);
				} else {
					image.resize(60, 60);
					image.getBase64(image.getMIME(), function (err, base64Data) {
						artwork.thumbnail = base64Data;
						resolve(artwork);
					});
				}
			})
		} catch (err) {
			reject(err);
		}
	})
}

// prosess data
function processData(artworks) {
	var promises = [];
	for (var it = 0; it < artworks.length; it++) {
		var artwork = artworks[it];
		artwork.next = (artworks[it + 1]) ? artworks[it + 1].assetRefNo : null;
		artwork.previous = (artworks[it - 1]) ? artworks[it - 1].assetRefNo : null;
		promises.push(addThumbnail(artwork))
	}
	return new Promise(function (resolve, reject) {
		Promise.all(promises)
			.then(data => {
				resolve(data);
			}).catch(err => {
			reject(err);
		})
	})
}

app.post('/upload', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if (req.method === 'POST') {
		var busboy = new Busboy({headers: req.headers});

		busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
			{
				var datetimestamp = Date.now();
				newFileName = fieldname + '-' + datetimestamp + '.' + filename.split('.')[filename.split('.').length - 1];
				var saveTo = path.join('./tmp/', newFileName);
				file.pipe(fs.createWriteStream(saveTo));
			} else {
				res.status(400).send(["Invalid file format."]);
				return false;
			}
		});
		busboy.on('finish', function () {
			mammoth.convertToHtml({path: "tmp/" + newFileName})
				.then(function (result) {

					var html = "<div class='wrapper'>" + striptags(result.value, '<p><img>') + "</div>";
					var parsedHTML = $.load(html);

					var elementsArray = [];

					parsedHTML('.wrapper').children('p').each(function () {
						var element = $(this);
						var imgElement = element.find("img");
						if (imgElement.length > 0) {
							var elementText = element.text();
							if (elementText.indexOf("Office Location") != -1)
							{
								elementsArray.push(elementText);
								elementsArray.push(imgElement.attr('src'));
							} else if (elementText.indexOf("Asset Reference No") != -1) {
								elementsArray.push(imgElement.attr('src'));
								elementsArray.push(elementText);
							} else {
								elementsArray.push(imgElement.attr('src'));
							}
						} else {
							elementsArray.push(element.text());
						}
					});

					var artworksDataArray = [];
					var imagesArray = [];
					var dataErorrs = [];
					for (var i = 0; i < elementsArray.length; i++)
					{
						if (elementsArray[i].indexOf("Asset Reference No") != -1)
						{
							var artworkDetailsObj = {};
							var imageObj = {};

							var referenceNo = grabInfo(elementsArray[i], "Asset Reference No:", "", false);
							var artist = grabInfo(elementsArray[i + 1], "Artist:", "", false);
							var title = grabInfo(elementsArray[i + 2], "Title:", "", false);
							var size = grabInfo(elementsArray[i + 3], "Size:", "", false);
							var amountPaid = grabInfo(elementsArray[i + 4], "Amount Paid:", "", false);
							var insured = grabInfo(elementsArray[i + 5], "Insured:", "", false);
							var provenance = grabInfo(elementsArray[i + 6], "Provenance:", "", false);
							var officeLocation = grabInfo(elementsArray[i + 7], "Office Location:", "", false);

							artworkDetailsObj.assetRefNo = referenceNo;
							artworkDetailsObj.artist = artist;
							artworkDetailsObj.title = title;
							artworkDetailsObj.size = size;
							artworkDetailsObj.amountPaid = amountPaid;
							artworkDetailsObj.insured = insured;
							artworkDetailsObj.provenance = provenance;
							artworkDetailsObj.officeLocation = officeLocation;
							artworkDetailsObj.imageFileName = "image-" + artworkDetailsObj.id + ".jpeg";
							artworkDetailsObj.inspected = false;
							artworkDetailsObj.text = "";

							imageObj.imageFile = checkIfNullOrEmpty(elementsArray[i + 8]);
							imageObj.assetRefNo = referenceNo;
							imageObj.additionalImages = [];
							artworkDetailsObj.image = imageObj;

							var dupRef = artworksDataArray.filter((value) => {
								return value.assetRefNo == referenceNo;
							});
							if (!imageObj.imageFile) {
								dataErorrs.push("Image type error : [referenceNo: " + referenceNo + ", title:" + title + "]");
							}
							if (dupRef.length > 0) {
								dataErorrs.push("Duplicate assetRefNo : [referenceNo: " + referenceNo + ", title:" + title + "]")
							}

							artworksDataArray.push(artworkDetailsObj);
							imagesArray.push(imageObj);
						}
					}

					if (dataErorrs.length > 0) {
						res.status(400).send(dataErorrs);
						return false;
					}
					// save data to database
					MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
						if (err) {
							res.status(404).send(["Database connection error"]);
							return false;
						}
						processData(artworksDataArray)
							.then(data => {
								var artworkCol = db.collection('artworks');
								var imageCol = db.collection('images');
								var artistCol = db.collection('artists');
								var metaCol = db.collection('meta');
								var artworkBulk = artworkCol.initializeUnorderedBulkOp();
								var imageBulk = imageCol.initializeUnorderedBulkOp();
								var artistBulk = artistCol.initializeUnorderedBulkOp();

								var promises = [
									artworkCol.remove(),
									imageCol.remove(),
									artistCol.remove()
								];
								var uniqueArtists = [];
								for (var it = 0; it < data.length; it++) {
									var artwork = data[it];
									var image = artwork.image;
									delete artwork.image;
									var artist = {
										"name": artwork.artist.replace(/[$#,.]/g, ""),
										"skinName": "",
										"language": "",
										"region": "",
										"dreaming": "",
										"DOB": "",
										"bio": {
											"title": "",
											"body": "",
											"AASDLink": "",
											"WikiLink": ""
										},
									};

									artworkBulk.insert(artwork);
									imageBulk.insert(image);
									if (uniqueArtists.indexOf(artist) == -1) {
										artistBulk.insert(artist);
										uniqueArtists.push(artist);
									}
								}
								var updateAt = new Date();
								Promise.all(promises)
									.then(() => {
										Promise.all([
											artworkBulk.execute(),
											imageBulk.execute(),
											artistBulk.execute(),
											metaCol.update(
												{key: "last-update"},
												{
													key: "last-update",
													value: updateAt.toLocaleString()
												},
												{upsert: true})
										]).
											then(() => {
												db.close();
												res.status(200).send({update_at: updateAt.toLocaleString()});
											});
									}).catch((err) => {
									res.status(404).send(["Data insert error"]);
									return false;
								});
							})

					});
					// end save data to database
					fs.writeFile("uploads/artworks.json", JSON.stringify([artworksDataArray, imagesArray]), function (err) {
						if (err) {
							res.status(400).send(err);
							return;
						} else {
							fs.unlink("tmp/" + newFileName);
							async.forEach(imagesArray, function (image) {
								var type = image.imageFile.substring("data:image/".length, image.imageFile.indexOf(";base64"))
								fs.writeFile("uploads/images/image-" + image.artwork_id + "." + type, image.imageFile.replace("data:image\/" + type + ";base64,", ""), 'base64', function (err) {
									if (err) {
										res.status(400).send(err);
										return;
									}
								});
							});
						}
					})
				})
				.catch(function (err) {
					res.status(404).send(["Data parse error."]);
					return false;
				})
				.done();
		});
		return req.pipe(busboy);
	}
});

app.post('/save-artworks', function (req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var artworksDataArray = req.body;
	// save data to database
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var artworkCol = db.collection('artworks');
		var imageCol = db.collection('images');
		var artistCol = db.collection('artists');
		var artworkBulk = artworkCol.initializeUnorderedBulkOp();
		var imageBulk = imageCol.initializeUnorderedBulkOp();
		var artistBulk = artistCol.initializeUnorderedBulkOp();

		var uniqueArtists = [];
		for (var it = 0; it < artworksDataArray.length; it++) {
			var artwork = artworksDataArray[it];
			var image = artwork.image;
			delete artwork.image;
			var artist = {
				"name": artwork.artist.replace(/[$#,.]/g, ""),
				"skinName": "",
				"language": "",
				"region": "",
				"dreaming": "",
				"DOB": "",
				"bio": {
					"title": "",
					"body": "",
					"AASDLink": "",
					"WikiLink": ""
				},
			};

			artworkBulk.insert(artwork);
			imageBulk.insert(image);
			if (uniqueArtists.indexOf(artist) == -1) {
				artistBulk.insert(artist);
				uniqueArtists.push(artist);
			}
		}
		Promise.all([
			artworkCol.remove(),
			imageCol.remove(),
			artistCol.remove()
		])
			.then(() => {
				Promise.all([
					artworkBulk.execute(),
					imageBulk.execute(),
					artistBulk.execute()
				]).
					then(() => {
						db.close();
						res.send({data: "success"});
					});
			}).catch((err) => {
			console.error(err);
		});

	});
	// end save data to database
});

app.post('/save-artist', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var data = req.body;
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('artists');

		collection.update({name: data.name}, data, {upsert: true}, function (err, resuslt) {
			res.send({data: "sucess"});
		});
		db.close();
	});
});

app.post('/save-image', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var data = req.body;
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('images');
		collection.update({assetRefNo: data.assetRefNo}, data, {upsert: true}, function (err, resuslt) {
			res.send({data: "sucess"});
		});
		db.close();
	});

});

app.post('/update-artist', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var data = req.body;

	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('artists');
		collection.update({name: data.artist}, {$set: {bio: data.bio}}, function (err, items) {
			res.send({data: "sucess"});
		});
		db.close();
	});
});

app.get('/get-artworks', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('artworks');
		collection.find().sort({assetRefNo: 1}).toArray(function (err, items) {
			res.send(items);
		});
		db.close();
	});
});

app.get('/get-artwork/:id', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var artworkId = req.params.id;
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('artworks');
		collection.findOne({assetRefNo: artworkId}, function (err, items) {
			res.send(items);
		});
		db.close();
	});
});

app.get('/get-image/:id', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var arworkId = req.params.id;
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('images');
		collection.findOne({assetRefNo: arworkId}, function (err, items) {
			res.send(items);
		});
		db.close();
	});

});

app.get('/get-artist/:name', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var name = req.params.name;
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('artists');
		collection.findOne({name: name}, function (err, items) {
			res.send(items);
		});
		db.close();
	});

});

app.get('/get-meta/:key', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var key = req.params.key;
	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}

		var collection = db.collection('meta');
		collection.findOne({key: key}, function (err, items) {
			res.send(items);
		});
		db.close();
	});

});

app.get('/download-backup', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	var fileName = 'assets/backups/artwork-backup.docx';

	MongoClient.connect("mongodb://localhost:27017/serene-brushland", function (err, db) {
		if (err) {
			return console.dir(err);
		}
		var content = [];
		var collection = db.collection('artworks');
		var imageCollection = db.collection('images');

		collection.find().sort({assetRefNo: 1}).toArray(function (err, items) {
			var count = items.length;
			var docxFile = officegen('docx');
			async.forEach(items, function (item) {
				imageCollection.findOne({assetRefNo: item.assetRefNo}, function (err, image) {
					var singleItem = item;

					var type = image.imageFile.substring("data:image/".length, image.imageFile.indexOf(";base64"))
					var imagePath = path.resolve(__dirname + '/app/assets/backups/images/image-' + item.assetRefNo + '.' + type);

					singleItem.imagePath = imagePath;
					singleItem.imageFile = image.imageFile;
					content.push(singleItem);

					fs.writeFile(imagePath, image.imageFile.replace("data:image\/" + type + ";base64,", ""), 'base64', function (err) {
						if (err) {
							res.status(400).send(err);
							return;
						}
						count--;

						if (count === 0) {

							for (var i = 0; i < content.length; i++) {
								var pObj = docxFile.createP();
								pObj.addText('Asset Reference No: ' + content[i].assetRefNo);
								var pObj = docxFile.createP();
								pObj.addText('Artist: ' + content[i].artist);
								var pObj = docxFile.createP();
								pObj.addText('Title: ' + content[i].title);
								var pObj = docxFile.createP();
								pObj.addText('Size: ' + content[i].size);
								var pObj = docxFile.createP();
								pObj.addText('Amount Paid: ' + content[i].amountPaid);
								var pObj = docxFile.createP();
								pObj.addText('Insured: ' + content[i].insured);
								var pObj = docxFile.createP();
								pObj.addText('Provenance: ' + content[i].provenance);
								var pObj = docxFile.createP();
								pObj.addText('Office Location: ' + content[i].officeLocation);
								var pObj = docxFile.createP();
								if (content[i].imageFile.indexOf("data:image/") != -1) {
									pObj.addImage(content[i].imagePath);
								}
								docxFile.putPageBreak();
							}

							var file = fs.createWriteStream(path.resolve(__dirname + '/app/' + fileName));
							docxFile.generate(file);
							file.on('close', function () {
								res.send({data: fileName});
							});
						}
					});


				});

			});

		});

	});

});
/**
 Return the json file from the uploaded document.
 */
app.get('/artworks', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');

	try
	{
		fs.statSync('uploads/uploaded-artworks.json').isFile();
		var artworksFile = fs.readFileSync('uploads/uploaded-artworks.json').toString();
		res.send(artworksFile);
	} catch (err)
	{
		res.status(400).send(err);
	}
});

/**
 Return a particular entry from the json file from the uploaded document.
 */
app.get('/artwork', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var artworkId = req.query.assetRefNo;
	var artworks = fs.readFileSync('uploads/uploaded-artworks.json').toString();
	var artworksJson = JSON.parse(artworks);

	for (var i = 0; i < artworksJson.length; i++) {
		var obj = artworksJson[i];
		if (obj.assetRefNo == artworkId) {
			res.send(JSON.stringify(obj));
			break;
		}
	}
});


app.get('/sample', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var htmlString = fs.readFileSync('data/sample.html').toString()
	var parsedHTML = $.load(htmlString)
	var images = [];
	var locations = [];
	var count = 1;
	console.log('==================================');
	parsedHTML('p b span').map(function (i, element) {
		var item = {};
		var newlines = /\r?\n|\r/g;
		element = $(element);
		var refNo = element.text();
		if (refNo.indexOf('Reference No:') != -1) {
			var photoRefNo = element.parent().children().next().text(); // it's not easy to explain ms word format parsing
			var nextElement = element.parent().parent().next(); // go back to the p and get the next p.
			// get the name of the artist
			var artist = nextElement.text();
			if (artist.indexOf('Artist:') === -1) {
				//console.log(artist+' replaced with ');
				//
				artist = nextElement.children().last().children('span').last().text();
				//console.log(artist);
			}
			nextElement = nextElement.next(); // next title
			var title = nextElement.text();
			nextElement = nextElement.next(); // etc
			var size = nextElement.text();
			nextElement = nextElement.next();
			var amountPaid = nextElement.text();
			nextElement = nextElement.next();
			var insured = nextElement.text();
			nextElement = nextElement.next();
			var supplier = nextElement.text();
			nextElement = nextElement.next();
			var officeLocation = nextElement.text();
			var dm = ["Artist: ", "Title: ",
				"Size: ", "Amount Paid: ", "Insured: ", "Supplier: ", "Office Location: "];
			item.photoRefNo = photoRefNo;
			item.count = count;
			item.artist = artist.substring(dm[0].length, artist.length).replace(newlines, " ");
			item.title = title.substring(dm[1].length, title.length).replace(newlines, " ");
			item.size = size.substring(dm[2].length, size.length);
			item.amountPaid = amountPaid.substring(dm[3].length, artist.length);
			item.insured = insured.substring(dm[4].length, insured.length);
			item.supplier = supplier.substring(dm[5].length, supplier.length);
			item.officeLocation = officeLocation.substring(dm[6].length, officeLocation.length).replace(newlines, " ");
			item.officeLocation = normalizeLocation(item.officeLocation);
			locations.push(item.officeLocation);
			// record 0 has an image src of image001
			if (count < 10) {
				item.src = 'image00' + count + '.jpg';
			} else if (count < 100) {
				item.src = 'image0' + count + '.jpg';
			} else {
				item.src = 'image' + count + '.jpg';
			}
			images.push(item);
			console.log(count + ' title:' + item.title + ' no:' + item.photoRefNo + ' src:' + item.src);
			count++;
		}
	});
	locations = eliminateDuplicates(locations);
	locations.forEach(function (location) {
		//console.log(location);
	});
	var resultString = JSON.stringify(images);
	fs.writeFile("data/word-doc.json", resultString, function (err) {
		if (err) {
			return console.log('err', err);
		}
		console.log("The file was saved~");
	});
	// also save a copy for the app to use
	fs.writeFile("./app/data/word-doc.json", resultString, function (err) {
		if (err) {
			return console.log('err', err);
		} else {
			console.log("The file was saved in ./app/data/word-doc.json");
		}
	});
	res.send(resultString);
});

function normalizeLocation(location) {
	location = location.trim();
	if (location === 'Tony Maple-Brown\’s office') {
		//console.log('1',location);
		return 'St Leonards – Tony\’s Office';
	} else if (location === 'Tony\n’s office') {
		//console.log('2',location);
		return 'St Leonards – Tony\’s Office';
	} else if (location === "St Leonards - Tony's Office Level 3") {
		return 'St Leonards – Tony\’s Office';
	} else {
		//console.log('3',location);
		return location;
	}
}

function eliminateDuplicates(arr) {
	var i,
		len = arr.length,
		out = [],
		obj = {};
	for (i = 0; i < len; i++) {
		obj[arr[i]] = 0;
	}
	for (i in obj) {
		out.push(i);
	}
	return out;
}

/**
 Parse the comma separated values json file.
 */
app.get('/csv', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var csvFile = fs.readFileSync('data/csv.json').toString()
	var obj;
	var works = [];
	var count = 0;
	fs.readFile('data/csv.json', 'utf8', function (err, data) {
		if (err)
			throw err;
		obj = JSON.parse(data);
		obj.forEach(function (item) {
			console.log(item.Title);
		});
		console.log(obj.length);
		var resultString = JSON.stringify(obj);
		res.send(resultString);
	});
});

app.get('/merge', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var obj;
	var works = [];
	var refNumbers = [];
	var locations = [];
	var csvTitleRefs = [];
	var csvCount = 0;
	var docCount = 0;
	var csv_content;
	var htm_content;
	fs.readFile('data/csv.json', function read(err, csv_data) {
		if (err) {
			throw err;
		}
		csv_content = csv_data;
		fs.readFile('data/word-doc.json', function read(err, htm_data) {
			if (err) {
				throw err;
			}
			htm_content = htm_data;
			var csvObj = JSON.parse(csv_data);
			var docObj = JSON.parse(htm_content);
			console.log('== csv ' + csvObj.length + ' doc ' + docObj.length + '==========');
			// go thru each item in the csv file
			csvObj.forEach(function (csvItem) {
				var PhotoRefNo = csvItem.PhotoRefNo;
				var location = csvItem['Office Loation'];
				// remove quotes and join with an @
				var title_artist = csvItem.Title.trim() + '@' + csvItem.Artist.trim();
				title_artist = title_artist.replace(/"/gi, '');
				// add each csv title@artist pair and save it with its ref number
				csvTitleRefs.push(title_artist, PhotoRefNo);
				csvCount++;
				// go thru each word doc entry to look for title/artist matches
				docObj.forEach(function (docItem) {
					var title = docItem.title;
					var artist = docItem.artist;
					var matches = [];
					var title = docItem.title.trim().replace(/"/gi, '');
					// go thru each title@artist key and see if the word doc item matches both
					for (var key in csvTitleRefs) {
						// key is the phot ref number
						if (key === 'length' || !csvTitleRefs.hasOwnProperty(key))
							continue;
						var value = csvTitleRefs[key].toString(); // this should be the title@artist string
						if ((value.indexOf(title) !== -1) && (value.indexOf(artist) !== -1) && title !== '' && artist !== '') {
							console.log(' doc ' + title + ' ' + artist + '');
							console.log(' csv ' + key + ' - ' + value);
						}
					}
				});
			});
		});
	});
});

app.get('/inspect', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var artworkId = req.query.assetRefNo

	var artworks = fs.readFileSync('uploads/uploaded-artworks.json').toString();
	var artworksJson = JSON.parse(artworks);

	for (var i = 0; i < artworksJson.length; i++) {
		if (artworksJson[i].assetRefNo == artworkId) {
			if (artworksJson[i].inspected)
			{
				res.status(200).json(artworksJson[i]);
			} else {
				artworksJson[i].inspected = true;
				fs.writeFile("uploads/uploaded-artworks.json", JSON.stringify(artworksJson), function (err) {
					if (err) {
						res.status(400).send(err);
						return;
					} else {
						res.status(200).json(artworksJson[i]);
					}
				});
				break;
			}
		}
	}
});

/**
 Get the generated word document as a json file.
 */
app.get('/get-inspected-artworks', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var file = fs.readFileSync('uploads/uploaded-artworks.json').toString();
	var uploadedFileJson = JSON.parse(file);
	var inspectedArtworks = [];

	for (var i = 0; i < uploadedFileJson.length; i++) {
		if (uploadedFileJson[i].inspected)
		{
			inspectedArtworks.push(uploadedFileJson[i]);
		}
	}
	res.status(200).json(uploadedFileJson);
});

app.get('/artists', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var artists = curator.getArtists;
	console.log('artists', artists.length);
	res.send(artists);
});

app.get('/artist', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	//var artist = req.query.artist
	var artist = curator.getArtist();
	console.log('artist', artist.length);
	res.send(artist);
});

/** Valuation Document.  Previously called Rockend Valuation 13 Jan 2016.html */
app.get('/valuation', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var htmlString = fs.readFileSync('data/valuation.html').toString()
	var parsedHTML = $.load(htmlString)
	var firstArtist = "Percy Ivor Hunt";
	var items = [];
	var count = 1;
	captureFlag = false;
	console.log('==================================');
	parsedHTML('div').map(function (i, element) {
		var item = {};
		var newlines = /\r?\n|\r/g;
		element = $(element);
		var refNo = element.text();
		if (refNo.indexOf(firstArtist) != -1) {
			count = 1;
			captureFlag = true;
		}
		if (captureFlag == true && count < 10) {
			items.push(item);
			console.log(count + ' - ' + refNo + '\n');
			console.log('==================================\n');
			count++;
		} else {
			//console.log('blank');
		}
	});

	var resultString = JSON.stringify(items);
	res.send(resultString);
});

app.post('/save-from-firebase', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var busboy = new Busboy({headers: req.headers});
	busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
		if (fieldname == "fetched_data")
		{
			fs.writeFile("uploads/firebase-backup.json", val, function (err) {
				if (err) {
					res.status(400).send(err);
					return;
				}
			});
		}
	});
	busboy.on('finish', function () {
		res.send();
	});
	return req.pipe(busboy);
});

app.post('/save-user-permissions', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var busboy = new Busboy({headers: req.headers});
	busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
		if (fieldname == "fetched_data")
		{
			fs.writeFile(".permissions.json", val, function (err) {
				if (err) {
					res.status(400).send(err);
					return;
				}
			});
		}
	});
	busboy.on('finish', function () {
		res.send();
	});
	return req.pipe(busboy);
});

app.post('/is-authorized', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var busboy = new Busboy({headers: req.headers});
	busboy.on('field', function (fieldname, val) {
		var email = JSON.parse(val).email;
		var task = JSON.parse(val).task;

		var file = fs.readFileSync('.permissions.json').toString();
		var assignedPermissions = JSON.parse(file).assignedPermissions;
		var index = assignedPermissions[task].indexOf(email);

		if (index == -1)
		{
			res.status(401).send();
			return;
		} else
		{
			res.status(200).send();
			return;
		}
	});
	busboy.on('finish', function () {
		res.send();
	});
	return req.pipe(busboy);
});

app.post('/add-additional-artwork-data', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if (req.method === 'POST') {
		var busboy = new Busboy({headers: req.headers});
		busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			var datetimestamp = Date.now();
			var fileName = "image-" + datetimestamp + "." + filename.split('.')[filename.split('.').length - 1];
			var saveTo = path.join('./uploads/images/', fileName);
			file.pipe(fs.createWriteStream(saveTo));
		});
		busboy.on('finish', function () {
			res.writeHead(200, {'Connection': 'close'});
			res.end();
		});
		return req.pipe(busboy);
	}

	res.writeHead(404);
	res.end();
});

app.get('/env', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var env = process.env;
	res.send(env);
});

app.get('/auth-roles', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Content-Type', 'application/json');
	var file = fs.readFileSync('.permissions.json').toString();
	var rolesFileJson = JSON.parse(file);
	res.send(rolesFileJson);
});
