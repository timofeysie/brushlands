const express = require('express');
const mongoDb = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const Busboy = require('busboy');
const os = require('os');
const stripTags = require('striptags');
const splitHtml = require('split-html');
const path = require('path');
const mammoth = require('mammoth');
const async = require('async');
const officegen = require('officegen');


const app = express();

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));

app.listen(3000, () => {
    console.log('server started');
});

let databaseName = 'serene-brushland';
let artworksCollection = 'artworks';
let imageCollection = 'images';
let artistCollection = 'artists';
let permissionCollection = 'permissions';
let metaCollection = 'meta';

app.route('/api/artworks').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            var collection = db.collection(artworksCollection);
            collection
                .find()
                .sort({ assetRefNo: 1 })
                .toArray(function (err, items) {
                    res.send(items);
                    client.close();
                });
        }
    );
});

app.route('/api/images').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            var collection = db.collection(imageCollection);
            collection
                .find()
                .sort({ assetRefNo: 1 })
                .toArray(function (err, items) {
                    res.send(items);
                    client.close();
                });
        }
    );
});

app.route('/api/last-update-date').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            var collection = db.collection(metaCollection);

            collection.findOne({ key: 'last-update' }, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/artwork/:id').get((req, res) => {
    let artworkId = req.params.id;
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }

            let db = client.db(databaseName);
            let collection = db.collection(artworksCollection);
            collection.findOne({ assetRefNo: artworkId }, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/image/:id').get((req, res) => {
    let artworkId = req.params.id;
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }

            let db = client.db(databaseName);
            let collection = db.collection(imageCollection);
            collection.findOne({ assetRefNo: artworkId }, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/artist').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            var collection = db.collection(artistCollection);
            collection
                .find()
                .sort({ assetRefNo: 1 })
                .toArray(function (err, items) {
                    res.send(items);
                    client.close();
                });
        }
    );
});

app.route('/api/artist/:name').get((req, res) => {
    let name = req.params.name;
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            let collection = db.collection(artistCollection);
            collection.findOne({ name: name }, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/artist/:name').post((req, res) => {
    let name = req.params.name;
    var data = req.body;
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            let collection = db.collection(artistCollection);
            var newvalues = {
                $set: {
                    bio: {
                        title: data.bio.title,
                        body: data.bio.body,
                        AASDLink: data.bio.AASDLink,
                        WikiLink: data.bio.WikiLink
                    }
                }
            };
            collection.updateOne({ name: name }, newvalues, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/permissions/all').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                res.status(500);
                res.send();
            }

            let db = client.db(databaseName);
            let collection = db.collection(permissionCollection);

            collection.find().toArray((err, items) => {
                res.send(items);
                client.close();
            });
        }
    );
});

app.route('/api/permissions').post((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                res.status(500);
                res.send();
            }

            let db = client.db(databaseName);
            let collection = db.collection(permissionCollection);

            collection.update(
                { user: req.body.user },
                { user: req.body.user, permissions: req.body.permissions },
                { upsert: true },
                (err, items) => {
                    if (err) {
                        res.status(400);
                        res.send(err);
                    }
                    res.send(items);
                }
            );

            client.close;
        }
    );
});

app.route('/api/check-permission').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                res.status(500);
                return res.send();
            }

            let db = client.db(databaseName);
            let collection = db.collection(permissionCollection);

            let user = req.query.user;
            let permission = req.query.permission;

            collection.findOne({ user: user }, (err, item) => {
                if (err || !item) {
                    res.status(401);
                    return res.send();
                }
                const index = item.permissions.indexOf(permission);

                if (index != -1) {
                    res.status(200);
                    return res.send(item);
                }

                res.status(401);
                return res.send();
            });

            client.close();
        }
    );
});

app.route('/api/download-backup').get((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var fileName = '../../backend/artwork-backup.docx';

    mongoDb.connect(
        'mongodb://localhost:27017',
        { useNewUrlParser: true },
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            var content = [];
            let db = client.db(databaseName);
            var artworkCollection = db.collection(artworksCollection);
            var imagesCollection = db.collection(imageCollection);
            artworkCollection
                .find()
                .sort({ assetRefNo: 1 })
                .toArray(function (err, items) {
                    var count = items.length;
                    var docxFile = officegen('docx');
                    async.forEach(items, function (item) {
                        imagesCollection.findOne({ assetRefNo: item.assetRefNo }, function (err, image) {
                            var singleItem = item;

                            var type = image.imageFile.substring("data:image/".length, image.imageFile.indexOf(";base64"))
                            var imagePath = path.resolve(__dirname + '/../src/assets/backups/images/image-' + item.assetRefNo + '.' + type);

                            singleItem.imagePath = imagePath;
                            singleItem.imageFile = image.imageFile;
                            content.push(singleItem);
                            var imageType = image.imageFile.replace("data:image\/" + type + ";base64,", "");

                            fs.writeFile(imagePath, imageType, 'base64', function (err) {
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
                                        res.send({ data: fileName });
                                    });
                                }
                            });
                        });
                    });
                });
        }
    );
});

app.route('/api/save-from-db').post((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req['body']['fetched_data']) {
        fs.writeFile("../uploads/firebase-backup.json", req['body']['fetched_data'], function (err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send({});
            }
            return;
        });
    }
});

app.route('/api/upload').post((req, res) => {

    let busboy = new Busboy({ headers: req.headers });
    let saveTo;

    busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
        if (mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            res.status(400);
            res.send();
            return false;
        }

        saveTo = path.join(os.tmpdir(), path.basename(fieldName));
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', () => {
        mammoth
            .convert({ path: saveTo })
            .then(result => {

                let artworksData = [];
                let artistsData = [];
                let imagesData = [];
                let lastUpdateData = [];

                let resultValues = stripTags(result.value, '<p><img>');
                resultValues = splitHtml(resultValues, 'p');
                resultValues = resultValues.filter(item => item !== '');

                let html = [];

                resultValues.forEach(function (element) {

                    var htmlEntities = {
                        nbsp: ' ',
                        cent: '¢',
                        pound: '£',
                        yen: '¥',
                        euro: '€',
                        copy: '©',
                        reg: '®',
                        lt: '<',
                        gt: '>',
                        quot: '"',
                        amp: '&',
                        apos: '\''
                    };

                    function unescapeHTML(str) {
                        return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
                            var match;

                            if (entityCode in htmlEntities) {
                                return htmlEntities[entityCode];
                                /*eslint no-cond-assign: 0*/
                            } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
                                return String.fromCharCode(parseInt(match[1], 16));
                                /*eslint no-cond-assign: 0*/
                            } else if (match = entityCode.match(/^#(\d+)$/)) {
                                return String.fromCharCode(~~match[1]);
                            } else {
                                return entity;
                            }
                        });
                    };

                    html.push(unescapeHTML(element));
                });

                for (let i = 0; i < html.length; i++) {
                    if (html[i].indexOf('Asset Reference No:') == -1) {
                        continue;
                    }

                    const artistName = grabInfo(html[i + 1], 'Artist:');

                    let artwork = {
                        assetRefNo: grabInfo(html[i], 'Asset Reference No:'),
                        artist: artistName,
                        title: grabInfo(html[i + 2], 'Title:'),
                        size: grabInfo(html[i + 3], 'Size:'),
                        amountPaid: grabInfo(html[i + 4], 'Amount Paid:'),
                        insured: grabInfo(html[i + 5], 'Insured:'),
                        provenance: grabInfo(html[i + 6], 'Provenance:'),
                        officeLocation: grabInfo(html[i + 7], 'Office Location:'),
                        thumbnail: grabInfo(html[i + 8], null),
                        inspected: false,
                        text: ''
                    };

                    artistIndex = artistsData.findIndex(item => item.name == artistName);

                    if (artistIndex === -1) {
                        let artist = {
                            name: artistName,
                            skinName: '',
                            language: '',
                            region: '',
                            dreaming: '',
                            DOB: '',
                            bio: {
                                title: '',
                                body: '',
                                AASDLink: '',
                                WikiLink: ''
                            }
                        };

                        artistsData.push(artist);
                    }

                    let imageObj = {
                        imageFile: artwork.thumbnail,
                        assetRefNo: artwork.assetRefNo,
                        additionalImages: []
                    };



                    artworksData.push(artwork);
                    imagesData.push(imageObj);

                }

                // save data to mongodb
                mongoDb.connect(
                    'mongodb://localhost:27017',
                    { useNewUrlParser: true },
                    (err, client) => {
                        if (err) {
                            res.status(500);
                            return res.send();
                        }

                        let db = client.db(databaseName);
                        let artworkCol = db.collection(artworksCollection);
                        let imageCol = db.collection(imageCollection);
                        let artistCol = db.collection(artistCollection);
                        let metaCol = db.collection(metaCollection);

                        Promise.all([
                            savedata(artworkCol, artworksData),
                            savedata(imageCol, imagesData),
                            savedata(artistCol, artistsData)
                        ])
                            .then(() => {
                                updateData(metaCol);
                                res.send('done');
                                client.close();
                            })
                            .catch(err => console.log(err));
                    }
                );
                // end saving data to mongodb


            })
            .catch(err => {
                console.log(err);
            });
    });

    return req.pipe(busboy);
});

function grabInfo(element, strToRemove) {
    let strippedP = stripTags(element, '<img>');

    if (strToRemove) {
        return strippedP.replace(strToRemove, '').trim();
    }

    let image = strippedP.substr(strippedP.indexOf('data:image'));
    image = image.substr(0, image.indexOf('" '));
    return image;
}

function savedata(col, data) {
    return new Promise((resolve, reject) => {
        col.deleteMany({}, (err, success) => {
            if (err) {
                reject();
            }
            col.insertMany(data, (err, success) => {
                if (err) {
                    reject();
                }
                resolve();
            });
        });
    });
}

function updateData(metaCol) {
    //last update date
    var d = new Date();
    var dateTime = d.toLocaleString();
    return new Promise((resolve, reject) => {
        metaCol.updateOne(
            { "key": "last-update" },
            { $set: { "value": dateTime } }
        );
    });
}
