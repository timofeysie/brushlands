const express = require('express');
const mongoDb = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const Busboy = require('busboy');
const busboy = require('connect-busboy');

const app = express();

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('server started');
});

let databaseName = 'serene-brushland';
let artworksCollection = 'artworks';
let imageCollection = 'images';
let artistCollection = 'artists';
let permissionCollection = 'permissions';

app.route('/api/artworks').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        {useNewUrlParser: true},
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            var collection = db.collection(artworksCollection);
            collection
                .find()
                .sort({assetRefNo: 1})
                .toArray(function(err, items) {
                    res.send(items);
                    client.close();
                });
        }
    );
});

app.route('/api/artwork/:id').get((req, res) => {
    let artworkId = req.params.id;
    mongoDb.connect(
        'mongodb://localhost:27017',
        {useNewUrlParser: true},
        (err, client) => {
            if (err) {
                return console.dir(err);
            }

            let db = client.db(databaseName);
            let collection = db.collection(artworksCollection);
            collection.findOne({assetRefNo: artworkId}, (err, items) => {
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
        {useNewUrlParser: true},
        (err, client) => {
            if (err) {
                return console.dir(err);
            }

            let db = client.db(databaseName);
            let collection = db.collection(imageCollection);
            collection.findOne({assetRefNo: artworkId}, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/artist/:name').get((req, res) => {
    let name = req.params.name;
    mongoDb.connect(
        'mongodb://localhost:27017',
        {useNewUrlParser: true},
        (err, client) => {
            if (err) {
                return console.dir(err);
            }
            let db = client.db(databaseName);
            let collection = db.collection(artistCollection);
            collection.findOne({name: name}, (err, items) => {
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
        {useNewUrlParser: true},
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
            collection.updateOne({name: name}, newvalues, (err, items) => {
                res.send(items);
            });
            client.close();
        }
    );
});

app.route('/api/permissions/all').get((req, res) => {
    mongoDb.connect(
        'mongodb://localhost:27017',
        {useNewUrlParser: true},
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
        {useNewUrlParser: true},
        (err, client) => {
            if (err) {
                res.status(500);
                res.send();
            }

            let db = client.db(databaseName);
            let collection = db.collection(permissionCollection);

            collection.update(
                {user: req.body.user},
                {user: req.body.user, permissions: req.body.permissions},
                {upsert: true},
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
        {useNewUrlParser: true},
        (err, client) => {
            if (err) {
                res.status(500);
                return res.send();
            }

            let db = client.db(databaseName);
            let collection = db.collection(permissionCollection);

            let user = req.query.user;
            let permission = req.query.permission;

            collection.findOne({user: user}, (err, item) => {
                if (err || !item) {
                    res.status(401);
                    return res.send();
                }
                console.log(item);
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
